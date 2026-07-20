"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { TradeCard } from "@/components/ui/TradeCard";
import { useApp } from "@/lib/store";
import { computeKpis } from "@/lib/calculations";

export default function JournalPage() {
  const { trades, strategies } = useApp();
  const [search, setSearch] = useState("");
  const [pair, setPair] = useState("All Pairs");
  const [strategy, setStrategy] = useState("All Strategies");
  const [dateRange, setDateRange] = useState<"All Time" | "Last 7 Days" | "Last 30 Days" | "Last 90 Days">(
    "All Time"
  );
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const pairs = useMemo(() => ["All Pairs", ...Array.from(new Set(trades.map((t) => t.pairFull)))], [trades]);
  const strategyNames = useMemo(
    () => ["All Strategies", ...Array.from(new Set(strategies.map((s) => s.name)))],
    [strategies]
  );

  const filtered = useMemo(() => {
    const now = new Date();
    const days = dateRange === "Last 7 Days" ? 7 : dateRange === "Last 30 Days" ? 30 : dateRange === "Last 90 Days" ? 90 : null;

    let list = trades.filter((t) => {
      if (pair !== "All Pairs" && t.pairFull !== pair) return false;
      if (strategy !== "All Strategies" && t.strategy !== strategy) return false;
      if (days) {
        const diff = (now.getTime() - new Date(t.date).getTime()) / 86400000;
        if (diff > days) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${t.pairFull} ${t.strategy} ${t.notes} ${t.broker} ${t.account}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sort === "newest" ? -diff : diff;
    });

    return list;
  }, [trades, pair, strategy, dateRange, search, sort]);

  const kpis = useMemo(() => computeKpis(trades), [trades]);

  const cycleDateRange = () => {
    const opts: typeof dateRange[] = ["All Time", "Last 7 Days", "Last 30 Days", "Last 90 Days"];
    setDateRange(opts[(opts.indexOf(dateRange) + 1) % opts.length]);
  };

  return (
    <>
      <Navbar
        title="Trade Journal"
        subtitle={`${trades.length} trades logged · ${kpis.winRate.toFixed(1)}% win rate`}
        showAddTrade
      />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5 flex-1 min-w-[220px]">
            <Search size={16} className="text-text-muted" strokeWidth={2} />
            <input
              className="bg-transparent outline-none text-[13px] text-white placeholder:text-text-muted w-full font-sans"
              placeholder="Search by pair, strategy, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="text-[13px] font-semibold px-4 py-2.5 rounded-xl bg-card border border-border cursor-pointer text-text-body outline-none"
          >
            {pairs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="text-[13px] font-semibold px-4 py-2.5 rounded-xl bg-card border border-border cursor-pointer text-text-body outline-none"
          >
            {strategyNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={cycleDateRange}
            className="text-[13px] font-semibold px-4 py-2.5 rounded-xl bg-card border border-border cursor-pointer text-text-body hover:border-text-muted transition-colors"
          >
            {dateRange}
          </button>

          <button
            onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
            className="text-[13px] font-bold px-4 py-2.5 rounded-xl bg-primary/15 text-primary-light cursor-pointer hover:bg-primary/25 transition-colors"
          >
            Sort: {sort === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {filtered.map((t) => (
            <TradeCard key={t.id} trade={t} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-text-secondary text-sm py-16">
              No trades match your filters. Try adjusting search or filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
