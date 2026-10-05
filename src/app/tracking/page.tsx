import { getTrackingRecords, saveTrackingRecord, getEmailOpportunities, getUserProfile } from "@/lib/store";
import { Clock, Mail, RefreshCw, Briefcase, GraduationCap, AlertCircle, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { fetchAndAnalyzeEmailsAction, registerEmailOpportunityAction } from "./actions";
import { DeleteTrackingButton, DeleteEmailOpportunityButton } from "@/components/DeleteButtons";
import { SyncGmailModal } from "@/components/SyncGmailModal";
import { getConnectedGoogleAccount } from "@/lib/gmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthRequiredGuard } from "@/components/AuthRequiredGuard";

export default async function TrackingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <AuthRequiredGuard 
        pageName="Application Tracking & Inbox Telemetry"
        description="Your submitted application records, interview updates, and real Gmail inbox telemetry are accessible only to authenticated users. Sign in to synchronize and inspect your application pipeline."
      />
    );
  }

  const userEmail = session.user.email || undefined;
  const records = await getTrackingRecords(userEmail);
  const emailOpps = await getEmailOpportunities(userEmail);
  const userProfile = await getUserProfile(userEmail);
  const connectedAccount = await getConnectedGoogleAccount();

  async function mockEmailUpdateAction(formData: FormData) {
    "use server";
    const id = formData.get("opportunity_id") as string;
    
    const userRecords = await getTrackingRecords(userEmail);
    const record = userRecords.find(r => r.opportunity_id === id);
    if (record) {
      record.status = "interview";
      record.last_updated = new Date().toISOString();
      await saveTrackingRecord(record, userEmail);
      revalidatePath("/tracking");
    }
  }

  const submittedTitles = records.map(r => r.title);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-safe">AUTHENTICATED WORKSPACE</span>
            <span className="badge badge-blue" style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>
              WORKSPACE: {session.user.name || session.user.email}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Applications & Inbox</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Track applications and AI-analyzed opportunities for your personal workspace.</p>
        </div>
        <SyncGmailModal 
          initialEmail={connectedAccount?.email || userProfile?.email || userEmail || "induja2103@gmail.com"} 
          connectedAccount={connectedAccount}
          submittedFormsCount={records.length}
          submittedTitles={submittedTitles}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Standard Tracking */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '1.35rem' }}>
            <Clock size={20} color="var(--accent-cyan)" /> Application Status & Verification
          </h2>
          
          {records.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No applications submitted yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {records.map((record) => (
                <div key={record.opportunity_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', color: '#fff' }}>{record.title}</h3>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {record.org} • {record.last_updated ? new Date(record.last_updated).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${record.status === 'interview' ? 'badge-blue' : 'badge-safe'}`} style={{ textTransform: 'capitalize' }}>
                        {record.status}
                      </span>
                      <DeleteTrackingButton id={record.opportunity_id} title={record.title} />
                    </div>
                  </div>

                  {/* Form Responses Section */}
                  {record.submitted_data && Object.keys(record.submitted_data).length > 0 && (
                    <div style={{ background: 'rgba(17, 28, 48, 0.85)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(47, 128, 237, 0.25)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--safe)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'JetBrains Mono, monospace' }}>
                        <CheckCircle2 size={14} color="var(--safe)" /> Verified Submissions ({Object.keys(record.submitted_data).length} Fields):
                      </div>
                      <div style={{ display: 'grid', gap: '0.45rem' }}>
                        {Object.entries(record.submitted_data).map(([field, val]) => (
                          <div key={field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid rgba(47, 128, 237, 0.12)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{field}:</span>
                            <span style={{ color: '#fff', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{val || '(Empty)'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Submission Proof Screenshot */}
                  {record.screenshot_url && (
                    <div style={{ background: 'rgba(0, 229, 160, 0.04)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--safe-border)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--safe)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <CheckCircle2 size={14} /> Submission Confirmation Proof
                        </span>
                        <a 
                          href={record.screenshot_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                        >
                          View Full <ExternalLink size={12} />
                        </a>
                      </div>
                      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(47, 128, 237, 0.25)', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070D18' }}>
                        <img 
                          src={record.screenshot_url} 
                          alt="Submission Confirmation" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.35rem' }}>
                    <Link href={`/opportunity/${record.opportunity_id}`} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem 0.75rem', textAlign: 'center', textDecoration: 'none' }}>
                      Review Form
                    </Link>
                    {record.status === 'submitted' && (
                      <form action={mockEmailUpdateAction} style={{ flex: 1 }}>
                        <input type="hidden" name="opportunity_id" value={record.opportunity_id} />
                        <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}>
                          Simulate AI Update
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Scanned Opportunities & Form Updates */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '1.35rem' }}>
            <Mail size={20} color="var(--accent-cyan)" /> Inbox Telemetry & Form Receipts
          </h2>
          
          {emailOpps.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No form response emails or opportunities synced yet.</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Click "Sync Gmail Now" to scan your inbox for updates.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {emailOpps.map((opp: any) => {
                const isFormRelated = opp.related_form_title || opp.category === 'application_confirmation' || opp.category === 'interview';

                return (
                  <div 
                    key={opp.id} 
                    className="glass-card" 
                    style={isFormRelated ? { borderLeft: '4px solid var(--safe)', background: 'linear-gradient(90deg, rgba(0, 229, 160, 0.05) 0%, rgba(11, 18, 32, 0.8) 100%)' } : {}}
                  >
                    {/* Related Form Header Tag */}
                    {opp.related_form_title && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.7rem', background: 'rgba(0, 229, 160, 0.12)', color: 'var(--safe)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem', border: '1px solid var(--safe-border)', fontFamily: 'JetBrains Mono, monospace' }}>
                        <CheckCircle2 size={13} color="var(--safe)" /> LINKED FORM: {opp.related_form_title}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%' }} title={opp.subject}>
                        {opp.subject}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span 
                          className={`badge ${
                            opp.category === 'application_confirmation' ? 'badge-safe' :
                            opp.category === 'interview' ? 'badge-safe' :
                            opp.category === 'internship' ? 'badge-blue' :
                            opp.category === 'scholarship' ? 'badge-warning' : 'badge-neutral'
                          }`} 
                          style={{ textTransform: 'capitalize' }}
                        >
                          {opp.category === 'application_confirmation' ? '✓ Form Confirmed' :
                           opp.category === 'interview' ? '★ Interview Shortlist' :
                           opp.category.replace('_', ' ')}
                        </span>
                        <DeleteEmailOpportunityButton id={opp.id} title={opp.subject} />
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      From: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{opp.from}</span>
                      {opp.date && (
                        <span style={{ marginLeft: '0.75rem', opacity: 0.8, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>
                          • {new Date(opp.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {opp.snippet}
                    </p>

                    {opp.related_opportunity_id ? (
                      <Link 
                        href={`/opportunity/${opp.related_opportunity_id}`} 
                        className="btn btn-secondary" 
                        style={{ width: '100%', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textDecoration: 'none' }}
                      >
                        <CheckCircle2 size={15} color="var(--safe)" /> View Submitted Form & Proof
                      </Link>
                    ) : (
                      <form action={registerEmailOpportunityAction}>
                        <input type="hidden" name="snippet" value={opp.snippet} />
                        <input type="hidden" name="subject" value={opp.subject} />
                        <input type="hidden" name="emailId" value={opp.id} />
                        <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.875rem' }}>
                          Register & Analyze Link
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
