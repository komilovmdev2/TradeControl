"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import {
  computeKpis,
  performanceByPair,
  performanceByHour,
  commonMistakes,
} from "@/lib/calculations";
import { WinRateDonut } from "@/components/charts/WinRateDonut";
import { HourlyBarChart } from "@/components/charts/HourlyBarChart";

type Range = "30D" | "90D" | "All";

export default function AnalyticsPage() {
  const { trades } = useApp();
  const [range, setRange] = useState<Range>("All");

  const filtered = useMemo(() => {
    if (range === "All") return trades;
    const days = range === "30D" ? 30 : 90;
    const now = new Date();
    return trades.filter((t) => (now.getTime() - new Date(t.date).getTime()) / 86400000 <= days);
  }, [trades, range]);

  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const pairPerf = useMemo(() => performanceByPair(filtered), [filtered]);
  const hourPerf = useMemo(() => performanceByHour(filtered), [filtered]);
  const mistakes = useMemo(() => commonMistakes(filtered), [filtered]);

  const wins = filtered.filter((t) => t.pnl > 0).length;
  const losses = filtered.filter((t) => t.pnl <= 0).length;

  const maxPairAbs = Math.max(...pairPerf.map((p) => Math.abs(p.pnl)), 1);

  return (
    <>
      <Navbar
        title="Analytics"
        subtitle="Deep performance breakdown"
        right={
          <div className="hidden sm:flex gap-1.5">
            {(["30D", "90D", "All"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: range === r ? "rgba(37,99,235,.15)" : "transparent",
                  color: range === r ? "#60A5FA" : "#94A3B8",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Win Rate</div>
            <div className="text-2xl font-extrabold mt-2">{kpis.winRate.toFixed(1)}%</div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Profit Factor</div>
            <div className="text-2xl font-extrabold mt-2">
              {kpis.profitFactor === Infinity ? "∞" : kpis.profitFactor.toFixed(2)}
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Max Drawdown</div>
            <div className="text-2xl font-extrabold mt-2 text-danger-bright">{kpis.maxDrawdownPct.toFixed(1)}%</div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Avg RR</div>
            <div className="text-2xl font-extrabold mt-2">{kpis.avgRR.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-4 shadow-card">
            <div className="text-[15px] font-bold">Win Rate Breakdown</div>
            <WinRateDonut wins={wins} losses={losses} />
            <div className="flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-1.5 text-text-secondary">
                <div className="w-2.5 h-2.5 rounded-sm bg-success" />
                Wins ({wins})
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary">
                <div className="w-2.5 h-2.5 rounded-sm bg-border" />
                Losses ({losses})
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-4 shadow-card">
            <div className="text-[15px] font-bold">Performance by Pair</div>
            <div className="flex flex-col gap-3.5">
              {pairPerf.slice(0, 6).map((p) => (
                <div key={p.pairFull}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="font-semibold">{p.pairFull}</span>
                    <span className="font-bold" style={{ color: p.pnl >= 0 ? "#4ADE80" : "#F87171" }}>
                      {p.pnl >= 0 ? "+" : "-"}${Math.abs(p.pnl).toFixed(0)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded bg-border">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${Math.max((Math.abs(p.pnl) / maxPairAbs) * 100, 4)}%`,
                        background: p.pnl >= 0 ? "#2563EB" : "#EF4444",
                      }}
                    />
                  </div>
                </div>
              ))}
              {pairPerf.length === 0 && <div className="text-sm text-text-secondary">No trade data yet.</div>}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-4 shadow-card">
          <div className="text-[15px] font-bold">Best Trading Hours</div>
          <HourlyBarChart data={hourPerf} />
          <div className="flex justify-between text-[11px] text-text-muted">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3 shadow-card">
          <div className="text-[15px] font-bold">Common Mistakes (AI Detected)</div>
          <div className="flex flex-col gap-2.5">
            {mistakes.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-surface border border-border"
              >
                <span className="text-[13px]">{m.label}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: m.count > 10 ? "#F87171" : m.count > 0 ? "#F59E0B" : "#64748B" }}
                >
                  {m.count} occurrences
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
