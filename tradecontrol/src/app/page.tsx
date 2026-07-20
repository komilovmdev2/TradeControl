import React from "react";
import Link from "next/link";
import { LineChart, Calendar, Bot, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: LineChart,
    bg: "rgba(37,99,235,.15)",
    color: "#60A5FA",
    title: "Advanced Analytics",
    desc: "Win rate, profit factor, drawdown, and equity curves calculated automatically from every trade.",
  },
  {
    icon: Calendar,
    bg: "rgba(34,197,94,.15)",
    color: "#4ADE80",
    title: "Visual Trade Journal",
    desc: "Log entries with screenshots, notes, and emotions — reviewed in a clean, card-based timeline.",
  },
  {
    icon: Bot,
    bg: "rgba(245,158,11,.15)",
    color: "#F59E0B",
    title: "AI Trade Coach",
    desc: "Get AI-powered feedback on mistakes, psychology patterns, and personalized improvement plans.",
  },
];

const TESTIMONIALS = [
  {
    quote: "TradeControl completely changed how I review my trades. The analytics alone paid for a year of subscription.",
    name: "Marcus Reed",
    role: "Futures Trader",
  },
  {
    quote: "The calendar heatmap and AI psychology insights helped me spot patterns I never noticed before.",
    name: "Elena Popova",
    role: "FX Trader",
  },
  {
    quote: "Finally a journal that feels premium. Fast, clean, and it actually looks like a real fintech product.",
    name: "James Okafor",
    role: "Prop Trader",
  },
];

const PLANS = [
  { name: "Starter", price: "$0", desc: "For casual traders getting started", cta: "Get Started", href: "/register", highlight: false },
  { name: "Pro", price: "$29", desc: "Full analytics, AI coach, unlimited trades", cta: "Start Free Trial", href: "/register", highlight: true },
  { name: "Elite", price: "$79", desc: "For prop firms and trading teams", cta: "Contact Sales", href: "/register", highlight: false },
];

const FAQS = [
  { q: "Can I import trades from my broker?", a: "Yes, CSV import supports all major brokers and prop firms." },
  { q: "Is there a free plan?", a: "Yes, the Starter plan is free forever with core journaling features." },
  { q: "Can I cancel anytime?", a: "Yes, no contracts — cancel or change plans anytime from settings." },
];

export default function LandingPage() {
  return (
    <div className="bg-bg text-white">
      {/* NAV */}
      <div className="flex items-center justify-between px-6 sm:px-20 py-5 border-b border-border sticky top-0 bg-[rgba(2,8,23,.85)] backdrop-blur-md z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 7L9 10L14 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-base font-bold">TradeControl</span>
        </div>
        <div className="hidden md:flex items-center gap-9 text-sm font-medium text-text-secondary">
          <a href="#features" className="text-text-secondary hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-text-secondary hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="text-text-secondary hover:text-white transition-colors">Testimonials</a>
          <a href="#faq" className="text-text-secondary hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm font-semibold text-white hidden sm:block">Sign In</Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-primary text-sm font-semibold cursor-pointer shadow-glow hover:bg-primary-dark transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div
        className="px-6 sm:px-20 pt-24 sm:pt-32 pb-24 text-center flex flex-col items-center gap-7"
        style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,.16), transparent 70%)" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/12 border border-primary/30 text-[13px] font-semibold text-primary-light">
          <Sparkles size={14} strokeWidth={2.5} />
          Trusted by 12,000+ traders worldwide
        </div>
        <h1 className="text-[42px] sm:text-[64px] font-extrabold leading-[1.08] tracking-tight max-w-4xl">
          Trade with precision.{" "}
          <span className="bg-gradient-to-br from-primary-light to-primary bg-clip-text text-transparent">
            Journal with clarity.
          </span>
        </h1>
        <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
          The professional trading journal and analytics platform built for traders who take performance seriously.
        </p>
        <div className="flex gap-3.5 mt-2 flex-wrap justify-center">
          <Link
            href="/register"
            className="px-8 py-4 rounded-2xl bg-primary text-[15px] font-bold cursor-pointer shadow-glow-lg hover:bg-primary-dark transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl bg-card border border-border text-[15px] font-bold cursor-pointer hover:border-text-muted transition-colors"
          >
            Watch Demo
          </Link>
        </div>
        <div className="w-full max-w-[1100px] mt-10 rounded-4xl border border-border bg-surface p-1.5 shadow-modal">
          <div
            className="w-full aspect-video rounded-[18px] flex items-center justify-center text-text-muted font-mono text-[13px]"
            style={{
              background:
                "repeating-linear-gradient(135deg, #111827, #111827 12px, #0F172A 12px, #0F172A 24px)",
            }}
          >
            product screenshot — dashboard preview
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 sm:px-20 py-14 border-t border-b border-border">
        {[
          ["12,400+", "Active Traders"],
          ["2.8M", "Trades Logged"],
          ["99.9%", "Uptime"],
          ["4.9/5", "Average Rating"],
        ].map(([num, label]) => (
          <div key={label} className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold">{num}</div>
            <div className="text-[13px] text-text-secondary mt-1.5">{label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div id="features" className="px-6 sm:px-20 py-24 flex flex-col gap-14">
        <div className="text-center flex flex-col gap-3">
          <div className="text-[13px] font-bold text-primary-light tracking-wider uppercase">Features</div>
          <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight">Everything a serious trader needs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-4xl p-7 flex flex-col gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: f.bg }}>
                <f.icon size={20} color={f.color} strokeWidth={2} />
              </div>
              <div className="text-[17px] font-bold">{f.title}</div>
              <div className="text-sm text-text-secondary leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div id="testimonials" className="px-6 sm:px-20 py-24 bg-surface border-t border-b border-border flex flex-col gap-12">
        <h2 className="text-center text-[32px] sm:text-[38px] font-extrabold tracking-tight">Trusted by traders worldwide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-3xl p-6.5 flex flex-col gap-4">
              <p className="text-sm text-text-body leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-border" />
                <div>
                  <div className="text-[13px] font-bold">{t.name}</div>
                  <div className="text-xs text-text-secondary">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="px-6 sm:px-20 py-24 flex flex-col gap-12">
        <h2 className="text-center text-[32px] sm:text-[38px] font-extrabold tracking-tight">Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[1100px] w-full mx-auto">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="relative bg-card rounded-4xl p-8 flex flex-col gap-5"
              style={{
                border: p.highlight ? "2px solid #2563EB" : "1px solid #1F2937",
                boxShadow: p.highlight ? "0 20px 60px rgba(37,99,235,.25)" : undefined,
              }}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-8 bg-primary text-[11px] font-bold px-3 py-1 rounded-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="text-base font-bold">{p.name}</div>
              <div className="text-4xl font-extrabold">
                {p.price}
                <span className="text-sm text-text-secondary font-medium">/mo</span>
              </div>
              <div className="text-[13px] text-text-secondary">{p.desc}</div>
              <Link
                href={p.href}
                className="text-center py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors"
                style={{
                  background: p.highlight ? "#2563EB" : "#1F2937",
                  color: "#FFFFFF",
                }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="px-6 sm:px-20 py-24 bg-surface border-t border-border flex flex-col gap-10 items-center">
        <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight">Frequently asked questions</h2>
        <div className="flex flex-col gap-3 max-w-3xl w-full">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-card border border-border rounded-2xl px-6 py-5">
              <div className="text-[15px] font-bold">{f.q}</div>
              <div className="text-[13px] text-text-secondary mt-2 leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 sm:px-20 py-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-[26px] h-[26px] rounded-lg bg-gradient-to-br from-primary to-primary-dark" />
          <span className="text-sm font-bold">TradeControl</span>
        </div>
        <div className="text-[13px] text-text-muted">© 2026 TradeControl. All rights reserved.</div>
        <div className="flex gap-6 text-[13px] text-text-secondary">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </div>
  );
}
