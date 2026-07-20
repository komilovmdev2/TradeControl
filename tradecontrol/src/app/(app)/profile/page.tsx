"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import { computeKpis, monthlyBreakdown } from "@/lib/calculations";
import { useTranslation, useLocale, useLocaleCode, tf } from "@/lib/i18n";
import { profile as profileDict } from "@/lib/i18n/namespaces/profile";

export default function ProfilePage() {
  const { auth, trades } = useApp();
  const t = useTranslation(profileDict);
  const locale = useLocale();
  const localeCode = useLocaleCode();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(auth.user?.firstName ?? "");
  const [lastName, setLastName] = useState(auth.user?.lastName ?? "");

  const [now] = useState(() => Date.now());
  const kpis = useMemo(() => computeKpis(trades), [trades]);
  const months = useMemo(() => monthlyBreakdown(trades, locale), [trades, locale]);

  const initials = `${(firstName || "D")[0]}${(lastName || "K")[0]}`.toUpperCase();
  const joined = auth.user?.joined ? new Date(auth.user.joined) : new Date();
  const memberMonths = Math.max(
    1,
    Math.round((now - joined.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);

  const achievements = [
    { emoji: "🏆", label: t.winStreak10, unlocked: true },
    { emoji: "🎯", label: tf(t.tradesCount, { count: trades.length >= 1000 ? "1000" : "100" }), unlocked: trades.length >= 100 },
    { emoji: "💎", label: t.milestone50k, unlocked: totalPnl >= 50000 },
    { emoji: "🔥", label: tf(t.monthStreak, { count: memberMonths }), unlocked: memberMonths >= 3 },
  ];

  return (
    <>
      <Navbar title={t.title} />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        <div className="bg-card border border-border rounded-4xl p-7.5 flex items-center gap-6 flex-wrap shadow-card">
          <div className="w-[88px] h-[88px] rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-3xl font-extrabold shadow-glow-lg shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-[220px]">
            {editing ? (
              <div className="flex gap-2">
                <input
                  className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-lg font-bold outline-none w-32"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-lg font-bold outline-none w-32"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            ) : (
              <div className="text-[22px] font-extrabold">
                {firstName} {lastName}
              </div>
            )}
            <div className="text-sm text-text-secondary mt-1">
              {t.propTrader} · {tf(t.joined, { date: joined.toLocaleDateString(localeCode, { month: "short", year: "numeric" }) })}
            </div>
            <div className="flex gap-2.5 mt-3.5">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light">
                {auth.user?.plan ?? "Pro Plan"}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-success/15 text-success-bright">{t.verified}</span>
            </div>
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="px-5 py-2.5 rounded-xl bg-border text-[13px] font-semibold cursor-pointer hover:bg-text-muted/40 transition-colors"
          >
            {editing ? t.saveProfile : t.editProfile}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">{t.totalTrades}</div>
            <div className="text-[22px] font-extrabold mt-2">{trades.length.toLocaleString(localeCode)}</div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">{t.winRate}</div>
            <div className="text-[22px] font-extrabold mt-2">{kpis.winRate.toFixed(1)}%</div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">{t.totalPnl}</div>
            <div className="text-[22px] font-extrabold mt-2" style={{ color: totalPnl >= 0 ? "#4ADE80" : "#F87171" }}>
              {totalPnl >= 0 ? "+" : "-"}${Math.abs(totalPnl / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">{t.memberSince}</div>
            <div className="text-[22px] font-extrabold mt-2">{tf(t.monthsShort, { count: memberMonths })}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-4 shadow-card">
          <div className="text-[15px] font-bold">{t.achievements}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {achievements.map((a) => (
              <div
                key={a.label}
                className="text-center py-4 rounded-2xl bg-surface border border-border"
                style={{ opacity: a.unlocked ? 1 : 0.4 }}
              >
                <div className="text-2xl">{a.emoji}</div>
                <div className="text-xs font-semibold mt-2">{a.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-3.5 shadow-card">
          <div className="text-[15px] font-bold">{t.tradingHistory}</div>
          <div className="flex flex-col gap-1">
            {months.slice(0, 6).map((m, i) => (
              <div
                key={m.label}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < 5 ? "1px solid #1F2937" : "none" }}
              >
                <span className="text-[13px] text-text-secondary">{m.label}</span>
                <span className="text-[13px] font-bold" style={{ color: m.pnl >= 0 ? "#4ADE80" : "#F87171" }}>
                  {m.pnl >= 0 ? "+" : "-"}${Math.abs(m.pnl).toFixed(0)} · {tf(t.tradesSuffix, { count: m.count })}
                </span>
              </div>
            ))}
            {months.length === 0 && <div className="text-sm text-text-secondary py-4">{t.noHistory}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
