"use server";

import { 
  deleteOpportunity, 
  deleteTrackingRecord, 
  deleteEmailOpportunity, 
  getOpportunities, 
  getUserProfile, 
  saveUserProfile, 
  saveTrackingRecord 
} from "@/lib/store";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteOpportunityAction(id: string) {
  if (!id) throw new Error("No opportunity ID provided");
  console.log(`[Delete Action] Deleting opportunity: ${id}`);
  await deleteOpportunity(id);
  revalidatePath("/");
  revalidatePath("/tracking");
  return { success: true };
}

export async function deleteTrackingRecordAction(id: string) {
  if (!id) throw new Error("No tracking record ID provided");
  console.log(`[Delete Action] Deleting tracking record: ${id}`);
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || undefined;
  await deleteTrackingRecord(id, userEmail);
  revalidatePath("/tracking");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEmailOpportunityAction(id: string) {
  if (!id) throw new Error("No email opportunity ID provided");
  console.log(`[Delete Action] Deleting email opportunity: ${id}`);
  await deleteEmailOpportunity(id);
  revalidatePath("/tracking");
  return { success: true };
}

import { submitRealFormOnline } from "@/lib/submitter";

export async function submitApplicationAction(
  opportunityId: string,
  fieldValues: Record<string, string>,
  saveToProfile: boolean
) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || fieldValues["Email"] || fieldValues["email"] || "induja2103@gmail.com";

  const opportunities = await getOpportunities();
  const opportunity = opportunities.find((o) => o.opportunity_id === opportunityId);

  if (!opportunity) {
    throw new Error("Opportunity not found");
  }

  // 1. Perform live web form submission to the target URL via Puppeteer
  const submissionResult = await submitRealFormOnline(opportunity.apply_url, fieldValues);

  // 2. Save Tracking Record with live submission screenshot proof
  await saveTrackingRecord({
    opportunity_id: opportunity.opportunity_id,
    org: opportunity.org,
    title: opportunity.title,
    status: "submitted",
    last_updated: new Date().toISOString(),
    submitted_data: fieldValues,
    screenshot_url: submissionResult.screenshotUrl,
    user_email: userEmail
  }, userEmail);

  // 3. Save missing inputs to Profile if requested
  if (saveToProfile) {
    const profile = await getUserProfile(userEmail);
    if (profile) {
      let profileUpdated = false;
      const extraDetails = profile.extra_details ? [...profile.extra_details] : [];

      for (const [key, value] of Object.entries(fieldValues)) {
        if (!value || !value.trim()) continue;
        const lowerKey = key.toLowerCase();

        // Standard Phone check
        if ((lowerKey.includes("phone") || lowerKey.includes("mobile") || lowerKey.includes("contact")) && !profile.phone_number) {
          profile.phone_number = value.trim();
          profileUpdated = true;
        } else if (
          !lowerKey.includes("first name") && 
          !lowerKey.includes("last name") && 
          !lowerKey.includes("email") && 
          !lowerKey.includes("essay") && 
          !lowerKey.includes("gpa") && 
          !lowerKey.includes("cgpa") &&
          !lowerKey.includes("university") &&
          !lowerKey.includes("resume")
        ) {
          // Store as custom extra detail if not existing
          const existingIdx = extraDetails.findIndex(e => e.key.toLowerCase() === lowerKey);
          if (existingIdx >= 0) {
            extraDetails[existingIdx].value = value.trim();
          } else {
            extraDetails.push({
              id: `extra_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              key: key.trim(),
              value: value.trim()
            });
          }
          profileUpdated = true;
        }
      }

      if (profileUpdated) {
        profile.extra_details = extraDetails;
        await saveUserProfile(profile, userEmail);
        revalidatePath("/profile");
      }
    }
  }

  revalidatePath("/tracking");
  revalidatePath(`/opportunity/${opportunityId}`);
  return { success: true, submissionResult };
}
