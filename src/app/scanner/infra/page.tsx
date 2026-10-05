"use client";

import { useState } from "react";
import { runInfraScan } from "./actions";
import { InfraScannerResult } from "@/types";
import { ShieldCheck, ShieldAlert, Loader2, Server, Globe, ArrowRight, Info, CheckCircle, AlertTriangle, Network, Lock, Wifi } from "lucide-react";

export default function InfraScannerPage() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InfraScannerResult | null>(null);

  const handleScan = async (e?: React.FormEvent, sampleTarget?: string) => {
    if (e) e.preventDefault();
    const finalTarget = sampleTarget || target;
    if (!finalTarget) return;

    if (sampleTarget) {
      setTarget(sampleTarget);
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await runInfraScan(finalTarget);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <span className="badge badge-safe">CYBER DEFENSE CLOUDSEC</span>
          <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono, monospace" }}>
            NETWORK & INFRASTRUCTURE PERIMETER SCANNER
          </span>
        </div>
        <h1 style={{ fontSize: "2.3rem", marginBottom: "0.4rem", fontFamily: "Space Grotesk, sans-serif" }}>
          Infrastructure & Cloud Security Scanner
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0, maxWidth: "800px" }}>
          Automated host perimeter defense that inspects target domains and IP addresses for open TCP service ports and verifies critical HTTP security headers (HSTS, CSP, and CORS).
        </p>
      </header>

      {/* Target Input Card */}
      <div className="glass-card" style={{ marginBottom: "2rem", border: "1px solid rgba(47, 128, 237, 0.35)", padding: "1.75rem" }}>
        <form onSubmit={(e) => handleScan(e)} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="example.com, scanme.nmap.org, or 192.168.1.1"
              required
              className="input-field"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", width: "100%", margin: 0 }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.6rem" }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Server size={18} />}
            {loading ? "Probing Network..." : "Scan Infrastructure"}
          </button>
        </form>

        {/* Quick Sample Targets */}
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
            TEST TARGETS:
          </span>
          <button 
            type="button" 
            onClick={() => handleScan(undefined, "google.com")}
            className="badge badge-neutral" 
            style={{ cursor: "pointer", background: "rgba(47, 128, 237, 0.12)", color: "var(--accent-cyan)", border: "1px solid rgba(47, 128, 237, 0.25)" }}
          >
            google.com
          </button>
          <button 
            type="button" 
            onClick={() => handleScan(undefined, "github.com")}
            className="badge badge-neutral" 
            style={{ cursor: "pointer", background: "rgba(47, 128, 237, 0.12)", color: "var(--accent-cyan)", border: "1px solid rgba(47, 128, 237, 0.25)" }}
          >
            github.com
          </button>
          <button 
            type="button" 
            onClick={() => handleScan(undefined, "scanme.nmap.org")}
            className="badge badge-neutral" 
            style={{ cursor: "pointer", background: "rgba(47, 128, 237, 0.12)", color: "var(--accent-cyan)", border: "1px solid rgba(47, 128, 237, 0.25)" }}
          >
            scanme.nmap.org
          </button>
        </div>
      </div>

      {/* Explanatory Deep-Dive Card (Explains CloudSec, Port Enumeration & Security Headers) */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: "2.5rem", 
          padding: "2rem", 
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(11, 18, 32, 0.9) 0%, rgba(17, 28, 48, 0.7) 100%)",
          border: "1px solid rgba(47, 128, 237, 0.2)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <Info size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: "1.3rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
            How the Infrastructure & Cloud Security Scanner Works
          </h2>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          The Infrastructure Scanner inspects remote host perimeters to prevent lateral movement and data exfiltration through two automated security vectors:
        </p>

        {/* 3 Pillars Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>
              <Network size={18} />
              <h3 style={{ fontSize: "1rem", margin: 0, color: "#FFFFFF" }}>TCP Port Probe & Reconnaissance</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
              Performs non-destructive socket probes across common application service ports (FTP 21, SSH 22, Telnet 23, HTTP 80, HTTPS 443, Custom 8080) to detect accidental external exposures.
            </p>
          </div>

          <div style={{ background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--safe)", marginBottom: "0.5rem" }}>
              <Lock size={18} />
              <h3 style={{ fontSize: "1rem", margin: 0, color: "#FFFFFF" }}>HSTS & TLS Transport Audit</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
              Evaluates <code>Strict-Transport-Security</code> headers to ensure browsers enforce encrypted TLS connections and eliminate SSL-stripping and man-in-the-middle downgrade vectors.
            </p>
          </div>

          <div style={{ background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--threat)", marginBottom: "0.5rem" }}>
              <Globe size={18} />
              <h3 style={{ fontSize: "1rem", margin: 0, color: "#FFFFFF" }}>CSP & CORS Exfiltration Shield</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
              Audits <code>Content-Security-Policy</code> against XSS script injections and verifies that CORS access control policies do not expose wildcard <code>*</code> credentials to malicious origins.
            </p>
          </div>
        </div>

        {/* Visual Architecture Flow */}
        <div style={{ background: "rgba(7, 13, 24, 0.6)", padding: "1rem 1.25rem", borderRadius: "10px", border: "1px solid rgba(47, 128, 237, 0.15)" }}>
          <div style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "var(--accent-cyan)", marginBottom: "0.6rem" }}>
            INFRASTRUCTURE PROBE PIPELINE:
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
            <span style={{ color: "#FFFFFF" }}>Target Host / IP</span>
            <ArrowRight size={14} color="var(--accent-cyan)" />
            <span style={{ color: "#FFFFFF" }}>Asynchronous TCP Probes</span>
            <ArrowRight size={14} color="var(--accent-cyan)" />
            <span style={{ color: "#FFFFFF" }}>HTTP Response Header Handshake</span>
            <ArrowRight size={14} color="var(--accent-cyan)" />
            <span style={{ color: "var(--safe)" }}>Perimeter Hardening Verdict</span>
          </div>
        </div>
      </div>

      {/* Scan Results View */}
      {result && (
        <div 
          className={`glass-card ${result.status === "secure" ? "card-safe" : "card-threat"}`} 
          style={{ 
            borderRadius: "16px",
            padding: "2rem",
            border: `1px solid ${result.status === "secure" ? "var(--safe)" : "var(--threat)"}`
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {result.status === "secure" ? (
              <ShieldCheck size={36} color="var(--safe)" />
            ) : (
              <ShieldAlert size={36} color="var(--threat)" />
            )}
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>
                Infrastructure Audit: {result.status === "secure" ? "PERIMETER SECURE" : "EXPOSURES IDENTIFIED"}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontFamily: "JetBrains Mono, monospace", margin: "0.2rem 0 0 0" }}>
                Host Target: {result.target}
              </p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span className={`badge ${result.status === "secure" ? "badge-safe" : "badge-threat"}`} style={{ fontSize: "0.85rem" }}>
                {result.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {/* Open Ports */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.5rem" }}>
                <Server size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0 }}>Open Network Ports</h3>
              </div>
              {result.open_ports.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--safe)", fontSize: "0.9rem" }}>
                  <CheckCircle size={16} /> All common attack surface ports closed/filtered.
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {result.open_ports.map((port, i) => (
                      <span key={i} style={{ padding: "0.3rem 0.8rem", background: "rgba(255, 77, 79, 0.15)", border: "1px solid rgba(255, 77, 79, 0.35)", color: "var(--threat)", borderRadius: "6px", fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                        Port {port} (OPEN)
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                    Notice: Ensure exposed ports are protected behind firewall ACLs or private VPC subnets.
                  </p>
                </div>
              )}
            </div>

            {/* Security Headers */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.5rem" }}>
                <Globe size={18} color="var(--safe)" />
                <h3 style={{ fontSize: "1.05rem", color: "#FFFFFF", margin: 0 }}>HTTP Security Headers</h3>
              </div>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", background: "var(--bg-tertiary)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.85rem", fontFamily: "JetBrains Mono, monospace" }}>CORS (Cross-Origin Policy)</span>
                  <span className={`badge ${result.security_headers.cors ? "badge-safe" : "badge-threat"}`} style={{ fontSize: "0.72rem" }}>
                    {result.security_headers.cors ? "SECURE" : "MISSING"}
                  </span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", background: "var(--bg-tertiary)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.85rem", fontFamily: "JetBrains Mono, monospace" }}>CSP (Content Security Policy)</span>
                  <span className={`badge ${result.security_headers.csp ? "badge-safe" : "badge-threat"}`} style={{ fontSize: "0.72rem" }}>
                    {result.security_headers.csp ? "SECURE" : "MISSING"}
                  </span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", background: "var(--bg-tertiary)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.85rem", fontFamily: "JetBrains Mono, monospace" }}>HSTS (Strict-Transport-Security)</span>
                  <span className={`badge ${result.security_headers.hsts ? "badge-safe" : "badge-threat"}`} style={{ fontSize: "0.72rem" }}>
                    {result.security_headers.hsts ? "SECURE" : "MISSING"}
                  </span>
                </li>
              </ul>
              
              {Object.keys(result.security_headers.details).length > 0 && (
                <div style={{ marginTop: "1rem", padding: "0.85rem", backgroundColor: "rgba(255, 77, 79, 0.08)", borderRadius: "8px", border: "1px solid rgba(255, 77, 79, 0.2)" }}>
                  <p style={{ color: "var(--threat)", fontSize: "0.8rem", fontFamily: "JetBrains Mono, monospace", marginBottom: "0.4rem", fontWeight: 600 }}>
                    HEADER DIAGNOSTICS:
                  </p>
                  <ul style={{ fontSize: "0.82rem", color: "var(--text-secondary)", listStyle: "disc", paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {Object.entries(result.security_headers.details).map(([key, value]) => (
                      <li key={key}>{value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
