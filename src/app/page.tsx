import { getOpportunities, saveOpportunities, getTrackingRecords } from "@/lib/store";
import { Briefcase, Calendar, GraduationCap, AlertTriangle, ShieldCheck, PlusCircle, Globe, Lock, Cpu, Sparkles, FileText, CheckCircle2, ArrowRight, Eye, ShieldAlert, Clock, CheckCircle, Server, Network } from "lucide-react";
import Link from "next/link";
import { extractOpportunity } from "@/lib/extractor";
import { redirect } from "next/navigation";
import { DeleteOpportunityButton } from "@/components/DeleteButtons";
import { CyberSecurityDashboard } from "@/components/CyberSecurityDashboard";
import { DashboardSignInBanner } from "@/components/SignInButtons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;
  const userEmail = session?.user?.email || undefined;
  const opportunities = await getOpportunities();
  const trackingRecords = await getTrackingRecords(userEmail);

  async function addOpportunityAction(formData: FormData) {
    "use server";
    const url = formData.get("url") as string;
    if (!url) return;

    // Dynamically fetch and parse the opportunity using Puppeteer
    const newOpp = await extractOpportunity(url);
    
    // Save to store
    const allOpps = await getOpportunities();
    allOpps.unshift(newOpp);
    await saveOpportunities(allOpps);

    // Redirect to the new opportunity verification flow
    redirect(`/opportunity/${newOpp.opportunity_id}`);
  }

  // =========================================================================
  // GUEST / PRE-AUTHENTICATION DASHBOARD VIEW (Showcases Platform Features)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in">
        {/* Guest Top Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-blue">CYBERSHIELD DEFENSE MATRIX</span>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono, monospace" }}>
              PRE-AUTH FEATURE PREVIEW
            </span>
          </div>
          <h1 style={{ fontSize: "2.4rem", marginBottom: "0.35rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Security Operations & Autonomous Form Defense
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0, maxWidth: "800px" }}>
            Autonomous threat detection, encrypted local auto-fill, and cryptographic form telemetry. Explore the defense suite features below, or sign in to access your previous forms and live form analysis.
          </p>
        </div>

        {/* Call to Action: Sign In Banner */}
        <DashboardSignInBanner />

        {/* Cyber Metric Overview KPIs (System Features) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <div className="glass-card card-safe" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(0, 229, 160, 0.15)", border: "1px solid rgba(0, 229, 160, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--safe)" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>System Integrity</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--safe)", fontFamily: "Space Grotesk, sans-serif" }}>SECURE • 100%</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(47, 128, 237, 0.15)", border: "1px solid rgba(47, 128, 237, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
              <Globe size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>Defense Protocol</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>ZERO-LEAKAGE</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(47, 128, 237, 0.12)", border: "1px solid rgba(47, 128, 237, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)" }}>
              <Cpu size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>Inspection Pipeline</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>5 HEURISTIC GATES</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(255, 77, 79, 0.1)", border: "1px solid rgba(255, 77, 79, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--threat)" }}>
              <Lock size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>Threat Shield</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>REAL-TIME ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Cyber Security Presentation Suite (Risk Meter, Architecture, Typing Demo, Privacy, Comparison) */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
                Interactive Defense & Automation Suite
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
                Interactive simulation tools demonstrating risk evaluation, architecture pipeline, and auto-fill tokens.
              </p>
            </div>
            <span className="badge badge-safe">5 FEATURES READY</span>
          </div>

          <CyberSecurityDashboard />
        </div>

        {/* Autonomous Security Scanners Explanation Section (Before Sign-In) */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span className="badge badge-safe">PROACTIVE DEFENSE ENGINE</span>
                <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono, monospace" }}>
                  FULL-STACK SECURITY AUDITING
                </span>
              </div>
              <h2 style={{ fontSize: "1.6rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
                Autonomous Infrastructure Security Scanner
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: "0.2rem 0 0 0" }}>
                In addition to autonomous form defense, CyberShield continuously scans cloud perimeters to block data leaks before deployment.
              </p>
            </div>
            <span className="badge badge-blue">PUBLIC AUDIT TOOLS</span>
          </div>

          <div>

            {/* 2. Infrastructure & CloudSec Scanner Explanation */}
            <div 
              className="glass-card" 
              style={{ 
                borderRadius: "16px", 
                padding: "1.75rem", 
                display: "flex", 
                flexDirection: "column",
                border: "1px solid rgba(0, 229, 160, 0.35)",
                background: "linear-gradient(135deg, rgba(11, 18, 32, 0.9) 0%, rgba(17, 28, 48, 0.6) 100%)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(0, 229, 160, 0.15)", border: "1px solid rgba(0, 229, 160, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--safe)" }}>
                  <Server size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
                    Infrastructure & Cloud Scanner (CloudSec)
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono, monospace" }}>
                    PERIMETER & NETWORK ATTACK SURFACE AUDITING
                  </span>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.55, marginBottom: "1.25rem" }}>
                Probes domain endpoints and host servers to discover accidental port openings and verify that transport encryption and anti-exfiltration policies are strictly enforced.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem" }}>
                  <Network size={16} color="var(--accent-cyan)" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: "#FFFFFF" }}>TCP Socket Port Probes:</strong> Rapid asynchronous connection handshakes identify exposed services (SSH: 22, FTP: 21, Telnet: 23, HTTP: 80, HTTPS: 443, 8080).
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem" }}>
                  <Lock size={16} color="var(--safe)" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: "#FFFFFF" }}>HSTS Encryption Enforcement:</strong> Validates <code>Strict-Transport-Security</code> to eliminate SSL-stripping and downgrade attacks.
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem" }}>
                  <Globe size={16} color="var(--threat)" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: "#FFFFFF" }}>CORS & CSP Exfiltration Defense:</strong> Audits against wildcard <code>*</code> credential theft and missing Content-Security-Policies.
                  </div>
                </div>
              </div>

              <Link 
                href="/scanner/infra" 
                className="btn btn-primary" 
                style={{ textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "linear-gradient(135deg, #00B37A 0%, #00E5A0 100%)", color: "#070D18", fontWeight: 700 }}
              >
                Launch Infrastructure Scanner <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Locked Personal Forms Callout Notice */}
        <div 
          className="glass-card" 
          style={{ 
            padding: "2rem", 
            textAlign: "center", 
            borderRadius: "18px", 
            border: "1px dashed rgba(47, 128, 237, 0.35)", 
            background: "rgba(11, 18, 32, 0.6)" 
          }}
        >
          <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "rgba(47, 128, 237, 0.12)", border: "1px solid rgba(47, 128, 237, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "var(--accent-cyan)" }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: "1.3rem", color: "#FFFFFF", marginBottom: "0.4rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Previous Submitted Forms & Personal Form Analysis Locked
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
            To safeguard applicant privacy and credentials, your past form submissions, form link analysis, and live application pipeline records are revealed only after signing in.
          </p>
          <div style={{ display: "inline-flex", gap: "0.75rem" }}>
            <DashboardSignInBanner />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED DASHBOARD VIEW (Shows Previous Forms & Live Form Analysis)
  // =========================================================================
  return (
    <div className="animate-fade-in">
      {/* Dashboard Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
            <span className="badge badge-safe">CYBERSHIELD DEFENSE MATRIX</span>
            <span style={{ fontSize: "0.78rem", color: "var(--safe)", fontFamily: "JetBrains Mono, monospace" }}>
              • OPERATOR: {session?.user?.name || session?.user?.email || "AUTHENTICATED"}
            </span>
            <span className="badge badge-blue" style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace" }}>
              WORKSPACE: {session?.user?.email}
            </span>
          </div>
          <h1 style={{ fontSize: "2.4rem", marginBottom: "0.35rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Security Operations & Form Intelligence
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
            Inspect your workspace forms, analyze target URLs, and autofill application forms safely.
          </p>
        </div>

        {/* Link Analyzer Input */}
        <form action={addOpportunityAction} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <input 
              name="url" 
              type="url" 
              required 
              placeholder="Paste raw form or application URL..." 
              className="input-field" 
              style={{ minWidth: "360px", padding: "0.85rem 1.25rem", fontFamily: "JetBrains Mono, monospace", fontSize: "0.88rem" }} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "0.85rem 1.4rem" }}>
            <PlusCircle size={18} /> Analyze Target
          </button>
        </form>
      </div>

      {/* Cyber Metric KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="glass-card card-safe" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(0, 229, 160, 0.15)", border: "1px solid rgba(0, 229, 160, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--safe)" }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>System Integrity</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--safe)", fontFamily: "Space Grotesk, sans-serif" }}>SECURE • 100%</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(47, 128, 237, 0.15)", border: "1px solid rgba(47, 128, 237, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
            <Globe size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>Real Gmail Sync</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>CONNECTED</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(47, 128, 237, 0.12)", border: "1px solid rgba(47, 128, 237, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)" }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>Previous Forms</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>{trackingRecords.length} Submitted</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(255, 77, 79, 0.1)", border: "1px solid rgba(255, 77, 79, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--threat)" }}>
            <Lock size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>Phishing Blocked</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>0 Active Threats</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PREVIOUS SUBMITTED FORMS & LIVE ANALYSIS SECTION (AUTHENTICATED ONLY)     */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
              <span className="badge badge-safe">AUTHENTICATED TELEMETRY</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>LIVE STORE</span>
            </div>
            <h2 style={{ fontSize: "1.6rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
              Your Previous Submitted Forms & Analysis
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
              Verified form responses, live submission screenshots, and cryptographic tracking records.
            </p>
          </div>
          <Link href="/tracking" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", textDecoration: "none" }}>
            Open Full Tracker <ArrowRight size={14} />
          </Link>
        </div>

        {trackingRecords.length === 0 ? (
          <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", borderRadius: "14px" }}>
            <FileText size={40} color="var(--accent-primary)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ color: "#FFFFFF", marginBottom: "0.5rem" }}>No Previous Submissions Found</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 auto 1rem", maxWidth: "500px" }}>
              Submit an application form using the analyzer above or choose an opportunity below to start tracking submission receipts and screenshot proofs.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
            {trackingRecords.map((record) => (
              <div 
                key={record.opportunity_id} 
                className="glass-card" 
                style={{ 
                  borderRadius: "16px", 
                  padding: "1.5rem", 
                  display: "flex", 
                  flexDirection: "column",
                  border: "1px solid rgba(0, 229, 160, 0.25)",
                  background: "linear-gradient(135deg, rgba(11, 18, 32, 0.8) 0%, rgba(17, 28, 48, 0.5) 100%)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
                      {record.title}
                    </h3>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace", marginTop: "0.2rem" }}>
                      {record.org}
                    </div>
                  </div>
                  <span className={`badge ${record.status === "interview" ? "badge-safe" : record.status === "confirmed" ? "badge-blue" : "badge-safe"}`} style={{ textTransform: "uppercase", fontSize: "0.72rem" }}>
                    {record.status}
                  </span>
                </div>

                {/* Submitted Fields Pill Summary */}
                {record.submitted_data && Object.keys(record.submitted_data).length > 0 && (
                  <div style={{ background: "var(--bg-tertiary)", padding: "0.85rem", borderRadius: "10px", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono, monospace", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                      Verified Form Inputs ({Object.keys(record.submitted_data).length} Fields):
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {Object.entries(record.submitted_data).map(([key, val]) => (
                        <span key={key} style={{ fontSize: "0.78rem", background: "rgba(0,0,0,0.3)", padding: "0.25rem 0.6rem", borderRadius: "6px", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "JetBrains Mono, monospace" }}>
                          <strong>{key}:</strong> {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screenshot Verification Proof Thumbnail */}
                {record.screenshot_url && (
                  <div style={{ marginBottom: "1rem", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(0, 229, 160, 0.2)" }}>
                    <div style={{ padding: "0.4rem 0.75rem", background: "var(--bg-tertiary)", fontSize: "0.72rem", color: "var(--safe)", fontFamily: "JetBrains Mono, monospace", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>📷 SUBMISSION PROOF SCREENSHOT</span>
                      <a href={record.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}>
                        View Full
                      </a>
                    </div>
                    <img 
                      src={record.screenshot_url} 
                      alt="Form Confirmation Proof" 
                      style={{ width: "100%", maxHeight: "140px", objectFit: "cover", display: "block" }} 
                    />
                  </div>
                )}

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={12} /> {new Date(record.last_updated).toLocaleDateString()}
                  </span>
                  <Link 
                    href={`/opportunity/${record.opportunity_id}`} 
                    className="btn btn-primary" 
                    style={{ fontSize: "0.82rem", padding: "0.5rem 1rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    Review Form & Analysis <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE VERIFIED APPLICATION OPPORTUNITIES & FORM ANALYSIS                  */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
              Active Verified Application Opportunities & Form Analysis
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
              Heuristically parsed form targets ready for review & automated local submission.
            </p>
          </div>
          <span className="badge badge-neutral">{opportunities.length} Opportunities Stored</span>
        </div>

        {/* Opportunities Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.75rem" }}>
          {opportunities.map((opp) => (
            <div key={opp.opportunity_id} className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.35rem", color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>{opp.title}</h3>
                  <div style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem" }}>
                    <Briefcase size={15} color="var(--accent-cyan)" /> {opp.org}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge badge-blue" style={{ textTransform: "capitalize" }}>
                    {opp.type}
                  </span>
                  <DeleteOpportunityButton id={opp.opportunity_id} title={opp.title} />
                </div>
              </div>

              <div style={{ margin: "1.5rem 0", flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem" }}>
                  <GraduationCap size={16} color="var(--safe)" />
                  <span style={{ color: "var(--text-secondary)" }}>Min CGPA:</span> <span style={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "JetBrains Mono, monospace" }}>{opp.requirements.min_cgpa}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem" }}>
                  <Calendar size={16} color="var(--accent-cyan)" />
                  <span style={{ color: "var(--text-secondary)" }}>Deadline:</span> <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "Rolling Admission"}</span>
                </div>
              </div>

              {opp.data_quality === "incomplete" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.25)", color: "var(--warning)", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.82rem" }}>
                  <AlertTriangle size={15} />
                  Missing data (e.g. deadline). Verify before applying.
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
                <Link href={`/opportunity/${opp.opportunity_id}`} className="btn btn-primary" style={{ flex: 1, textDecoration: "none", textAlign: "center" }}>
                  View & Fill Application
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CYBER DEFENSE PRESENTATION & TELEMETRY SUITE                              */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
              Cyber Defense & Security Heuristics Reference
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
              Active telemetry simulation, architecture flow, and client-side encryption matrix.
            </p>
          </div>
          <span className="badge badge-safe">DEFENSE READY</span>
        </div>

        <CyberSecurityDashboard />
      </div>
    </div>
  );
}
