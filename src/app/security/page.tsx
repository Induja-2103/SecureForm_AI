import { getSecurityLogs } from "@/lib/store";
import { ShieldCheck, ShieldAlert, XCircle, Clock } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthRequiredGuard } from "@/components/AuthRequiredGuard";

export default async function SecurityLogsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <AuthRequiredGuard 
        pageName="Cyber Defense Audit Logs"
        description="Real-time URL threat logs, homograph inspection records, and cryptographic pipeline telemetry are restricted to authenticated operators to prevent intelligence leakage."
      />
    );
  }

  const logs = await getSecurityLogs();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Orbitron, Space Grotesk, sans-serif' }}>Cyber Defense Audit Logs</h1>
        <p style={{ color: 'var(--text-secondary)' }}>A real-time cryptographic audit of every URL and form inspected by CyberShield AI.</p>
      </div>

      {logs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShieldCheck size={48} color="var(--safe)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No Scans Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Scan an application URL in the dashboard to initiate real-time threat telemetry.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logs.map((log) => (
            <div key={log.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid ${log.classification === 'unsafe' ? 'var(--threat)' : log.classification === 'suspicious' ? 'var(--warning)' : 'var(--safe)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    <Clock size={14} color="var(--accent-cyan)" /> {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <div style={{ wordBreak: 'break-all', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {log.url}
                  </div>
                </div>
                <span className={`badge ${log.classification === 'unsafe' ? 'badge-threat' : log.classification === 'suspicious' ? 'badge-warning' : 'badge-safe'}`}>
                  {log.classification.toUpperCase()}
                </span>
              </div>
              
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Telemetry & Threat Signals:</h4>
                <ul style={{ listStylePosition: 'inside', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {log.signals.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
