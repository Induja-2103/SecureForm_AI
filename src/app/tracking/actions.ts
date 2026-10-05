"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEmailOpportunities, saveEmailOpportunities } from "@/lib/store";
import { revalidatePath } from "next/cache";

export async function getConnectedGoogleAccountAction() {
  const { getConnectedGoogleAccount } = await import("@/lib/gmail");
  return getConnectedGoogleAccount();
}

export async function syncGmailForUserAction(gmailId: string) {
  const normalizedEmail = (gmailId || "").trim().toLowerCase();
  
  try {
    const { getTrackingRecords, saveTrackingRecord, getEmailOpportunities, saveEmailOpportunities } = await import("@/lib/store");
    const { getValidGmailToken } = await import("@/lib/gmail");
    
    // 1. Obtain live, automatically refreshed Gmail OAuth token for real inbox
    const gmailAuth = await getValidGmailToken(normalizedEmail);

    if (!gmailAuth || !gmailAuth.accessToken) {
      return {
        success: false,
        error: `No authorized Google OAuth account found for "${normalizedEmail || 'Gmail'}". Please sign in with Google to sync your real Gmail inbox.`
      };
    }

    console.log(`[Gmail Sync] Live Gmail OAuth token active for ${gmailAuth.email}. Fetching authentic emails from Google...`);

    const records = await getTrackingRecords(normalizedEmail);
    const existingEmails = await getEmailOpportunities(normalizedEmail);
    // Filter out any previous synthetic confirmation items so only authentic emails remain
    const cleanExisting = existingEmails.filter(e => !e.id.startsWith("confirm_") && !e.from.includes("forms-receipts-noreply"));
    const existingIds = new Set(cleanExisting.map(e => e.id));

    let newEmailsAdded = 0;

    // Search query for recruitment, applications, Google Form submissions, assessments, assignments
    const searchQueries = [
      'form OR response OR application OR submitted OR recruitment OR interview OR internshala OR hiring OR assignment',
      ''
    ];

    const messageIdsToFetch: string[] = [];

    for (const q of searchQueries) {
      if (messageIdsToFetch.length >= 25) break;

      const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20' + (q ? '&q=' + encodeURIComponent(q) : '');
      const listRes = await fetch(url, {
        headers: { Authorization: `Bearer ${gmailAuth.accessToken}` }
      });

      if (listRes.ok) {
        const listData = await listRes.json();
        const msgs = listData.messages || [];
        for (const m of msgs) {
          if (!existingIds.has(m.id) && !messageIdsToFetch.includes(m.id)) {
            messageIdsToFetch.push(m.id);
          }
        }
      }
    }

    console.log(`[Gmail Sync] Fetching full details for ${messageIdsToFetch.length} authentic emails from ${gmailAuth.email}...`);

    for (const msgId of messageIdsToFetch) {
      try {
        const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}`, {
          headers: { Authorization: `Bearer ${gmailAuth.accessToken}` }
        });

        if (msgRes.ok) {
          const msgData = await msgRes.json();
          const headers = msgData.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
          const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
          const dateRaw = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
          const snippet = msgData.snippet || '';

          const lowerContent = (subject + ' ' + from + ' ' + snippet).toLowerCase();

          // Categorize authentic message
          let category: "internship" | "scholarship" | "education_form" | "application_confirmation" | "interview" | "other" = "other";
          
          if (
            lowerContent.includes("we received your application") || 
            lowerContent.includes("application received") || 
            lowerContent.includes("response has been recorded") || 
            lowerContent.includes("response receipt") ||
            lowerContent.includes("thank you for applying") ||
            lowerContent.includes("form submission")
          ) {
            category = "application_confirmation";
          } else if (
            lowerContent.includes("assignment") || 
            lowerContent.includes("interview") || 
            lowerContent.includes("shortlist") || 
            lowerContent.includes("assessment") ||
            lowerContent.includes("coding challenge") ||
            lowerContent.includes("next round")
          ) {
            category = "interview";
          } else if (lowerContent.includes("internship") || lowerContent.includes("intern")) {
            category = "internship";
          } else if (lowerContent.includes("scholarship") || lowerContent.includes("fellowship")) {
            category = "scholarship";
          } else if (lowerContent.includes("job") || lowerContent.includes("developer") || lowerContent.includes("hiring")) {
            category = "internship";
          }

          // Correlate with user's submitted forms in tracking records
          const matchingRecord = records.find(r => {
            const rt = r.title.toLowerCase();
            const ro = r.org.toLowerCase();
            return (rt.length > 3 && lowerContent.includes(rt)) ||
                   (ro.length > 3 && lowerContent.includes(ro)) ||
                   (category === 'application_confirmation' || category === 'interview');
          });

          cleanExisting.unshift({
            id: msgId,
            subject,
            from,
            snippet,
            category,
            confidence: 0.98,
            date: dateRaw ? new Date(dateRaw).toISOString() : new Date().toISOString(),
            related_opportunity_id: matchingRecord?.opportunity_id,
            related_form_title: matchingRecord?.title
          });

          existingIds.add(msgId);
          newEmailsAdded++;

          // Advance tracking record status when confirmed or shortlisted
          if (matchingRecord && (category === "application_confirmation" || category === "interview")) {
            matchingRecord.status = category === "interview" ? "interview" : "confirmed";
            matchingRecord.last_updated = new Date().toISOString();
            await saveTrackingRecord(matchingRecord, normalizedEmail);
          }
        }
      } catch (err: any) {
        console.warn(`[Gmail Sync] Error fetching message ${msgId}:`, err.message);
      }
    }

    await saveEmailOpportunities(cleanExisting, normalizedEmail);
    revalidatePath("/tracking");
    revalidatePath("/");

    return {
      success: true,
      count: newEmailsAdded,
      email: gmailAuth.email,
      message: `Successfully synced ${newEmailsAdded} authentic emails from your Google inbox (${gmailAuth.email})!`
    };
  } catch (error: any) {
    console.error("[Gmail Sync] Action error:", error);
    return { success: false, error: error.message || "Failed to sync real Gmail." };
  }
}

export async function fetchAndAnalyzeEmailsAction() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userEmail = session?.user?.email || "induja@gmail.com";
  return syncGmailForUserAction(userEmail);
}

export async function registerEmailOpportunityAction(formData: FormData) {
  const snippet = formData.get("snippet") as string;
  const subject = formData.get("subject") as string;
  const emailId = formData.get("emailId") as string;

  // Attempt to extract a URL from the snippet
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = snippet.match(urlRegex);
  let targetUrl = match && match.length > 0 ? match[0] : "https://example.com/mock-application";

  // Run the standard extraction flow
  const { extractOpportunity } = await import("@/lib/extractor");
  const newOpp = await extractOpportunity(targetUrl);
  
  // Override title to use email subject to maintain context
  newOpp.title = subject.substring(0, 50);

  const { getOpportunities, saveOpportunities } = await import("@/lib/store");
  const allOpps = await getOpportunities();
  allOpps.unshift(newOpp);
  await saveOpportunities(allOpps);

  // Optionally, we could remove the email opportunity from the list here,
  // but for the demo we'll leave it.

  const { redirect } = await import("next/navigation");
  redirect(`/opportunity/${newOpp.opportunity_id}`);
}
