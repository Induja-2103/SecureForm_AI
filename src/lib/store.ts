import fs from "fs/promises";
import path from "path";
import { UserProfile, TrackingRecord, Opportunity, SecurityLog, EmailOpportunity } from "../types";

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");
const PROFILES_FILE = path.join(DATA_DIR, "profiles.json");
const TRACKING_FILE = path.join(DATA_DIR, "tracking.json");
const OPPORTUNITIES_FILE = path.join(DATA_DIR, "opportunities.json");
const SECURITY_LOGS_FILE = path.join(DATA_DIR, "security_logs.json");
const EMAIL_OPPS_FILE = path.join(DATA_DIR, "email_opportunities.json");

// Ensure data directory and files exist
async function initStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  
  const files = [
    { path: PROFILE_FILE, defaultContent: "{}" },
    { path: PROFILES_FILE, defaultContent: "{}" },
    { path: TRACKING_FILE, defaultContent: "[]" },
    { path: OPPORTUNITIES_FILE, defaultContent: "[]" },
    { path: SECURITY_LOGS_FILE, defaultContent: "[]" },
    { path: EMAIL_OPPS_FILE, defaultContent: "[]" }
  ];

  for (const file of files) {
    try {
      await fs.access(file.path);
    } catch {
      await fs.writeFile(file.path, file.defaultContent, "utf-8");
    }
  }
}

// ============================================================================
// Multi-User Profile Management (Isolated Per User Session)
// ============================================================================

async function getAllProfilesMap(): Promise<Record<string, UserProfile>> {
  await initStore();
  try {
    const data = await fs.readFile(PROFILES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, UserProfile>;
    }
  } catch {
    // fallback
  }
  return {};
}

export async function getUserProfile(userEmail?: string): Promise<UserProfile | null> {
  await initStore();
  const profiles = await getAllProfilesMap();
  const normalizedEmail = userEmail?.trim().toLowerCase();

  if (normalizedEmail) {
    // 1. Direct match in profiles map
    if (profiles[normalizedEmail]) {
      return profiles[normalizedEmail];
    }

    // 2. Check if this is the default operator (induja)
    if (normalizedEmail === "induja2103@gmail.com" || normalizedEmail.includes("induja")) {
      try {
        const raw = await fs.readFile(PROFILE_FILE, "utf-8");
        const defaultProfile = JSON.parse(raw);
        if (defaultProfile && defaultProfile.email) {
          profiles[normalizedEmail] = defaultProfile;
          await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2), "utf-8");
          return defaultProfile as UserProfile;
        }
      } catch {
        // continue to create new
      }
    }

    // 3. Newly registered or different user -> initialize a clean, isolated personal workspace profile
    const usernamePart = normalizedEmail.split("@")[0] || "User";
    const freshProfile: UserProfile = {
      user_id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      first_name: usernamePart,
      last_name: "",
      email: normalizedEmail,
      phone_number: "",
      extra_details: [],
      education: [],
      skills: [],
      certifications: [],
      experience: [],
      documents: {
        resume_url: "",
        transcript_url: ""
      },
      preferences: {
        opportunity_types: ["internship", "job"],
        locations: ["Remote"],
        min_stipend: 0
      }
    };

    profiles[normalizedEmail] = freshProfile;
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2), "utf-8");
    return freshProfile;
  }

  // Fallback for unauthenticated or legacy callers
  try {
    const data = await fs.readFile(PROFILE_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Object.keys(parsed).length === 0 ? null : (parsed as UserProfile);
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile, userEmail?: string): Promise<void> {
  await initStore();
  const profiles = await getAllProfilesMap();
  const normalizedEmail = (userEmail || profile.email || "induja2103@gmail.com").trim().toLowerCase();

  profiles[normalizedEmail] = {
    ...profile,
    email: normalizedEmail
  };

  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2), "utf-8");

  // Keep single legacy profile.json in sync for default operator
  if (normalizedEmail === "induja2103@gmail.com" || normalizedEmail.includes("induja")) {
    await fs.writeFile(PROFILE_FILE, JSON.stringify(profile, null, 2), "utf-8");
  }
}

// ============================================================================
// Multi-User Tracking Records (Partitioned Per User Session)
// ============================================================================

export async function getTrackingRecords(userEmail?: string): Promise<TrackingRecord[]> {
  await initStore();
  const data = await fs.readFile(TRACKING_FILE, "utf-8");
  const allRecords = JSON.parse(data) as TrackingRecord[];

  if (!userEmail) {
    return allRecords;
  }

  const clean = userEmail.trim().toLowerCase();
  return allRecords.filter((r) => {
    const recEmail = (r.user_email || r.submitted_data?.Email || "").trim().toLowerCase();
    if (recEmail === clean) return true;
    if ((clean === "induja2103@gmail.com" || clean.includes("induja")) && (!recEmail || recEmail.includes("induja"))) {
      return true;
    }
    return false;
  });
}

export async function saveTrackingRecord(record: TrackingRecord, userEmail?: string): Promise<void> {
  await initStore();
  const data = await fs.readFile(TRACKING_FILE, "utf-8");
  const records = JSON.parse(data) as TrackingRecord[];

  const cleanEmail = (userEmail || record.user_email || record.submitted_data?.Email || "induja2103@gmail.com").trim().toLowerCase();
  record.user_email = cleanEmail;

  const index = records.findIndex(
    (r) => r.opportunity_id === record.opportunity_id && (r.user_email?.toLowerCase() === cleanEmail || !r.user_email)
  );
  
  if (index >= 0) {
    records[index] = record;
  } else {
    records.unshift(record);
  }
  
  await fs.writeFile(TRACKING_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export async function deleteTrackingRecord(id: string, userEmail?: string): Promise<void> {
  await initStore();
  const data = await fs.readFile(TRACKING_FILE, "utf-8");
  const records = JSON.parse(data) as TrackingRecord[];
  
  const cleanEmail = userEmail?.trim().toLowerCase();
  const filtered = records.filter((r) => {
    if (r.opportunity_id !== id) return true;
    if (cleanEmail && r.user_email && r.user_email.toLowerCase() !== cleanEmail) {
      return true; // Keep other users' records with the same opportunity_id
    }
    return false;
  });

  await fs.writeFile(TRACKING_FILE, JSON.stringify(filtered, null, 2), "utf-8");
}

// ============================================================================
// Public / Common Opportunities Catalog (Shared Catalog For All Users)
// ============================================================================

export async function getOpportunities(): Promise<Opportunity[]> {
  await initStore();
  const data = await fs.readFile(OPPORTUNITIES_FILE, "utf-8");
  return JSON.parse(data) as Opportunity[];
}

export async function saveOpportunities(opportunities: Opportunity[]): Promise<void> {
  await initStore();
  await fs.writeFile(OPPORTUNITIES_FILE, JSON.stringify(opportunities, null, 2), "utf-8");
}

export async function deleteOpportunity(id: string): Promise<void> {
  await initStore();
  const opps = await getOpportunities();
  const initialCount = opps.length;
  const filteredOpps = opps.filter(o => o.opportunity_id !== id);
  console.log(`[Store] deleteOpportunity: id=${id}, count: ${initialCount} -> ${filteredOpps.length}`);
  await saveOpportunities(filteredOpps);

  // Also delete associated tracking records
  try {
    const records = await getTrackingRecords();
    const filteredRecords = records.filter(r => r.opportunity_id !== id);
    await fs.writeFile(TRACKING_FILE, JSON.stringify(filteredRecords, null, 2), "utf-8");
  } catch (err) {
    console.error("[Store] Error deleting associated tracking records:", err);
  }

  // Also delete matching email opportunity if any
  try {
    const emailOpps = await getEmailOpportunities();
    const filteredEmailOpps = emailOpps.filter(e => e.id !== id && e.opportunity_id !== id);
    await saveEmailOpportunities(filteredEmailOpps);
  } catch (err) {
    console.error("[Store] Error deleting matching email opportunities:", err);
  }
}

// ============================================================================
// Multi-User Email Opportunities / Synced Gmail Receipts
// ============================================================================

export async function getEmailOpportunities(userEmail?: string): Promise<EmailOpportunity[]> {
  await initStore();
  try {
    const data = await fs.readFile(EMAIL_OPPS_FILE, "utf-8");
    const all = JSON.parse(data) as EmailOpportunity[];

    if (!userEmail) {
      return all;
    }

    const clean = userEmail.trim().toLowerCase();
    return all.filter((e) => {
      const em = (e.user_email || "").trim().toLowerCase();
      if (em === clean) return true;
      if ((clean === "induja2103@gmail.com" || clean.includes("induja")) && (!em || em.includes("induja"))) {
        return true;
      }
      return false;
    });
  } catch {
    return [];
  }
}

export async function saveEmailOpportunities(opps: EmailOpportunity[], userEmail?: string): Promise<void> {
  await initStore();
  
  if (!userEmail) {
    await fs.writeFile(EMAIL_OPPS_FILE, JSON.stringify(opps, null, 2), "utf-8");
    return;
  }

  const cleanEmail = userEmail.trim().toLowerCase();
  
  // Load existing and keep emails from other users
  let allExisting: EmailOpportunity[] = [];
  try {
    const data = await fs.readFile(EMAIL_OPPS_FILE, "utf-8");
    allExisting = JSON.parse(data) as EmailOpportunity[];
  } catch {
    allExisting = [];
  }

  const otherUsersEmails = allExisting.filter(e => {
    const em = (e.user_email || "").trim().toLowerCase();
    if (cleanEmail === "induja2103@gmail.com" || cleanEmail.includes("induja")) {
      return em && !em.includes("induja") && em !== "induja2103@gmail.com";
    }
    return em !== cleanEmail;
  });

  const taggedOpps = opps.map(o => ({ ...o, user_email: cleanEmail }));
  const merged = [...taggedOpps, ...otherUsersEmails];

  await fs.writeFile(EMAIL_OPPS_FILE, JSON.stringify(merged, null, 2), "utf-8");
}

export async function deleteEmailOpportunity(id: string): Promise<void> {
  const emailOpps = await getEmailOpportunities();
  const filtered = emailOpps.filter(e => e.id !== id);
  await saveEmailOpportunities(filtered);
}

// ============================================================================
// Security Logs
// ============================================================================

export async function getSecurityLogs(): Promise<SecurityLog[]> {
  await initStore();
  const data = await fs.readFile(SECURITY_LOGS_FILE, "utf-8");
  return JSON.parse(data) as SecurityLog[];
}

export async function saveSecurityLog(log: SecurityLog): Promise<void> {
  const logs = await getSecurityLogs();
  logs.unshift(log); // Add to beginning
  await fs.writeFile(SECURITY_LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
}
