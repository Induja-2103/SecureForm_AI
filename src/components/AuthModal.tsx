"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signUpUserAction } from "@/app/actions/auth";
import { X, Lock, User, Mail, ShieldCheck, Sparkles, Loader2, AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab);
  
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

  // Common UI State
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Sign In with Username/Password
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
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setSignInError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  // Handle Sign Up
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

      // Automatically sign in the newly registered user
      const loginRes = await signIn("credentials", {
        username: signUpUsername.trim(),
        password: signUpPassword,
        redirect: false
      });

      if (loginRes?.error) {
        // Switch to sign in tab if auto-login didn't complete
        setActiveTab("signin");
        setSignInIdentifier(signUpUsername.trim());
        setSignInError("Account created! Please sign in with your password.");
      } else {
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 800);
      }
    } catch (err: any) {
      setSignUpError(err.message || "Registration failed.");
    } finally {
      setSignUpLoading(false);
    }
  };

  // Handle Continue with Google
  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    signIn("google");
  };

  // Handle Demo Login
  const handleDemoAuth = async () => {
    setDemoLoading(true);
    const res = await signIn("demo-login", { redirect: false });
    if (!res?.error) {
      onClose();
      window.location.reload();
    }
    setDemoLoading(false);
  };

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(3, 7, 18, 0.78)",
        backdropFilter: "blur(10px)",
        padding: "1rem"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-card animate-fade-in" 
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "20px",
          background: "linear-gradient(145deg, #0B1220 0%, #111C30 100%)",
          border: "1px solid rgba(47, 128, 237, 0.35)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(47, 128, 237, 0.2)",
          padding: 0,
          overflow: "hidden"
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: "1.5rem 1.75rem",
            background: "linear-gradient(135deg, rgba(47, 128, 237, 0.15) 0%, rgba(11, 18, 32, 0.95) 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div 
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(0, 229, 160, 0.15)",
                border: "1px solid rgba(0, 229, 160, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--safe)"
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>
                CyberShield Access
              </div>
              <div style={{ fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace", color: "var(--accent-cyan)" }}>
                SECURE AUTHENTICATION GATEWAY
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "0.4rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs (Sign In vs Sign Up) */}
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
              cursor: "pointer",
              transition: "all 0.2s"
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
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Sign Up (Register)
          </button>
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* ==================== SIGN IN FORM ==================== */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {signInError && (
                <div style={{ padding: "0.75rem 1rem", background: "rgba(255, 77, 79, 0.12)", border: "1px solid var(--threat)", borderRadius: "10px", color: "var(--threat)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertCircle size={16} />
                  <span>{signInError}</span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontFamily: "JetBrains Mono, monospace" }}>
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
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontFamily: "JetBrains Mono, monospace" }}>
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
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                {signInLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {signInLoading ? "Authenticating..." : "Sign In to Workspace"}
              </button>
            </form>
          )}

          {/* ==================== SIGN UP FORM ==================== */}
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
                  USERNAME <span style={{ color: "var(--threat)" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    placeholder="Choose a username (e.g. induja)"
                    className="input-field"
                    style={{ width: "100%", margin: 0, paddingLeft: "2.4rem", fontSize: "0.88rem" }}
                  />
                  <User size={16} color="var(--accent-cyan)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "JetBrains Mono, monospace" }}>
                  EMAIL ADDRESS <span style={{ color: "var(--threat)" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. induja2103@gmail.com"
                    className="input-field"
                    style={{ width: "100%", margin: 0, paddingLeft: "2.4rem", fontSize: "0.88rem" }}
                  />
                  <Mail size={16} color="var(--accent-cyan)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontFamily: "JetBrains Mono, monospace" }}>
                    PASSWORD <span style={{ color: "var(--threat)" }}>*</span>
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
                    CONFIRM PASSWORD <span style={{ color: "var(--threat)" }}>*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: "linear-gradient(135deg, #00B37A 0%, #00E5A0 100%)",
                  color: "#070D18"
                }}
              >
                {signUpLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {signUpLoading ? "Registering User..." : "Sign Up & Start Workspace"}
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
            onClick={handleGoogleAuth}
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
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {/* Google Icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? "Connecting Google..." : "Continue with Google"}
          </button>

          {/* Quick Demo Operator Helper */}
          <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
            <button
              type="button"
              onClick={handleDemoAuth}
              disabled={demoLoading}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-cyan)",
                fontSize: "0.8rem",
                fontFamily: "JetBrains Mono, monospace",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              {demoLoading ? "Authorizing demo..." : "⚡ Quick Test: Instant Demo Operator"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
