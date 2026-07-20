"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import { dailyPnlMap, bestWorstDay } from "@/lib/calculations";
import { CalendarHeatmap } from "@/components/charts/CalendarHeatmap";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  const { trades } = useApp();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());

  const yearTrades = useMemo(
    () => trades.filter((t) => new Date(t.date).getFullYear() === year),
    [trades, year]
  );
  const { best, worst, green, red } = useMemo(() => bestWorstDay(yearTrades), [yearTrades]);
  const dayMap = useMemo(() => dailyPnlMap(trades), [trades]);

  const yearWeeks = useMemo(() => {
    const start = new Date(year, 0, 1);
    // align to the Sunday on/before Jan 1
    const startDow = start.getDay();
    const gridStart = new Date(start);
    gridStart.setDate(gridStart.getDate() - startDow);

    const weeks: { pnl: number | null; label: string }[][] = [];
    let cursor = new Date(gridStart);
    for (let w = 0; w < 53; w++) {
      const days: { pnl: number | null; label: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const inYear = cursor.getFullYear() === year;
        const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
        const entry = dayMap.get(key);
        days.push({
          pnl: inYear ? (entry ? entry.pnl : null) : null,
          label: inYear
            ? `${cursor.toLocaleDateString()}: ${entry ? `$${entry.pnl.toFixed(2)}` : "No trades"}`
            : "",
        });
        cursor = new Date(cursor);
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(days);
    }
    return weeks;
  }, [year, dayMap]);

  const monthDays = useMemo(() => {
    const monthIdx = now.getMonth();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${monthIdx}-${d}`;
      const entry = dayMap.get(key);
      days.push({
        num: d,
        pnl: entry ? entry.pnl : null,
      });
    }
    return days;
  }, [year, dayMap, now]);

  const startOffset = new Date(year, now.getMonth(), 1).getDay();
  const startOffsetMon = (startOffset + 6) % 7; // convert Sun=0 to Mon-first index

  return (
    <>
      <Navbar
        title="Calendar"
        subtitle="Daily profit & loss overview"
        right={
          <div className="flex gap-1.5">
            {[year - 1, year].map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className="text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: y === year ? "rgba(37,99,235,.15)" : "transparent",
                  color: y === year ? "#60A5FA" : "#94A3B8",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        }
      />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Best Day</div>
            <div className="text-xl font-extrabold mt-2 text-success-bright">
              {best ? `+$${best.pnl.toFixed(0)}` : "—"}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {best ? best.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Worst Day</div>
            <div className="text-xl font-extrabold mt-2 text-danger-bright">
              {worst ? `-$${Math.abs(worst.pnl).toFixed(0)}` : "—"}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {worst ? worst.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Green Days</div>
            <div className="text-xl font-extrabold mt-2">{green}</div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="text-xs text-text-secondary">Red Days</div>
            <div className="text-xl font-extrabold mt-2">{red}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-7 flex flex-col gap-4 shadow-card">
          <div className="text-[15px] font-bold">{year} Trading Activity</div>
          <CalendarHeatmap weeks={yearWeeks} cellSize={13} maxAbs={300} />
          <div className="flex items-center justify-between text-xs text-text-secondary pt-2.5 border-t border-border">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#450A0A]" />
              <div className="w-3 h-3 rounded-sm bg-[#7F1D1D]" />
              <div className="w-3 h-3 rounded-sm bg-border" />
              <div className="w-3 h-3 rounded-sm bg-[#14532D]" />
              <div className="w-3 h-3 rounded-sm bg-[#22C55E]" />
            </div>
            <span>More profit</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3.5 shadow-card">
          <div className="text-[15px] font-bold">
            {MONTHS[now.getMonth()]} {year}
          </div>
          <div className="grid grid-cols-7 gap-2 text-[11px] text-text-muted text-center">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startOffsetMon }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {monthDays.map((d) => (
              <div
                key={d.num}
                className="aspect-square rounded-xl border border-border flex flex-col items-center justify-center gap-0.5"
                style={{
                  background:
                    d.pnl === null ? "#0F172A" : d.pnl > 0 ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)",
                }}
              >
                <span className="text-xs text-text-secondary">{d.num}</span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: d.pnl === null ? "#64748B" : d.pnl > 0 ? "#4ADE80" : "#F87171" }}
                >
                  {d.pnl === null ? "—" : `${d.pnl > 0 ? "+" : "-"}$${Math.abs(d.pnl).toFixed(0)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
