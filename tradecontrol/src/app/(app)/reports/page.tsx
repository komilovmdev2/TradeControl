"use client";

import React, { useMemo, useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import { monthlyBreakdown } from "@/lib/calculations";

export default function ReportsPage() {
  const { trades } = useApp();
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const months = useMemo(() => monthlyBreakdown(trades), [trades]);
  const current = months[0];
  const currentTrades = useMemo(() => {
    if (!current) return [];
    return trades.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === current.year && d.getMonth() === current.month;
    });
  }, [trades, current]);

  const best = currentTrades.length ? Math.max(...currentTrades.map((t) => t.pnl)) : 0;
  const worst = currentTrades.length ? Math.min(...currentTrades.map((t) => t.pnl)) : 0;
  const winRate = currentTrades.length
    ? (currentTrades.filter((t) => t.pnl > 0).length / currentTrades.length) * 100
    : 0;

  function exportFile(kind: "PDF" | "Excel") {
    setExportMsg(`${kind} export generated for ${current?.label ?? "this period"} (demo — no file server configured).`);
    setTimeout(() => setExportMsg(null), 3500);
  }

  const today = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <Navbar
        title="Reports"
        subtitle="Monthly summaries, ready to export"
        right={
          <div className="flex gap-2.5">
            <button
              onClick={() => exportFile("PDF")}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:border-text-muted transition-colors"
            >
              <FileText size={16} className="text-text-secondary" strokeWidth={2} />
              Export PDF
            </button>
            <button
              onClick={() => exportFile("Excel")}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:border-text-muted transition-colors"
            >
              <FileSpreadsheet size={16} className="text-success-bright" strokeWidth={2} />
              Export Excel
            </button>
          </div>
        }
      />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        {exportMsg && (
          <div className="text-[13px] px-4 py-3 rounded-2xl bg-primary/12 border border-primary/25 text-primary-light">
            {exportMsg}
          </div>
        )}

        <div className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-5 shadow-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-[15px] font-bold">{current ? `${current.label} Summary` : "No data yet"}</div>
            <span className="text-xs text-text-secondary">Generated {today}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <div className="text-[11px] text-text-secondary">Net P/L</div>
              <div className="text-lg font-extrabold mt-1" style={{ color: (current?.pnl ?? 0) >= 0 ? "#4ADE80" : "#F87171" }}>
                {(current?.pnl ?? 0) >= 0 ? "+" : "-"}${Math.abs(current?.pnl ?? 0).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-text-secondary">Trades</div>
              <div className="text-lg font-extrabold mt-1">{current?.count ?? 0}</div>
            </div>
            <div>
              <div className="text-[11px] text-text-secondary">Win Rate</div>
              <div className="text-lg font-extrabold mt-1">{winRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[11px] text-text-secondary">Best Trade</div>
              <div className="text-lg font-extrabold mt-1 text-success-bright">+${best.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-[11px] text-text-secondary">Worst Trade</div>
              <div className="text-lg font-extrabold mt-1 text-danger-bright">-${Math.abs(worst).toFixed(0)}</div>
            </div>
          </div>
        </div>

        <div className="text-[15px] font-bold pt-1">Past Reports</div>
        <div className="flex flex-col gap-2.5">
          {months.slice(1).map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between bg-card border border-border rounded-2xl px-5 py-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-[11px] bg-border flex items-center justify-center">
                  <FileText size={18} className="text-text-secondary" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{m.label} Report</div>
                  <div className="text-xs text-text-secondary mt-0.5">{m.count} trades</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className="text-sm font-bold" style={{ color: m.pnl >= 0 ? "#4ADE80" : "#F87171" }}>
                  {m.pnl >= 0 ? "+" : "-"}${Math.abs(m.pnl).toFixed(0)}
                </span>
                <button
                  onClick={() => exportFile("PDF")}
                  className="text-[13px] font-semibold text-primary-light cursor-pointer hover:text-primary transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
          {months.length <= 1 && (
            <div className="text-center text-sm text-text-secondary py-10">
              Log trades across multiple months to build a report history.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
