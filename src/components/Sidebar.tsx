"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, ShieldCheck, Clock, Server, LogIn, LogOut, Sparkles, Lock } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

import { useAuthModal } from "@/components/Providers";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Applications', path: '/tracking', icon: Clock },
    { name: 'Security Log', path: '/security', icon: ShieldCheck },
    { name: 'Infra Scanner', path: '/scanner/infra', icon: Server },
  ];

  return (
    <aside className="sidebar">
      {/* Brand with Glowing Cyber Shield & AI Sparkle */}
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div className="brand-shield-glow">
          <ShieldCheck size={26} color="#00E5A0" />
          <Sparkles size={11} color="#00D8F6" style={{ position: 'absolute', bottom: '6px', right: '6px' }} />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF', lineHeight: 1.1 }}>
            CyberShield
          </div>
          <div style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-cyan)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            SECUREFORM AI
          </div>
        </div>
      </div>

      {/* Cyber Status Banner */}
      <div style={{
        marginTop: '-0.75rem',
        padding: '0.4rem 0.75rem',
        borderRadius: '8px',
        background: 'rgba(0, 229, 160, 0.08)',
        border: '1px solid rgba(0, 229, 160, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--safe)'
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--safe)', boxShadow: '0 0 8px var(--safe)', display: 'inline-block' }}></span>
        <span>DEFENSE: ACTIVE</span>
      </div>

      {/* Navigation */}
      <nav className="nav-links" style={{ flex: 1, marginTop: '0.5rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} color={isActive ? "var(--accent-cyan)" : "currentColor"} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* User / Session Cyber Card */}
      <div style={{
        padding: '1.25rem 1rem',
        borderRadius: '14px',
        background: 'rgba(17, 28, 48, 0.7)',
        border: '1px solid rgba(47, 128, 237, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        {session ? (
          <>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.4 }}>
              <div style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', color: 'var(--safe)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                <Lock size={11} /> ISOLATED WORKSPACE
              </div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                {session.user?.name || session.user?.email?.split('@')[0]}
              </div>
              <div style={{ color: 'var(--text-secondary)', wordBreak: 'break-all', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
                {session.user?.email}
              </div>
            </div>
            <button onClick={() => signOut()} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}>
              <LogOut size={15} /> Sign Out
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => openAuthModal('signin')} 
              className="btn btn-primary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontSize: '0.85rem' }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button 
              onClick={() => openAuthModal('signup')} 
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
            >
              <Sparkles size={13} color="var(--safe)" /> Sign Up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
