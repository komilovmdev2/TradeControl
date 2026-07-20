"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/dashboard"), 1800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(37,99,235,.14), #020817 70%)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow-lg animate-pulse-logo">
          <svg width="34" height="34" viewBox="0 0 16 16" fill="none">
            <path d="M2 12L6 7L9 10L14 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-[26px] font-extrabold text-white tracking-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
          TradeControl
        </div>
        <div
          className="text-[13px] text-text-secondary tracking-widest uppercase animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Precision Trading, Perfected
        </div>
        <div className="w-8 h-8 rounded-full border-[3px] border-border border-t-primary animate-spin mt-2" />
      </div>
    </div>
  );
}
