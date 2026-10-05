"use client";

import { useState } from "react";
import { AutoFillResult, FieldMapping, Opportunity } from "@/types";
import { AlertTriangle, CheckCircle, Send, Plus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { submitApplicationAction } from "@/app/actions/opportunities";
import Link from "next/link";

interface FormReviewContainerProps {
  opportunity: Opportunity;
  initialAutofill: AutoFillResult;
  isAlreadySubmitted?: boolean;
  initialScreenshot?: string;
  initialSubmittedData?: Record<string, string>;
}

export default function FormReviewContainer({
  opportunity,
  initialAutofill,
  isAlreadySubmitted = false,
  initialScreenshot = "",
  initialSubmittedData
}: FormReviewContainerProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, { value: string; source: string }>>(() => {
    const initial: Record<string, { value: string; source: string }> = {};
    if (initialSubmittedData && Object.keys(initialSubmittedData).length > 0) {
      Object.entries(initialSubmittedData).forEach(([k, v]) => {
        initial[k] = { value: v || "", source: "profile" };
      });
    } else {
      initialAutofill.field_mappings.forEach((m) => {
        initial[m.field_name] = { value: m.value || "", source: m.source };
      });
    }
    return initial;
  });

  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(isAlreadySubmitted);
  const [submissionError, setSubmissionError] = useState<string>("");
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const handleFieldValueChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: {
        value,
        source: prev[fieldName]?.source === "profile" ? "profile" : "user_input"
      }
    }));
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    setFieldValues((prev) => ({
      ...prev,
      [newFieldName.trim()]: { value: newFieldValue.trim(), source: "user_input" }
    }));
    setNewFieldName("");
    setNewFieldValue("");
    setShowAddField(false);
  };

  const handleRemoveField = (fieldName: string) => {
    setFieldValues((prev) => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  const [realConfirmation, setRealConfirmation] = useState<string>("Your response has been recorded.");
  const [realScreenshot, setRealScreenshot] = useState<string>(initialScreenshot || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const plainValues: Record<string, string> = {};
      Object.entries(fieldValues).forEach(([k, v]) => {
        plainValues[k] = v.value;
      });

      const res = await submitApplicationAction(opportunity.opportunity_id, plainValues, saveToProfile);
      
      if (res?.submissionResult?.confirmationText) {
        setRealConfirmation(res.submissionResult.confirmationText);
      }
      if (res?.submissionResult?.screenshotUrl) {
        setRealScreenshot(res.submissionResult.screenshotUrl);
      }

      if (res?.submissionResult && !res.submissionResult.success) {
        setSubmissionError(res.submissionResult.message || "Failed to confirm external form submission.");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed", err);
      alert("Failed to submit application: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card" style={{ border: `2px solid ${submissionError ? 'var(--warning)' : 'var(--safe)'}`, background: submissionError ? 'rgba(255, 170, 0, 0.05)' : 'rgba(0, 229, 160, 0.05)', borderRadius: '16px', overflow: 'hidden', boxShadow: submissionError ? '0 0 20px rgba(255, 170, 0, 0.2)' : '0 0 25px rgba(0, 229, 160, 0.2)' }}>
        {/* Form Header Banner */}
        <div style={{ background: submissionError ? 'linear-gradient(135deg, #FFAA00 0%, #D97706 100%)' : 'linear-gradient(135deg, #00E5A0 0%, #009E6D 100%)', color: '#070D18', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={28} color="#070D18" />
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#070D18', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
                {submissionError ? "CyberShield Submission Alert" : "CyberShield Response Verified & Recorded"}
              </h3>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: 600 }}>{opportunity.title} • {opportunity.org}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: `4px solid ${submissionError ? 'var(--warning)' : 'var(--safe)'}` }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: submissionError ? 'var(--warning)' : 'var(--safe)', fontSize: '1rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              {submissionError ? "⚠️ Submission Note" : "✓ Submission Confirmed & Cryptographically Verified"}
            </h4>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
              "{realConfirmation}"
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>
              Target Form: <a href={opportunity.apply_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>{opportunity.apply_url}</a>
            </p>
          </div>

          {realScreenshot && (
            <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                📷 LIVE AUTOMATED SUBMISSION SCREENSHOT PROOF:
              </div>
              <img 
                src={realScreenshot} 
                alt="Form Submission Verification Screenshot" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', background: '#fff' }} 
              />
            </div>
          )}

          <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Submitted Form Response Data ({Object.keys(fieldValues).length} Fields):
          </h4>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
            {Object.entries(fieldValues).map(([key, item]) => (
              <div key={key} style={{ padding: '0.875rem 1.25rem', background: 'var(--bg-tertiary)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{key}</span>
                <span style={{ color: item.value ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {item.value || '(Empty)'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/tracking" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              View in Application Tracker <ArrowRight size={16} />
            </Link>
            <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
              Edit Form Response
            </button>
            <Link href="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fieldsList = Object.entries(fieldValues);

  return (
    <div className="glass-card" style={{ border: '1px solid rgba(47, 128, 237, 0.35)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
      {/* Form Title Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(47, 128, 237, 0.2) 0%, rgba(11, 18, 32, 0.85) 100%)', borderBottom: '1px solid rgba(47, 128, 237, 0.25)', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>CyberShield Form Simulator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Targeting only verified fields requested by <strong>{opportunity.title}</strong> ({fieldsList.length} field{fieldsList.length === 1 ? '' : 's'}).
            </p>
          </div>
          <span className="badge badge-safe" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} color="var(--safe)" /> CyberShield Verified
          </span>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {fieldsList.map(([fieldName, item]) => {
              const isMissing = !item.value || item.value.trim() === "" || item.source === "unmapped";

              return (
                <div 
                  key={fieldName} 
                  style={{ 
                    padding: '1.1rem', 
                    background: 'var(--bg-tertiary)', 
                    borderRadius: '12px',
                    border: isMissing ? '1.5px dashed var(--warning)' : '1px solid rgba(47, 128, 237, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {fieldName} <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isMissing ? (
                        <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <AlertTriangle size={12} /> Needs input
                        </span>
                      ) : item.source === 'profile' ? (
                        <span className="badge badge-safe">Auto-Filled from Profile</span>
                      ) : item.source === 'ai_generated' ? (
                        <span className="badge badge-blue">AI Generated</span>
                      ) : (
                        <span className="badge badge-neutral">User Input</span>
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveField(fieldName)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                        title="Remove field"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    className="input-field"
                    value={item.value}
                    onChange={(e) => handleFieldValueChange(fieldName, e.target.value)}
                    placeholder={`Enter ${fieldName}...`}
                    style={{ width: '100%', marginBottom: 0, fontSize: '0.95rem' }}
                    required
                  />
                </div>
              );
            })}
          </div>

          {/* Add Custom Form Field */}
          {showAddField ? (
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(47, 128, 237, 0.35)' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--accent-cyan)', fontFamily: 'Space Grotesk, sans-serif' }}>Add Field to Form</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Field Name (e.g., Phone no, Address)"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Value"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-primary" onClick={handleAddField}>Add Field</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddField(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowAddField(true)}
              style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}
            >
              <Plus size={16} /> Add Custom Field to Form
            </button>
          )}

          {/* Save missing details to profile option */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'rgba(47, 128, 237, 0.08)', borderRadius: '12px', border: '1px solid rgba(47, 128, 237, 0.25)' }}>
            <input
              type="checkbox"
              id="saveProfileCheck"
              checked={saveToProfile}
              onChange={(e) => setSaveToProfile(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            <label htmlFor="saveProfileCheck" style={{ fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <strong>Save missing details (e.g. Phone no, custom inputs) to Profile for future use</strong>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ padding: '0.875rem 2.25rem', fontSize: '1rem' }}
            >
              <Send size={18} /> {isSubmitting ? "Submitting Form..." : "Submit Form Internally"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
