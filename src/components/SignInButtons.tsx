"use client";

import { signIn } from "next-auth/react";
import { LogIn, Sparkles, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuthModal } from "@/components/Providers";

export function DashboardSignInBanner() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { openAuthModal } = useAuthModal();

  const handleGoogleSignIn = () => {
    setLoadingGoogle(true);
    signIn("google");
  };

  return (
    <div 
      className="glass-card card-safe" 
      style={{
        padding: "2rem",
        marginBottom: "2.5rem",
        borderRadius: "18px",
        background: "linear-gradient(135deg, rgba(11, 18, 32, 0.95) 0%, rgba(17, 28, 48, 0.85) 100%)",
        border: "1px solid rgba(0, 229, 160, 0.35)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.5)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ maxWidth: "620px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
            <span className="badge badge-safe" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              <ShieldCheck size={13} /> AUTHENTICATION GATEWAY
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono, monospace" }}>
              SIGN UP OR CONTINUE WITH GOOGLE
            </span>
          </div>
          <h2 style={{ fontSize: "1.6rem", color: "#FFFFFF", marginBottom: "0.5rem", fontFamily: "Space Grotesk, sans-serif" }}>
            Sign Up or Sign In to Unlock Previous Forms & Live Analysis
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", margin: 0, lineHeight: 1.5 }}>
            Create an account with your username and password, or continue with Google to access your form tracking history, cryptographic screenshot verification proofs, and automated submission pipelines.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Sign Up Button */}
          <button 
            type="button"
            onClick={() => openAuthModal("signup")}
            className="btn btn-primary"
            style={{ 
              padding: "0.85rem 1.4rem", 
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
            <UserPlus size={17} />
            Sign Up (Register)
          </button>

          {/* Sign In Button */}
          <button 
            type="button"
            onClick={() => openAuthModal("signin")}
            className="btn btn-primary"
            style={{ 
              padding: "0.85rem 1.4rem", 
              fontSize: "0.925rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #2F80ED 0%, #00D8F6 100%)",
              boxShadow: "0 0 20px rgba(47, 128, 237, 0.35)"
            }}
          >
            <LogIn size={17} />
            Sign In
          </button>

          {/* Google OAuth Button */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            className="btn btn-secondary"
            style={{ 
              padding: "0.85rem 1.25rem", 
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
            {loadingGoogle ? "Connecting..." : "Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
