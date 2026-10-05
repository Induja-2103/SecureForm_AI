"use client";

import { signIn } from "next-auth/react";
import { Lock, ShieldAlert, ArrowLeft, LogIn, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthModal } from "@/components/Providers";

interface AuthRequiredGuardProps {
  pageName: string;
  description: string;
  badgeLabel?: string;
}

export function AuthRequiredGuard({
  pageName,
  description,
  badgeLabel = "OPERATOR AUTHENTICATION REQUIRED"
}: AuthRequiredGuardProps) {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { openAuthModal } = useAuthModal();

  const handleGoogle = () => {
    setLoadingGoogle(true);
    signIn("google");
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <div 
        className="glass-card card-threat" 
        style={{
          padding: "3rem 2.5rem",
          borderRadius: "20px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(11, 18, 32, 0.96) 0%, rgba(17, 28, 48, 0.9) 100%)",
          border: "1px solid rgba(255, 77, 79, 0.35)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)"
        }}
      >
        {/* Glowing Lock Avatar */}
        <div 
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(255, 77, 79, 0.12)",
            border: "1.5px solid rgba(255, 77, 79, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "var(--threat)"
          }}
        >
          <Lock size={30} />
        </div>

        {/* Security Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span className="badge badge-threat" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>
            <ShieldAlert size={13} /> {badgeLabel}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
            ZERO-TRUST ENCLAVE
          </span>
        </div>

        <h1 style={{ fontSize: "2rem", color: "#FFFFFF", marginBottom: "0.85rem", fontFamily: "Space Grotesk, sans-serif" }}>
          {pageName} Access Locked
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 2rem" }}>
          {description}
        </p>

        {/* Sign In & Sign Up Options */}
        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
          {/* Sign Up Button */}
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className="btn btn-primary"
            style={{
              padding: "0.85rem 1.5rem",
              fontSize: "0.925rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #00B37A 0%, #00E5A0 100%)",
              color: "#070D18",
              fontWeight: 700,
              boxShadow: "0 0 20px rgba(0, 229, 160, 0.35)"
            }}
          >
            <UserPlus size={18} />
            Sign Up (New Account)
          </button>

          {/* Sign In Button */}
          <button
            type="button"
            onClick={() => openAuthModal("signin")}
            className="btn btn-primary"
            style={{
              padding: "0.85rem 1.5rem",
              fontSize: "0.925rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "linear-gradient(135deg, #2F80ED 0%, #00D8F6 100%)",
              boxShadow: "0 0 20px rgba(47, 128, 237, 0.35)"
            }}
          >
            <LogIn size={18} />
            Sign In (Password)
          </button>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="btn btn-secondary"
            style={{
              padding: "0.85rem 1.4rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              background: "rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Google Icon SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {loadingGoogle ? "Connecting..." : "Continue with Google"}
          </button>
        </div>

        {/* Back Link */}
        <div>
          <Link 
            href="/" 
            style={{ 
              color: "var(--text-secondary)", 
              fontSize: "0.85rem", 
              textDecoration: "none", 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.4rem" 
            }}
          >
            <ArrowLeft size={14} /> Back to Feature Overview & Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
