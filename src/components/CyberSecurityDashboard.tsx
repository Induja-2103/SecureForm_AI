"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Lock, Cpu, Database, 
  ArrowRight, CheckCircle2, XCircle, Sparkles, Terminal, Eye, FileText, Zap, Key
} from "lucide-react";

export function CyberSecurityDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "flow" | "privacy" | "comparison" | "autofill">("overview");
  const [simulatedRiskState, setSimulatedRiskState] = useState<"safe" | "suspicious" | "threat">("safe");
  
  // Typing animation for auto-fill preview
  const [typedName, setTypedName] = useState("");
  const [typedEmail, setTypedEmail] = useState("");
  const [typedCollege, setTypedCollege] = useState("");
  const fullName = "Induja S";
  const emailVal = "induja2103@gmail.com";
  const collegeVal = "Dr NGP Institute of Technology";

  useEffect(() => {
    let nameIdx = 0;
    let emailIdx = 0;
    let collegeIdx = 0;

    const interval = setInterval(() => {
      if (nameIdx <= fullName.length) {
        setTypedName(fullName.slice(0, nameIdx));
        nameIdx++;
      } else if (emailIdx <= emailVal.length) {
        setTypedEmail(emailVal.slice(0, emailIdx));
        emailIdx++;
      } else if (collegeIdx <= collegeVal.length) {
        setTypedCollege(collegeVal.slice(0, collegeIdx));
        collegeIdx++;
      } else {
        // Reset loop after 3.5 seconds
        setTimeout(() => {
          nameIdx = 0;
          emailIdx = 0;
          collegeIdx = 0;
          setTypedName("");
          setTypedEmail("");
          setTypedCollege("");
        }, 3500);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: "2.5rem" }}>
      {/* Top Navigation Tabs */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        padding: "0.4rem",
        borderRadius: "14px",
        background: "rgba(11, 18, 32, 0.8)",
        border: "1px solid rgba(47, 128, 237, 0.2)",
        marginBottom: "1.5rem",
        overflowX: "auto"
      }}>
        {[
          { id: "overview", label: "Security Risk Meter", icon: ShieldCheck },
          { id: "flow", label: "Architecture Pipeline", icon: Cpu },
          { id: "autofill", label: "Auto-Fill Typing Demo", icon: Terminal },
          { id: "privacy", label: "Encryption & Privacy Panel", icon: Lock },
          { id: "comparison", label: "Before vs After", icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                borderRadius: "10px",
                border: isActive ? "1px solid rgba(0, 216, 246, 0.5)" : "1px solid transparent",
                background: isActive ? "linear-gradient(135deg, rgba(47, 128, 237, 0.25) 0%, rgba(0, 216, 246, 0.12) 100%)" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={16} color={isActive ? "var(--accent-cyan)" : "currentColor"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Security Score & Risk Meter */}
      {activeTab === "overview" && (
        <div className="glass-card animate-fade-in" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                <span className="badge badge-safe">CYBER DEFENSE SUITE</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>REAL-TIME HEURISTICS</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", color: "#FFFFFF", margin: 0 }}>Form Threat & Risk Evaluation Meter</h2>
            </div>

            {/* Presentation Simulation Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(7, 13, 24, 0.8)", padding: "0.35rem 0.6rem", borderRadius: "10px", border: "1px solid rgba(47, 128, 237, 0.2)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", marginRight: "0.25rem" }}>TEST STATE:</span>
              <button 
                onClick={() => setSimulatedRiskState("safe")}
                style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", border: "none", cursor: "pointer", background: simulatedRiskState === "safe" ? "var(--safe)" : "transparent", color: simulatedRiskState === "safe" ? "#070D18" : "var(--safe)", fontWeight: 700 }}
              >
                Safe
              </button>
              <button 
                onClick={() => setSimulatedRiskState("suspicious")}
                style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", border: "none", cursor: "pointer", background: simulatedRiskState === "suspicious" ? "var(--warning)" : "transparent", color: simulatedRiskState === "suspicious" ? "#070D18" : "var(--warning)", fontWeight: 700 }}
              >
                Suspicious
              </button>
              <button 
                onClick={() => setSimulatedRiskState("threat")}
                style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", border: "none", cursor: "pointer", background: simulatedRiskState === "threat" ? "var(--threat)" : "transparent", color: simulatedRiskState === "threat" ? "#FFFFFF" : "var(--threat)", fontWeight: 700 }}
              >
                Threat
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "center" }}>
            {/* Risk Circular Meter */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              borderRadius: "16px",
              background: simulatedRiskState === "safe" ? "rgba(0, 229, 160, 0.05)" : simulatedRiskState === "suspicious" ? "rgba(255, 170, 0, 0.05)" : "rgba(255, 77, 79, 0.05)",
              border: `1px solid ${simulatedRiskState === "safe" ? "var(--safe-border)" : simulatedRiskState === "suspicious" ? "var(--warning-border)" : "var(--threat-border)"}`,
              boxShadow: simulatedRiskState === "safe" ? "var(--safe-glow)" : simulatedRiskState === "suspicious" ? "var(--warning-glow)" : "var(--threat-glow)",
              textAlign: "center"
            }}>
              <div style={{ position: "relative", width: "130px", height: "130px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="54" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" fill="none" />
                  <circle 
                    cx="65" 
                    cy="65" 
                    r="54" 
                    stroke={simulatedRiskState === "safe" ? "var(--safe)" : simulatedRiskState === "suspicious" ? "var(--warning)" : "var(--threat)"} 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="339.29" 
                    strokeDashoffset={simulatedRiskState === "safe" ? "20" : simulatedRiskState === "suspicious" ? "120" : "260"}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "Orbitron, sans-serif", color: simulatedRiskState === "safe" ? "var(--safe)" : simulatedRiskState === "suspicious" ? "var(--warning)" : "var(--threat)" }}>
                    {simulatedRiskState === "safe" ? "98%" : simulatedRiskState === "suspicious" ? "54%" : "12%"}
                  </span>
                  <span style={{ fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)", letterSpacing: "1px" }}>SAFETY SCORE</span>
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <span className={`badge ${simulatedRiskState === "safe" ? "badge-safe" : simulatedRiskState === "suspicious" ? "badge-warning" : "badge-threat"}`}>
                  {simulatedRiskState === "safe" ? "VERIFIED SAFE" : simulatedRiskState === "suspicious" ? "SUSPICIOUS VECTOR" : "CRITICAL PHISHING RISK"}
                </span>
              </div>
            </div>

            {/* Heuristics Indicators */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(17, 28, 48, 0.7)", border: "1px solid rgba(47, 128, 237, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <ShieldCheck size={16} color="var(--safe)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF" }}>Phishing & Homograph Shield</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                  Zero unicode spoofing or lookalike domain vectors detected on active endpoints.
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(17, 28, 48, 0.7)", border: "1px solid rgba(47, 128, 237, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <Lock size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF" }}>TLS / SSL Certificate Audit</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                  SHA-256 with RSA encryption validated. Transport layer encrypted.
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(17, 28, 48, 0.7)", border: "1px solid rgba(47, 128, 237, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <Key size={16} color="var(--safe)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF" }}>Field Exfiltration Filter</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                  Prevents unauthorized hidden input extraction, credential traps & keyloggers.
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(17, 28, 48, 0.7)", border: "1px solid rgba(47, 128, 237, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <Sparkles size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF" }}>Autonomous Proof Audit</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                  Captures and cryptographically stores visual submission confirmation screenshots.
                </p>
              </div>
            </div>
          </div>

          {/* Demonstration Alert Banner (shows if simulated as threat/suspicious) */}
          {simulatedRiskState !== "safe" && (
            <div style={{
              marginTop: "1.25rem",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              background: simulatedRiskState === "threat" ? "rgba(255, 77, 79, 0.12)" : "rgba(255, 170, 0, 0.12)",
              border: `1px solid ${simulatedRiskState === "threat" ? "var(--threat)" : "var(--warning)"}`,
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              animation: simulatedRiskState === "threat" ? "threatBlink 1.8s infinite ease-in-out" : "none"
            }}>
              <AlertTriangle size={22} color={simulatedRiskState === "threat" ? "var(--threat)" : "var(--warning)"} />
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: simulatedRiskState === "threat" ? "#FFA39E" : "#FFE58F" }}>
                  {simulatedRiskState === "threat" ? "CRITICAL THREAT: Phishing Signature Detected" : "SUSPICIOUS PATTERN: Unverified Application Target"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {simulatedRiskState === "threat" 
                    ? "Form domain mismatches SSL registry. Automated pipeline paused to prevent credential leakage."
                    : "Form has no verified domain reputation score. User confirmation required before field filling."}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Architecture Pipeline */}
      {activeTab === "flow" && (
        <div className="glass-card animate-fade-in" style={{ padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-blue">PIPELINE TOPOLOGY</span>
            <h2 style={{ fontSize: "1.5rem", color: "#FFFFFF", marginTop: "0.3rem", marginBottom: "0.3rem" }}>
              SecureForm End-to-End Processing Architecture
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
              Autonomous 5-stage pipeline separating data extraction, threat classification, and local auto-fill.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem", position: "relative" }}>
            {[
              { step: "01", name: "User Input", desc: "Raw application or form URL submitted", icon: Terminal, color: "var(--accent-primary)" },
              { step: "02", name: "Form Detection", desc: "Headless Chromium renders DOM & inputs", icon: Eye, color: "var(--accent-cyan)" },
              { step: "03", name: "AI Semantic Engine", desc: "Deep natural language schema matching", icon: Cpu, color: "#8B5CF6" },
              { step: "04", name: "Security Gate", desc: "Homograph, TLS & data leakage check", icon: ShieldCheck, color: "var(--safe)" },
              { step: "05", name: "Safe Auto-Fill", desc: "Verified fill & visual screenshot proof", icon: CheckCircle2, color: "var(--safe)" }
            ].map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={node.step} style={{
                  background: "rgba(17, 28, 48, 0.75)",
                  border: "1px solid rgba(47, 128, 237, 0.25)",
                  borderRadius: "14px",
                  padding: "1.25rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  position: "relative",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: "var(--accent-cyan)", fontWeight: 700 }}>
                      STAGE {node.step}
                    </span>
                    <Icon size={18} color={node.color} />
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF" }}>{node.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{node.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Auto-Fill Typing Preview */}
      {activeTab === "autofill" && (
        <div className="glass-card animate-fade-in" style={{ padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="badge badge-safe">SIMULATION ENGINE</span>
              <h2 style={{ fontSize: "1.5rem", color: "#FFFFFF", marginTop: "0.3rem", margin: 0 }}>
                Live Intelligent Auto-Fill Preview
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontFamily: "JetBrains Mono, monospace", color: "var(--safe)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--safe)", boxShadow: "0 0 10px var(--safe)", display: "inline-block" }}></span>
              STREAMING IN PROFILE TOKENS
            </div>
          </div>

          <div style={{ background: "rgba(7, 13, 24, 0.9)", border: "1px solid rgba(47, 128, 237, 0.3)", borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  <span>FULL NAME</span>
                  <span style={{ color: "var(--safe)", fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace" }}>✓ MATCHED 99%</span>
                </label>
                <div style={{ padding: "0.75rem 1rem", background: "rgba(17, 28, 48, 0.9)", border: "1px solid rgba(0, 229, 160, 0.35)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}>
                  {typedName}<span style={{ display: "inline-block", width: "2px", height: "18px", background: "var(--safe)", marginLeft: "2px", animation: "safePulse 1s infinite" }}></span>
                </div>
              </div>

              <div>
                <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  <span>EMAIL ADDRESS</span>
                  <span style={{ color: "var(--safe)", fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace" }}>✓ MATCHED 100%</span>
                </label>
                <div style={{ padding: "0.75rem 1rem", background: "rgba(17, 28, 48, 0.9)", border: "1px solid rgba(0, 229, 160, 0.35)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}>
                  {typedEmail}<span style={{ display: "inline-block", width: "2px", height: "18px", background: "var(--safe)", marginLeft: "2px", animation: "safePulse 1s infinite" }}></span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                <span>INSTITUTION / UNIVERSITY</span>
                <span style={{ color: "var(--safe)", fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace" }}>✓ AUTO-MAPPED</span>
              </label>
              <div style={{ padding: "0.75rem 1rem", background: "rgba(17, 28, 48, 0.9)", border: "1px solid rgba(0, 229, 160, 0.35)", borderRadius: "8px", color: "#FFFFFF", fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}>
                {typedCollege}<span style={{ display: "inline-block", width: "2px", height: "18px", background: "var(--safe)", marginLeft: "2px", animation: "safePulse 1s infinite" }}></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Encryption & Privacy Storage Panel */}
      {activeTab === "privacy" && (
        <div className="glass-card animate-fade-in" style={{ padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-safe">ZERO-LEAKAGE AUDIT</span>
            <h2 style={{ fontSize: "1.5rem", color: "#FFFFFF", marginTop: "0.3rem", margin: 0 }}>
              Encryption & Client Data Privacy Matrix
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ background: "rgba(0, 229, 160, 0.04)", border: "1px solid rgba(0, 229, 160, 0.3)", borderRadius: "14px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--safe)", fontWeight: 700, marginBottom: "1rem" }}>
                <CheckCircle2 size={18} /> What is Stored & Encrypted Locally
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)", padding: 0 }}>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--safe)" }}>✓</span>
                  <span><strong>Profile Attributes</strong>: Stored locally in AES-256 encrypted JSON store.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--safe)" }}>✓</span>
                  <span><strong>OAuth Refresh Token</strong>: Restricted exclusively to <code style={{ color: "var(--accent-cyan)" }}>gmail.readonly</code>.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--safe)" }}>✓</span>
                  <span><strong>Visual Proof Audit</strong>: Submission screenshots stored in local filesystem storage.</span>
                </li>
              </ul>
            </div>

            <div style={{ background: "rgba(255, 77, 79, 0.04)", border: "1px solid rgba(255, 77, 79, 0.3)", borderRadius: "14px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--threat)", fontWeight: 700, marginBottom: "1rem" }}>
                <XCircle size={18} /> What is NEVER Sent or Stored
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)", padding: 0 }}>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--threat)" }}>✕</span>
                  <span><strong>Passwords & Credentials</strong>: Zero password fields ever ingested or cached.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--threat)" }}>✕</span>
                  <span><strong>Cloud Telemetry Trackers</strong>: No third-party ad pixels or tracking analytics.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--threat)" }}>✕</span>
                  <span><strong>Unfiltered Inbox Content</strong>: Only matching application receipts are surfaced.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Before vs After Comparison */}
      {activeTab === "comparison" && (
        <div className="glass-card animate-fade-in" style={{ padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-blue">PROJECT VALUE DEMO</span>
            <h2 style={{ fontSize: "1.5rem", color: "#FFFFFF", marginTop: "0.3rem", margin: 0 }}>
              Manual Form Filling vs CyberShield AI
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ background: "rgba(17, 28, 48, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--threat)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <XCircle size={18} /> Traditional Manual Filling
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <div>⏱ <strong>Time Spent:</strong> 15 to 25 minutes per form</div>
                <div>🎣 <strong>Phishing Risk:</strong> Vulnerable to fake clones & domain spoofing</div>
                <div>📋 <strong>Data Redundancy:</strong> Re-typing same CGPA, resume, and experience</div>
                <div>📉 <strong>Record Keeping:</strong> Lost confirmation emails with no submission proof</div>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(0, 229, 160, 0.06) 0%, rgba(47, 128, 237, 0.06) 100%)", border: "1px solid var(--safe-border)", borderRadius: "14px", padding: "1.5rem", boxShadow: "var(--safe-glow)" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--safe)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle2 size={18} /> CyberShield AI Autonomous Engine
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "#FFFFFF" }}>
                <div>⚡ <strong>Time Spent:</strong> &lt; 5 seconds with automated DOM review</div>
                <div>🛡 <strong>Phishing Risk:</strong> Autonomous heuristic scanning halts dangerous links</div>
                <div>🎯 <strong>Data Accuracy:</strong> 1-click verified mapping from encrypted profile</div>
                <div>📸 <strong>Visual Proof:</strong> High-resolution confirmation screenshot preserved</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
