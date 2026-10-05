"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Mail, RefreshCw, CheckCircle2, X, Loader2, Sparkles, AlertCircle, ShieldCheck, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { syncGmailForUserAction } from "@/app/tracking/actions";

interface SyncGmailModalProps {
  initialEmail?: string;
  connectedAccount?: { email: string; name?: string } | null;
  submittedFormsCount?: number;
  submittedTitles?: string[];
}

export function SyncGmailModal({
  initialEmail = "induja2103@gmail.com",
  connectedAccount,
  submittedFormsCount = 0,
  submittedTitles = []
}: SyncGmailModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const activeEmail = connectedAccount?.email || initialEmail;
  const [gmailId, setGmailId] = useState(activeEmail);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    setStatusMessage(null);
    setGmailId(connectedAccount?.email || initialEmail);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!isSyncing) {
      setIsOpen(false);
      setStatusMessage(null);
    }
  };

  const triggerSync = async (emailToSync: string) => {
    const targetEmail = (emailToSync || "").trim();
    if (!targetEmail) {
      setStatusMessage({ text: "Please enter a valid Gmail address.", isError: true });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const result = await syncGmailForUserAction(targetEmail);

      if (result.success) {
        setStatusMessage({
          text: result.message || `Found and synced ${result.count || 0} real emails from your inbox!`,
          isError: false
        });
        router.refresh();
        setTimeout(() => {
          setIsOpen(false);
        }, 1800);
      } else {
        setStatusMessage({
          text: result.error || "Failed to sync Gmail. Please verify your Google account authorization.",
          isError: true
        });
      }
    } catch (err: any) {
      setStatusMessage({
        text: err.message || "An unexpected error occurred during sync.",
        isError: true
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSync(gmailId);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/tracking" });
  };

  const modalContent = isOpen && mounted ? (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1rem'
      }}
      onClick={handleClose}
    >
          <div 
            className="glass-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '2.25rem',
              borderRadius: '20px',
              background: 'rgba(11, 18, 32, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(47, 128, 237, 0.35)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(47, 128, 237, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button" 
              onClick={handleClose}
              disabled={isSyncing}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(47, 128, 237, 0.25) 0%, rgba(0, 216, 246, 0.1) 100%)',
                border: '1px solid rgba(0, 216, 246, 0.45)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(47, 128, 237, 0.35)'
              }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>Sync Real Gmail Inbox</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Connect to your authentic Gmail to detect application updates & interviews
                </p>
              </div>
            </div>

            {/* Live Connected Account Card */}
            {connectedAccount?.email ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 229, 160, 0.08) 0%, rgba(47, 128, 237, 0.04) 100%)',
                border: '1px solid rgba(0, 229, 160, 0.35)',
                borderRadius: '14px',
                padding: '1.1rem',
                marginBottom: '1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0, 229, 160, 0.15)',
                    color: 'var(--safe)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--safe)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--safe)', display: 'inline-block', boxShadow: '0 0 8px var(--safe)' }}></span>
                      VERIFIED GOOGLE ACCOUNT
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {connectedAccount.email}
                      {connectedAccount.name && <span style={{ fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.4rem', fontSize: '0.82rem' }}>({connectedAccount.name})</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerSync(connectedAccount.email)}
                  disabled={isSyncing}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  Sync Real Mail
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={20} color="var(--danger)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--danger)' }}>
                      Google Account Not Connected
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Sign in with Google to enable real Gmail synchronization
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <LogIn size={14} /> Sign in
                </button>
              </div>
            )}

            {/* Submitted Forms Context */}
            {submittedTitles.length > 0 && (
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '10px',
                padding: '0.875rem 1rem',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} color="var(--accent-primary)" />
                  Scanning real inbox for responses to {submittedFormsCount} tracked form{submittedFormsCount > 1 ? 's' : ''}:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {submittedTitles.slice(0, 3).map((title, i) => (
                    <span key={i} className="badge badge-neutral" style={{ fontSize: '0.75rem', textTransform: 'none' }}>
                      {title}
                    </span>
                  ))}
                  {submittedTitles.length > 3 && (
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      +{submittedTitles.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Gmail Address:
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    value={gmailId}
                    onChange={(e) => setGmailId(e.target.value)}
                    required
                    placeholder="e.g. yourname@gmail.com"
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    disabled={isSyncing}
                  />
                </div>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  This connects directly to Google OAuth to fetch authentic emails. No simulated mock data.
                </p>
              </div>

              {/* Status Banner */}
              {statusMessage && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  background: statusMessage.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: statusMessage.isError ? 'var(--danger)' : 'var(--success)',
                  border: `1px solid ${statusMessage.isError ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
                }}>
                  {statusMessage.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={handleGoogleSignIn}
                  disabled={isSyncing}
                  className="btn btn-secondary"
                  style={{ 
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Switch Google Account or re-authenticate OAuth"
                >
                  <LogIn size={14} /> Switch / Connect Google
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={handleClose}
                    disabled={isSyncing}
                    className="btn btn-secondary"
                    style={{ cursor: isSyncing ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSyncing}
                    className="btn btn-primary"
                    style={{ 
                      cursor: isSyncing ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      minWidth: '150px',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Syncing Real Inbox...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} /> Sync Real Inbox
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
  ) : null;

  return (
    <>
      <button 
        type="button" 
        onClick={handleOpen} 
        className="btn btn-primary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
      >
        <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} /> Sync Gmail Now
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}

