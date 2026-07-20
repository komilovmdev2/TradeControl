"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useApp } from "@/lib/store";
import { Direction, Emotion } from "@/lib/types";
import { UploadCloud } from "lucide-react";

const EMOTIONS: Emotion[] = ["Confident", "Calm", "Focused", "Anxious", "Impatient"];

const MARKET_MULTIPLIER: Record<string, number> = {
  forex: 100000,
  gold: 100,
  crypto: 1,
  indices: 1,
  stocks: 1,
};

function marketMultiplier(market: string) {
  const key = market.trim().toLowerCase();
  return MARKET_MULTIPLIER[key] ?? 100000;
}

const initialForm = {
  broker: "FTMO",
  account: "100K Challenge",
  market: "Forex",
  pair: "",
  direction: "BUY" as Direction,
  entry: "",
  exit: "",
  sl: "",
  tp: "",
  riskPercent: "2.0",
  lotSize: "",
  rr: "",
  commission: "",
  strategy: "",
  emotion: "Confident" as Emotion,
  notes: "",
  screenshotName: "",
};

export function AddTradeModal() {
  const { isAddTradeOpen, closeAddTrade, addTrade, strategies } = useApp();
  const [form, setForm] = useState(initialForm);

  const set = <K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function reset() {
    setForm({ ...initialForm, strategy: strategies[0]?.name ?? "" });
  }

  function handleClose() {
    closeAddTrade();
    reset();
  }

  function handleSave() {
    const entry = parseFloat(form.entry) || 0;
    const exit = parseFloat(form.exit) || entry;
    const sl = parseFloat(form.sl) || 0;
    const tp = parseFloat(form.tp) || 0;
    const lotSize = parseFloat(form.lotSize) || 0.1;
    const riskPercent = parseFloat(form.riskPercent) || 1;
    const commission = parseFloat(form.commission) || 0;

    const mult = marketMultiplier(form.market);
    const rawMove = form.direction === "BUY" ? exit - entry : entry - exit;
    const pnl = +(rawMove * lotSize * mult - commission).toFixed(2);

    let rr = parseFloat(form.rr);
    if (!rr && sl && tp && entry) {
      const risk = Math.abs(entry - sl);
      const reward = Math.abs(tp - entry);
      rr = risk > 0 ? +(reward / risk).toFixed(2) : 0;
    }
    if (!rr || Number.isNaN(rr)) rr = 1;

    const pipsMoved = Math.abs(exit - entry);
    const pips = `${rawMove >= 0 ? "+" : "-"}${(pipsMoved * (mult === 1 ? 1 : 10000)).toFixed(mult === 1 ? 2 : 0)} ${
      mult === 100000 ? "pips" : mult === 1 ? "pts" : "pips"
    }`;

    addTrade({
      broker: form.broker || "Personal",
      account: form.account || "Personal",
      market: form.market || "Forex",
      pair: (form.pair || "N/A").replace("/", "").slice(0, 4).toUpperCase(),
      pairFull: form.pair || "N/A",
      direction: form.direction,
      entry,
      exit,
      sl,
      tp,
      riskPercent,
      lotSize,
      rr,
      commission,
      strategy: form.strategy || strategies[0]?.name || "Discretionary",
      emotion: form.emotion,
      notes: form.notes,
      screenshotName: form.screenshotName || undefined,
      pnl,
      pips,
      date: new Date().toISOString(),
    });

    handleClose();
  }

  const inputClass =
    "bg-surface border border-border rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none w-full font-sans focus:border-primary transition-colors";
  const labelClass = "text-xs font-semibold text-text-secondary";

  return (
    <Modal
      open={isAddTradeOpen}
      onClose={handleClose}
      title="Add Trade"
      subtitle="Log a new trade to your journal"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Trade
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Broker</label>
            <input className={inputClass} value={form.broker} onChange={(e) => set("broker", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Account</label>
            <input className={inputClass} value={form.account} onChange={(e) => set("account", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Market</label>
            <input className={inputClass} value={form.market} onChange={(e) => set("market", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Pair / Instrument</label>
            <input
              className={inputClass}
              placeholder="EUR/USD"
              value={form.pair}
              onChange={(e) => set("pair", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Direction</label>
            <div className="flex gap-2">
              {(["BUY", "SELL"] as Direction[]).map((d) => {
                const active = form.direction === d;
                const isBuy = d === "BUY";
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set("direction", d)}
                    className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-bold cursor-pointer border transition-colors"
                    style={{
                      background: active ? (isBuy ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)") : "#0F172A",
                      color: active ? (isBuy ? "#4ADE80" : "#F87171") : "#94A3B8",
                      borderColor: active ? (isBuy ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)") : "#1F2937",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Entry</label>
            <input className={inputClass} placeholder="1.0842" value={form.entry} onChange={(e) => set("entry", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Exit</label>
            <input className={inputClass} placeholder="1.0904" value={form.exit} onChange={(e) => set("exit", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Stop Loss</label>
            <input className={inputClass} placeholder="1.0812" value={form.sl} onChange={(e) => set("sl", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Take Profit</label>
            <input className={inputClass} placeholder="1.0918" value={form.tp} onChange={(e) => set("tp", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Risk %</label>
            <input className={inputClass} placeholder="2.0" value={form.riskPercent} onChange={(e) => set("riskPercent", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Lot Size</label>
            <input className={inputClass} placeholder="0.42" value={form.lotSize} onChange={(e) => set("lotSize", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Risk-Reward</label>
            <input className={inputClass} placeholder="auto" value={form.rr} onChange={(e) => set("rr", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Commission</label>
            <input className={inputClass} placeholder="3.20" value={form.commission} onChange={(e) => set("commission", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Strategy</label>
            <select
              className={inputClass}
              value={form.strategy || strategies[0]?.name || ""}
              onChange={(e) => set("strategy", e.target.value)}
            >
              {strategies.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Emotion</label>
            <div className="flex gap-1.5 flex-wrap">
              {EMOTIONS.map((em) => {
                const active = form.emotion === em;
                return (
                  <button
                    key={em}
                    type="button"
                    onClick={() => set("emotion", em)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border transition-colors"
                    style={{
                      background: active ? "rgba(37,99,235,.15)" : "#0F172A",
                      color: active ? "#60A5FA" : "#94A3B8",
                      borderColor: active ? "transparent" : "#1F2937",
                    }}
                  >
                    {em}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Screenshot</label>
          <label className="border border-dashed border-border rounded-2xl py-7 text-center text-[13px] text-text-muted bg-surface cursor-pointer flex flex-col items-center gap-2">
            <UploadCloud size={24} strokeWidth={1.5} className="text-text-dim" />
            {form.screenshotName ? form.screenshotName : "Drop a chart screenshot, or click to upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => set("screenshotName", e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Notes</label>
          <textarea
            className={inputClass}
            rows={3}
            placeholder="What was your reasoning for this trade?"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
