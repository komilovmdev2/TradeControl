"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { KPICard } from "@/components/ui/KPICard";
import { EquityCurveChart } from "@/components/charts/EquityCurveChart";
import { CalendarHeatmap } from "@/components/charts/CalendarHeatmap";
import { useApp } from "@/lib/store";
import {
  computeKpis,
  equityCurveLastNDays,
  dailyPnlMap,
  strategyStats,
} from "@/lib/calculations";
import { directionColors } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/mockData";
import { STARTING_BALANCE } from "@/lib/mockData";

function qualityTag(value: number, thresholds: [number, string][], fallback: string) {
  for (const [t, label] of thresholds) {
    if (value >= t) return label;
  }
  return fallback;
}

export default function DashboardPage() {
  const { trades, strategies, openAddTrade } = useApp();

  const kpis = useMemo(() => computeKpis(trades), [trades]);
  const equityPoints = useMemo(() => {
    const raw = equityCurveLastNDays(trades, 30);
    return raw.map((p, i) => ({ label: `${i}`, balance: p.balance }));
  }, [trades]);

  const heatWeeks = useMemo(() => {
    const map = dailyPnlMap(trades);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { pnl: number | null; label: string }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const entry = map.get(key);
      days.push({
        pnl: entry ? entry.pnl : null,
        label: `${d.toLocaleDateString()}: ${entry ? `$${entry.pnl.toFixed(2)}` : "No trades"}`,
      });
    }
    const weeks: { pnl: number | null; label: string }[][] = [];
    for (let w = 0; w < 12; w++) weeks.push(days.slice(w * 7, w * 7 + 7));
    return weeks;
  }, [trades]);

  const recentTrades = trades.slice(0, 5);

  const topStrategies = useMemo(() => {
    return strategies
      .map((s) => ({ ...s, stats: strategyStats(trades, s.name) }))
      .filter((s) => s.stats.trades > 0)
      .sort((a, b) => b.stats.winRate - a.stats.winRate)
      .slice(0, 4);
  }, [strategies, trades]);

  const balanceTag = `${kpis.growthPct >= 0 ? "+" : ""}${kpis.growthPct.toFixed(1)}%`;
  const todayTag = `${kpis.todayPnl >= 0 ? "+" : ""}${((kpis.todayPnl / STARTING_BALANCE) * 100).toFixed(1)}%`;
  const weekTag = `${kpis.weeklyPnl >= 0 ? "+" : ""}${((kpis.weeklyPnl / STARTING_BALANCE) * 100).toFixed(1)}%`;
  const monthTag = `${kpis.monthlyPnl >= 0 ? "+" : ""}${((kpis.monthlyPnl / STARTING_BALANCE) * 100).toFixed(1)}%`;

  const kpiData = [
    {
      label: "Total Balance",
      value: `$${kpis.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      tag: balanceTag,
      tagBg: kpis.growthPct >= 0 ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
      tagColor: kpis.growthPct >= 0 ? "#4ADE80" : "#F87171",
    },
    {
      label: "Today's P/L",
      value: `${kpis.todayPnl >= 0 ? "+" : "-"}$${Math.abs(kpis.todayPnl).toFixed(0)}`,
      tag: todayTag,
      tagBg: kpis.todayPnl >= 0 ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
      tagColor: kpis.todayPnl >= 0 ? "#4ADE80" : "#F87171",
    },
    {
      label: "Weekly P/L",
      value: `${kpis.weeklyPnl >= 0 ? "+" : "-"}$${Math.abs(kpis.weeklyPnl).toFixed(0)}`,
      tag: weekTag,
      tagBg: kpis.weeklyPnl >= 0 ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
      tagColor: kpis.weeklyPnl >= 0 ? "#4ADE80" : "#F87171",
    },
    {
      label: "Monthly P/L",
      value: `${kpis.monthlyPnl >= 0 ? "+" : "-"}$${Math.abs(kpis.monthlyPnl).toFixed(0)}`,
      tag: monthTag,
      tagBg: kpis.monthlyPnl >= 0 ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
      tagColor: kpis.monthlyPnl >= 0 ? "#4ADE80" : "#F87171",
    },
    {
      label: "Win Rate",
      value: `${kpis.winRate.toFixed(1)}%`,
      tag: qualityTag(kpis.winRate, [[65, "Great"], [50, "Good"]], "Weak"),
      tagBg: "rgba(37,99,235,.15)",
      tagColor: "#60A5FA",
    },
    {
      label: "Profit Factor",
      value: kpis.profitFactor === Infinity ? "∞" : kpis.profitFactor.toFixed(2),
      tag: qualityTag(kpis.profitFactor === Infinity ? 99 : kpis.profitFactor, [[2, "Strong"], [1.2, "Stable"]], "Weak"),
      tagBg: "rgba(37,99,235,.15)",
      tagColor: "#60A5FA",
    },
    {
      label: "Avg RR",
      value: kpis.avgRR.toFixed(2),
      tag: qualityTag(kpis.avgRR, [[1.5, "Healthy"]], "Low"),
      tagBg: "rgba(37,99,235,.15)",
      tagColor: "#60A5FA",
    },
    {
      label: "Max Drawdown",
      value: `${kpis.maxDrawdownPct.toFixed(1)}%`,
      tag: Math.abs(kpis.maxDrawdownPct) < 10 ? "Low" : "High",
      tagBg: "rgba(239,68,68,.15)",
      tagColor: "#F87171",
    },
  ];

  return (
    <>
      <Navbar
        title="Dashboard"
        subtitle="Welcome back, here's your trading overview"
        showSearch
        showAddTrade
      />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiData.map((k) => (
            <KPICard key={k.label} {...k} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-5 items-stretch">
          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-bold">Equity Curve</div>
                <div className="text-xs text-text-secondary mt-0.5">Last 30 days</div>
              </div>
              <div className="flex gap-1.5">
                <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light">30D</div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-lg text-text-secondary">90D</div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-lg text-text-secondary">1Y</div>
              </div>
            </div>
            <EquityCurveChart data={equityPoints} />
            <div className="flex gap-7 pt-1 border-t border-border">
              <div>
                <div className="text-[11px] text-text-secondary">Starting</div>
                <div className="text-sm font-bold mt-0.5">${STARTING_BALANCE.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] text-text-secondary">Current</div>
                <div className="text-sm font-bold mt-0.5 text-success-bright">
                  ${kpis.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-text-secondary">Growth</div>
                <div
                  className="text-sm font-bold mt-0.5"
                  style={{ color: kpis.growthPct >= 0 ? "#4ADE80" : "#F87171" }}
                >
                  {balanceTag}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3.5 shadow-card">
            <div>
              <div className="text-[15px] font-bold">Trading Calendar</div>
              <div className="text-xs text-text-secondary mt-0.5">Daily P/L, last 12 weeks</div>
            </div>
            <CalendarHeatmap weeks={heatWeeks} maxAbs={300} />
            <div className="flex items-center justify-between text-[11px] text-text-secondary pt-2 border-t border-border">
              <span>Loss</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#7F1D1D]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-border" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#14532D]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#22C55E]" />
              </div>
              <span>Profit</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-5 items-start">
          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3.5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-bold">Recent Trades</div>
              <Link href="/journal" className="text-[13px] font-semibold text-primary hover:text-primary-light">
                View all →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentTrades.map((t) => {
                const dir = directionColors[t.direction];
                const pnlColor = t.pnl >= 0 ? "#4ADE80" : "#F87171";
                return (
                  <div key={t.id} className="flex items-center gap-3.5 p-3 rounded-2xl bg-surface border border-border">
                    <div className="w-10 h-10 rounded-[11px] bg-border flex items-center justify-center text-[11px] font-bold text-text-secondary shrink-0">
                      {t.pair}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{t.pairFull}</span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: dir.bg, color: dir.color }}
                        >
                          {t.direction}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {timeAgo(t.date)} · RR {t.rr}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold" style={{ color: pnlColor }}>
                        {t.pnl >= 0 ? "+" : "-"}${Math.abs(t.pnl).toFixed(0)}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">{t.pips}</div>
                    </div>
                  </div>
                );
              })}
              {recentTrades.length === 0 && (
                <div className="text-sm text-text-secondary py-6 text-center">No trades logged yet.</div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-4 shadow-card">
            <div className="text-[15px] font-bold">Top Strategies</div>
            <div className="flex flex-col gap-4">
              {topStrategies.map((s) => (
                <div key={s.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{s.name}</span>
                    <span className="text-[13px] font-bold text-success-bright">{s.stats.winRate.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded bg-border overflow-hidden">
                    <div
                      className="h-full rounded bg-gradient-to-r from-primary to-primary-light"
                      style={{ width: `${Math.min(s.stats.winRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {topStrategies.length === 0 && (
                <div className="text-sm text-text-secondary">Log trades to see strategy performance.</div>
              )}
            </div>
            <div className="border-t border-border pt-3.5 flex flex-col gap-2.5">
              <div className="text-[13px] font-bold text-text-secondary">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={openAddTrade}
                  className="text-xs font-semibold text-center py-2.5 rounded-xl bg-surface border border-border cursor-pointer hover:border-text-muted transition-colors"
                >
                  Import CSV
                </button>
                <Link
                  href="/reports"
                  className="text-xs font-semibold text-center py-2.5 rounded-xl bg-surface border border-border hover:border-text-muted transition-colors"
                >
                  Export Report
                </Link>
                <Link
                  href="/goals"
                  className="text-xs font-semibold text-center py-2.5 rounded-xl bg-surface border border-border hover:border-text-muted transition-colors"
                >
                  New Goal
                </Link>
                <Link
                  href="/ai-coach"
                  className="text-xs font-semibold text-center py-2.5 rounded-xl bg-surface border border-border hover:border-text-muted transition-colors"
                >
                  AI Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
