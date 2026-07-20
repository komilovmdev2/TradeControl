"use client";

import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import { strategyStats } from "@/lib/calculations";

export default function StrategiesPage() {
  const { strategies, trades, addStrategy } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");

  const enriched = useMemo(
    () => strategies.map((s) => ({ ...s, stats: strategyStats(trades, s.name) })),
    [strategies, trades]
  );

  function handleCreate() {
    if (!newName.trim()) return;
    addStrategy({
      name: newName.trim(),
      emoji: newEmoji || "🎯",
      iconBg: "rgba(37,99,235,.15)",
      description: newDesc.trim() || "Custom strategy — describe your edge here.",
    });
    setNewName("");
    setNewDesc("");
    setNewEmoji("🎯");
    setShowNew(false);
  }

  return (
    <>
      <Navbar
        title="Strategies"
        subtitle={`${strategies.length} active playbooks`}
        right={
          <button
            onClick={() => setShowNew((v) => !v)}
            className="flex items-center gap-2 bg-primary rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer shadow-glow hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Strategy
          </button>
        }
      />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        {showNew && (
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-3.5">
            <div className="text-[15px] font-bold">New Strategy</div>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3.5">
              <input
                className="bg-surface border border-border rounded-xl px-3 py-2.5 text-center text-lg outline-none"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                maxLength={2}
              />
              <input
                className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-[13px] outline-none"
                placeholder="Strategy name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <textarea
              className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-[13px] outline-none"
              placeholder="Describe your edge..."
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2 rounded-xl bg-border text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-primary text-sm font-semibold cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {enriched.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: s.iconBg }}
                  >
                    {s.emoji}
                  </div>
                  <div>
                    <div className="text-base font-bold">{s.name}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{s.stats.trades} trades</div>
                  </div>
                </div>
                <div className="text-xl font-extrabold text-success-bright">{s.stats.winRate.toFixed(0)}%</div>
              </div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{s.description}</div>
              <div className="h-1.5 rounded bg-border overflow-hidden">
                <div
                  className="h-full rounded bg-gradient-to-r from-primary to-primary-light"
                  style={{ width: `${Math.min(s.stats.winRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-secondary pt-2 border-t border-border">
                <span>
                  Profit Factor{" "}
                  <b className="text-white">{s.stats.profitFactor === Infinity ? "∞" : s.stats.profitFactor.toFixed(1)}</b>
                </span>
                <span>
                  Avg RR <b className="text-white">{s.stats.avgRR.toFixed(1)}</b>
                </span>
                <span>
                  Net P/L{" "}
                  <b style={{ color: s.stats.netPnl >= 0 ? "#4ADE80" : "#F87171" }}>
                    {s.stats.netPnl >= 0 ? "+" : "-"}${Math.abs(s.stats.netPnl).toFixed(0)}
                  </b>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
