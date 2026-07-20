import React from "react";
import { Trade } from "@/lib/types";
import { directionColors } from "./Badge";
import { formatDateTime } from "@/lib/mockData";

export function TradeCard({ trade }: { trade: Trade }) {
  const dir = directionColors[trade.direction];
  const pnlColor = trade.pnl >= 0 ? "#4ADE80" : "#F87171";
  const pnlLabel = `${trade.pnl >= 0 ? "+" : "-"}$${Math.abs(trade.pnl).toFixed(2)}`;

  return (
    <div className="bg-card border border-border rounded-3xl p-5.5 flex flex-col gap-4 shadow-card">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-border flex items-center justify-center text-[11px] font-bold text-text-secondary shrink-0">
            {trade.pair}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[15px] font-bold">{trade.pairFull}</span>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg"
                style={{ background: dir.bg, color: dir.color }}
              >
                {trade.direction}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-border text-text-secondary">
                {trade.strategy}
              </span>
            </div>
            <div className="text-xs text-text-secondary mt-1">
              {formatDateTime(trade.date)} · {trade.account}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold" style={{ color: pnlColor }}>
            {pnlLabel}
          </div>
          <div className="text-xs text-text-secondary mt-0.5">RR {trade.rr}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3.5 border-t border-border">
        <div>
          <div className="text-[11px] text-text-muted">Entry</div>
          <div className="text-[13px] font-semibold mt-0.5">{trade.entry}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Exit</div>
          <div className="text-[13px] font-semibold mt-0.5">{trade.exit}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Stop Loss</div>
          <div className="text-[13px] font-semibold mt-0.5">{trade.sl}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Take Profit</div>
          <div className="text-[13px] font-semibold mt-0.5">{trade.tp}</div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Emotion</div>
          <div className="text-[13px] font-semibold mt-0.5">{trade.emotion}</div>
        </div>
      </div>
    </div>
  );
}
