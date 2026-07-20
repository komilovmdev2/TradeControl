"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import { GoalPeriod } from "@/lib/types";

const PERIOD_LABEL: Record<GoalPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

const PERIOD_DAYS: Record<GoalPeriod, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

const ACHIEVEMENTS = [
  { emoji: "🏆", label: "10 Win Streak" },
  { emoji: "🎯", label: "100 Trades" },
  { emoji: "💎", label: "$50K Milestone" },
  { emoji: "🔥", label: "6-Month Streak" },
];

export default function GoalsPage() {
  const { goals, setGoal, trades } = useApp();
  const [editing, setEditing] = useState<GoalPeriod | null>(null);
  const [draft, setDraft] = useState("");

  const now = useMemo(() => new Date(), []);

  const currentByPeriod = useMemo(() => {
    const result: Record<GoalPeriod, number> = { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
    (Object.keys(PERIOD_DAYS) as GoalPeriod[]).forEach((period) => {
      const days = PERIOD_DAYS[period];
      result[period] = trades
        .filter((t) => (now.getTime() - new Date(t.date).getTime()) / 86400000 < days)
        .reduce((s, t) => s + t.pnl, 0);
    });
    return result;
  }, [trades, now]);

  // Longest consecutive winning-trade streak, used to unlock the streak achievement.
  const winStreak = useMemo(() => {
    const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let max = 0;
    let cur = 0;
    for (const t of sorted) {
      if (t.pnl > 0) {
        cur += 1;
        max = Math.max(max, cur);
      } else {
        cur = 0;
      }
    }
    return max;
  }, [trades]);

  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);

  const unlocked = {
    "10 Win Streak": winStreak >= 10,
    "100 Trades": trades.length >= 100,
    "$50K Milestone": totalPnl >= 50000,
    "6-Month Streak": trades.length > 0 && (now.getTime() - new Date(trades[trades.length - 1].date).getTime()) / 86400000 >= 180,
  };

  function startEdit(period: GoalPeriod) {
    setEditing(period);
    setDraft(String(goals[period]));
  }

  function saveEdit(period: GoalPeriod) {
    const val = parseFloat(draft);
    if (!Number.isNaN(val) && val > 0) setGoal(period, val);
    setEditing(null);
  }

  return (
    <>
      <Navbar title="Goals" subtitle="Track your targets across every timeframe" />
      <div className="px-6 sm:px-8 pt-7 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {(Object.keys(PERIOD_LABEL) as GoalPeriod[]).map((period) => {
          const current = currentByPeriod[period];
          const target = goals[period];
          const pct = target > 0 ? Math.max(0, Math.min((current / target) * 100, 100)) : 0;
          const onTrack = current >= target * 0.6 || current >= target;
          const remaining = target - current;

          return (
            <div key={period} className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-4.5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-bold">{PERIOD_LABEL[period]} Goal</div>
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: onTrack ? "rgba(34,197,94,.15)" : "rgba(245,158,11,.15)",
                    color: onTrack ? "#4ADE80" : "#F59E0B",
                  }}
                >
                  {onTrack ? "On Track" : "Behind"}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-extrabold">${current.toFixed(0)}</div>
                {editing === period ? (
                  <input
                    autoFocus
                    className="bg-surface border border-border rounded-lg px-2 py-1 text-sm w-24 outline-none"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => saveEdit(period)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(period)}
                  />
                ) : (
                  <button
                    onClick={() => startEdit(period)}
                    className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors"
                    title="Click to edit target"
                  >
                    / ${target.toLocaleString()}
                  </button>
                )}
              </div>
              <div className="h-2.5 rounded-md bg-border overflow-hidden">
                <div
                  className="h-full rounded-md transition-all"
                  style={{
                    width: `${pct}%`,
                    background: onTrack ? "#22C55E" : "#F59E0B",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>{pct.toFixed(0)}% complete</span>
                <span>{remaining > 0 ? `$${remaining.toFixed(0)} to go` : "Target reached"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 sm:px-8 pb-12">
        <div className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-4 shadow-card">
          <div className="text-[15px] font-bold">Achievements</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {ACHIEVEMENTS.map((a) => {
              const isUnlocked = unlocked[a.label as keyof typeof unlocked];
              return (
                <div
                  key={a.label}
                  className="text-center py-4 rounded-2xl bg-surface border border-border"
                  style={{ opacity: isUnlocked ? 1 : 0.4 }}
                >
                  <div className="text-2xl">{a.emoji}</div>
                  <div className="text-xs font-semibold mt-2">{a.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
