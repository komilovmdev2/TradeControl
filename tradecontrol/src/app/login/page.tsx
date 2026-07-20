"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address";
    if (!password) nextErrors.password = "Password is required";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    login(email.trim());
    router.push("/dashboard");
  }

  const inputClass =
    "bg-surface border rounded-xl px-3.5 py-3 text-sm text-white outline-none w-full font-sans focus:border-primary transition-colors";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(37,99,235,.16), #020817 60%)" }}
    >
      <div className="w-full max-w-[420px] bg-[rgba(17,24,39,.6)] backdrop-blur-xl border border-border rounded-4xl p-10 shadow-card-lg flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 7L9 10L14 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-[22px] font-extrabold tracking-tight">Welcome back</div>
            <div className="text-[13px] text-text-secondary mt-1">Sign in to your TradeControl account</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-surface border border-border cursor-pointer text-sm font-semibold hover:border-text-muted transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.55-5.17 3.55-8.86z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.26 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.63H1.28A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.28 5.37z" />
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.63l3.99 3.09c.95-2.85 3.6-4.95 6.73-4.95z" />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-surface border border-border cursor-pointer text-sm font-semibold hover:border-text-muted transition-colors"
          >
            <svg width="16" height="18" viewBox="0 0 384 512" fill="#FFFFFF">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.5 0 273c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-57.7-90-57.7-91.4zM256.8 88.7c26.9-32 24.5-61.2 23.7-71.7-23.8 1.4-51.3 16.4-67 34.9-17.3 19.8-27.5 44.4-25.3 71.3 25.4 2 48.6-10.7 68.6-34.5z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-text-body">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`${inputClass} ${errors.email ? "border-danger" : "border-border"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="text-xs text-danger-bright">{errors.email}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-text-body">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary-light">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className={`${inputClass} ${errors.password ? "border-danger" : "border-border"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="text-xs text-danger-bright">{errors.password}</span>}
          </div>
          <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              className="w-[15px] h-[15px] accent-primary"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <button
            type="submit"
            className="text-center py-3.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer shadow-glow-lg hover:bg-primary-dark transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-[13px] text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:text-primary-light">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
