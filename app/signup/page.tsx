"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/components/auth/auth-provider";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch {
      setError("Unable to create account. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      background: "linear-gradient(160deg, #7c3aed 0%, #4f46e5 50%, #1e40af 100%)"
    }}>
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ fontSize: "38px", fontWeight: "600", color: "#ffffff", letterSpacing: "-0.5px" }}>
            Spendorai
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", marginTop: "6px" }}>
            Track your expenses smartly
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: "0 0 4px" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 24px" }}>
            Start managing your expenses in one place.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "#f3f4f6", borderRadius: "14px",
              padding: "0 16px", height: "54px", gap: "12px",
              marginBottom: "14px"
            }}>
              <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  flex: 1, fontSize: "15px", color: "#111827"
                }}
              />
            </div>

            <div style={{
              display: "flex", alignItems: "center",
              background: "#f3f4f6", borderRadius: "14px",
              padding: "0 16px", height: "54px", gap: "12px",
              marginBottom: "20px"
            }}>
              <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  flex: 1, fontSize: "15px", color: "#111827"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: "54px", border: "none", borderRadius: "14px",
                background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
                color: "#ffffff", fontSize: "16px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#4f46e5", fontWeight: "600", textDecoration: "none" }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}