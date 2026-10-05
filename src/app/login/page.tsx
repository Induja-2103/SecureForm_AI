"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signUpUserAction } from "@/app/actions/auth";
import { ShieldCheck, User, Mail, Lock, AlertCircle, CheckCircle, Loader2, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState("");

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");
    setSignInLoading(true);

    try {
      const res = await signIn("credentials", {
        username: signInIdentifier.trim(),
        password: signInPassword,
        redirect: false
      });

      if (res?.error) {
        setSignInError("Invalid username/email or password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setSignInError(err.message || "Failed to sign in.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");
    setSignUpSuccess("");

    if (!signUpUsername.trim()) {
      setSignUpError("Username is required.");
      return;
    }

    if (!signUpEmail.trim() || !signUpEmail.includes("@")) {
      setSignUpError("Please enter a valid email address.");
      return;
    }

    if (signUpPassword.length < 4) {
      setSignUpError("Password must be at least 4 characters.");
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError("Passwords do not match.");
      return;
    }

    setSignUpLoading(true);

    try {
      const res = await signUpUserAction({
        username: signUpUsername.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        name: signUpName.trim() || signUpUsername.trim()
      });

      if (!res.success) {
        setSignUpError(res.error || "Failed to register.");
        setSignUpLoading(false);
        return;
      }

      setSignUpSuccess("Account created successfully! Signing in...");

      const loginRes = await signIn("credentials", {
        username: signUpUsername.trim(),
        password: signUpPassword,
        redirect: false
      });

      if (loginRes?.error) {
        setActiveTab("signin");
        setSignInIdentifier(signUpUsername.trim());
        setSignInError("Account created! Please sign in with your password.");
      } else {
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 800);
      }
    } catch (err: any) {
      setSignUpError(err.message || "Registration failed.");
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "480px", margin: "2rem auto", padding: "0 1rem" }}>
      <div 
        className="glass-card" 
        style={{
          borderRadius: "20px",
          background: "linear-gradient(145deg, #0B1220 0%, #111C30 100%)",
          border: "1px solid rgba(47, 128, 237, 0.35)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
          padding: 0,
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: "1.75rem 2rem",
            background: "linear-gradient(135deg, rgba(47, 128, 237, 0.15) 0%, rgba(11, 18, 32, 0.95) 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center"
          }}
        >
          <div 
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: "rgba(0, 229, 160, 0.15)",
              border: "1px solid rgba(0, 229, 160, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--safe)",
              margin: "0 auto 0.75rem"
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h1 style={{ fontSize: "1.5rem", color: "#FFFFFF", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>
            CyberShield Authentication
          </h1>
          <p style={{ color: "var(--accent-cyan)", fontSize: "0.78rem", fontFamily: "JetBrains Mono, monospace", margin: "0.3rem 0 0 0" }}>
            AUTONOMOUS DEFENSE GATEWAY
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab("signin");
              setSignInError("");
            }}
            style={{
              padding: "0.9rem",
              background: activeTab === "signin" ? "rgba(47, 128, 237, 0.12)" : "transparent",
              border: "none",
              borderBottom: activeTab === "signin" ? "2px solid var(--accent-primary)" : "2px solid transparent",
              color: activeTab === "signin" ? "#FFFFFF" : "var(--text-secondary)",
              fontWeight: activeTab === "signin" ? 700 : 500,
              fontSize: "0.95rem",
              fontFamily: "Space Grotesk, sans-serif",
              cursor: "pointer"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setSignUpError("");
            }}
            style={{
              padding: "0.9rem",
              background: activeTab === "signup" ? "rgba(47, 128, 237, 0.12)" : "transparent",
              border: "none",
              borderBottom: activeTab === "signup" ? "2px solid var(--accent-primary)" : "2px solid transparent",
              color: activeTab === "signup" ? "#FFFFFF" : "var(--text-secondary)",
              fontWeight: activeTab === "signup" ? 700 : 500,
              fontSize: "0.95rem",
              fontFamily: "Space Grotesk, sans-serif",
              cursor: "pointer"
            }}
          >
            Sign Up
          </button>
        </div>

        <div style={{ padding: "1.75rem 2rem" }}>
          {/* Sign In */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {signInError && (
                <div style={{ padding: "0.75rem 1rem", background: "rgba(255, 77, 79, 0.12)", border: "1px solid var(--threat)", borderRadius: "10px", color: "var(--threat)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertCircle size={16} />
                  <span>{signInError}</span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontFamily: "JetBrains Mono, monospace" }}>
                  USERNAME OR EMAIL
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="Enter username or email..."
                    className="input-field"
                    style={{ width: "100%", margin: 0, paddingLeft: "2.4rem", fontSize: "0.9rem" }}
                  />
                  <User size={16} color="var(--accent-cyan)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontFamily: "JetBrains Mono, monospace" }}>
                  PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password..."
                    className="input-field"
                    style={{ width: "100%", margin: 0, paddingLeft: "2.4rem", paddingRight: "2.4rem", fontSize: "0.9rem" }}
                  />
                  <Lock size={16} color="var(--accent-cyan)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 700, marginTop: "0.5rem" }}
              >
                {signInLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign In to Workspace"}
              </button>
            </form>
          )}

          {/* Sign Up */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {signUpError && (
                <div style={{ padding: "0.75rem 1rem", background: "rgba(255, 77, 79, 0.12)", border: "1px solid var(--threat)", borderRadius: "10px", color: "var(--threat)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertCircle size={16} />
                  <span>{signUpError}</span>
                </div>
              )}

              {signUpSuccess && (
                <div style={{ padding: "0.75rem 1rem", background: "rgba(0, 229, 160, 0.12)", border: "1px solid var(--safe)", borderRadius: "10px", color: "var(--safe)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle size={16} />
                  <span>{signUpSuccess}</span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "JetBrains Mono, monospace" }}>
                  USERNAME
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    placeholder="Choose a username..."
                    className="input-field"
                    style={{ width: "100%", margin: 0, paddingLeft: "2.4rem", fontSize: "0.88rem" }}
                  />
                  <User size={16} color="var(--accent-cyan)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "JetBrains Mono, monospace" }}>
                  EMAIL ADDRESS
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="input-field"
                    style={{ width: "100%", margin: 0, paddingLeft: "2.4rem", fontSize: "0.88rem" }}
                  />
                  <Mail size={16} color="var(--accent-cyan)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "JetBrains Mono, monospace" }}>
                    PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Password"
                    className="input-field"
                    style={{ width: "100%", margin: 0, fontSize: "0.88rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "JetBrains Mono, monospace" }}>
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className="input-field"
                    style={{ width: "100%", margin: 0, fontSize: "0.88rem" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={signUpLoading}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  marginTop: "0.4rem",
                  background: "linear-gradient(135deg, #00B37A 0%, #00E5A0 100%)",
                  color: "#070D18"
                }}
              >
                {signUpLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign Up & Register"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "1.4rem 0", gap: "0.75rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
              OR CONTINUE WITH
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => {
              setGoogleLoading(true);
              signIn("google");
            }}
            disabled={googleLoading}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "12px",
              background: "#FFFFFF",
              color: "#1F2937",
              border: "none",
              fontWeight: 600,
              fontSize: "0.925rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
