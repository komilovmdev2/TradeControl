"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak password", "Fair password", "Good password", "Strong password"];
  const colors = ["#EF4444", "#EF4444", "#F59E0B", "#22C55E", "#22C55E"];
  return { score, label: pw ? labels[score] : "", color: colors[score] };
}

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => passwordStrength(password), [password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!firstName.trim()) nextErrors.firstName = "Required";
    if (!lastName.trim()) nextErrors.lastName = "Required";
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address";
    if (!password) nextErrors.password = "Password is required";
    else if (strength.score < 2) nextErrors.password = "Choose a stronger password";
    if (!agree) nextErrors.agree = "You must accept the terms to continue";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    router.push("/dashboard");
  }

  const inputClass =
    "bg-surface border rounded-xl px-3.5 py-3 text-sm text-white outline-none w-full font-sans focus:border-primary transition-colors";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(37,99,235,.16), #020817 60%)" }}
    >
      <div className="w-full max-w-[440px] bg-[rgba(17,24,39,.6)] backdrop-blur-xl border border-border rounded-4xl p-10 shadow-card-lg flex flex-col gap-5.5">
        <div className="text-center">
          <div className="text-[22px] font-extrabold tracking-tight">Create your account</div>
          <div className="text-[13px] text-text-secondary mt-1">Start your professional trading journal</div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-text-body">First name</label>
              <input
                placeholder="John"
                className={`${inputClass} ${errors.firstName ? "border-danger" : "border-border"}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-text-body">Last name</label>
              <input
                placeholder="Doe"
                className={`${inputClass} ${errors.lastName ? "border-danger" : "border-border"}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

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
            <label className="text-[13px] font-semibold text-text-body">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              className={`${inputClass} ${errors.password ? "border-danger" : "border-border"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-1.5 mt-0.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-sm"
                  style={{ background: i < strength.score ? strength.color : "#1F2937" }}
                />
              ))}
            </div>
            {strength.label && (
              <div className="text-xs font-semibold" style={{ color: strength.color }}>
                {strength.label}
              </div>
            )}
            {errors.password && <span className="text-xs text-danger-bright">{errors.password}</span>}
          </div>

          <label className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              className="w-[15px] h-[15px] accent-primary mt-0.5"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I agree to the <a href="#" className="text-primary hover:text-primary-light">Terms of Service</a> and{" "}
              <a href="#" className="text-primary hover:text-primary-light">Privacy Policy</a>
            </span>
          </label>
          {errors.agree && <span className="text-xs text-danger-bright -mt-2">{errors.agree}</span>}

          <button
            type="submit"
            className="text-center py-3.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer shadow-glow-lg hover:bg-primary-dark transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-[13px] text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-light">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
