import { getOpportunities, getUserProfile, getTrackingRecords } from "@/lib/store";
import { checkEligibility, generateFieldMappings } from "@/lib/pipeline";
import { analyzeUrlSecurity } from "@/lib/security";
import { ShieldAlert, ShieldCheck, CheckCircle, XCircle } from "lucide-react";
import FormReviewContainer from "./FormReviewContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || undefined;

  const opportunities = await getOpportunities();
  const opportunity = opportunities.find(o => o.opportunity_id === resolvedParams.id);
  const profile = await getUserProfile(userEmail);
  const trackingRecords = await getTrackingRecords(userEmail);
  const existingRecord = trackingRecords.find(r => r.opportunity_id === resolvedParams.id);
  const isAlreadySubmitted = !!existingRecord && (existingRecord.status === "submitted" || existingRecord.status === "confirmed" || existingRecord.status === "interview");

  if (!opportunity || !profile) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Opportunity or Profile not found.</h2>
      </div>
    );
  }

  // Run Pipeline Stages
  const eligibility = checkEligibility(profile, opportunity);
  
  // Real dynamic security check (Stage 4) using Puppeteer
  const security = await analyzeUrlSecurity(opportunity.apply_url);
  
  let autofill = null;
  if (security.classification === "safe" || security.user_override) {
    autofill = generateFieldMappings(profile, opportunity);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>{opportunity.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>{opportunity.org}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Stage 3: Eligibility Verdict */}
        <div className="glass-card" style={{ border: `1px solid ${eligibility.verdict === 'eligible' ? 'rgba(0, 229, 160, 0.3)' : 'rgba(255, 77, 79, 0.3)'}` }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Space Grotesk, sans-serif' }}>
            {eligibility.verdict === 'eligible' ? <CheckCircle color="var(--safe)" size={22} /> : <XCircle color="var(--threat)" size={22} />}
            <span style={{ color: eligibility.verdict === 'eligible' ? 'var(--safe)' : 'var(--threat)' }}>
              PIPELINE STAGE 3: ELIGIBILITY CHECK ({eligibility.verdict.toUpperCase()})
            </span>
          </h3>
          <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {eligibility.reasons.map((r, i) => (
              <li key={i} style={{ fontSize: '0.925rem' }}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Stage 4: Security Verdict */}
        <div 
          className={`glass-card ${security.classification === 'safe' ? 'card-safe' : security.classification === 'unsafe' ? 'card-threat' : ''}`} 
          style={{ 
            border: `1px solid ${security.classification === 'unsafe' ? 'var(--threat)' : security.classification === 'suspicious' ? 'var(--warning)' : 'rgba(0, 229, 160, 0.4)'}`,
            background: security.classification === 'unsafe' ? 'rgba(255, 77, 79, 0.08)' : security.classification === 'suspicious' ? 'rgba(255, 170, 0, 0.08)' : 'rgba(0, 229, 160, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Space Grotesk, sans-serif', color: security.classification === 'unsafe' ? 'var(--threat)' : security.classification === 'suspicious' ? 'var(--warning)' : 'var(--safe)' }}>
              {security.classification === 'safe' ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
              STAGE 4 DEFENSE GATE: {security.classification.toUpperCase()}
            </h3>
            <span className={`badge ${security.classification === 'unsafe' ? 'badge-threat' : security.classification === 'suspicious' ? 'badge-warning' : 'badge-safe'}`}>
              RISK: {security.classification === 'safe' ? '0/100 (NOMINAL)' : security.classification === 'suspicious' ? '55/100 (ALERT)' : '95/100 (CRITICAL)'}
            </span>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              TELEMETRY SIGNALS ANALYZED:
            </div>
            <ul style={{ listStylePosition: 'inside', color: 'var(--text-primary)', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {security.signals.map((s, i) => (
                <li key={i} style={{ fontSize: '0.875rem' }}>{s}</li>
              ))}
            </ul>
          </div>

          {security.classification === 'unsafe' && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(255, 77, 79, 0.15)', border: '1px solid var(--threat)', borderRadius: '8px', color: 'var(--threat)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} />
              <span>DEFENSE PROTOCOL HALTED: Phishing / Unsafe signatures detected. Auto-fill and form submission are strictly locked down.</span>
            </div>
          )}
        </div>

        {/* Stage 6: Human Verification & Form Submission Screen */}
        {autofill && (
          <FormReviewContainer 
            opportunity={opportunity} 
            initialAutofill={autofill} 
            isAlreadySubmitted={isAlreadySubmitted}
            initialScreenshot={existingRecord?.screenshot_url || ""}
            initialSubmittedData={existingRecord?.submitted_data}
          />
        )}
      </div>
    </div>
  );
}
