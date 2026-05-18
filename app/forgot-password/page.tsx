"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/src/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch {
      setError("Email not found. Please check and try again.");
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
            Reset Password
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 24px" }}>
            Enter your email and we will send you a reset link.
          </p>

          {success ? (
            <div style={{
              background: "#f0fdf4", border: "1px solid #86efac",
              borderRadius: "14px", padding: "16px", textAlign: "center"
            }}>
              <p style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600" }}>
                Reset link sent!
              </p>
              <p style={{ color: "#15803d", fontSize: "13px", marginTop: "4px" }}>
                Check your email inbox and follow the instructions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                display: "flex", alignItems: "center",
                background: "#f3f4f6", borderRadius: "14px",
                padding: "0 16px", height: "54px", gap: "12px",
                marginBottom: "20px"
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
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Remember your password?{" "}
              <Link href="/login" style={{ color: "#4f46e5", fontWeight: "600", textDecoration: "none" }}>
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}