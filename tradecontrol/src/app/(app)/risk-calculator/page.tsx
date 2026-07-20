"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";

type Instrument = "Forex" | "Gold" | "Crypto" | "Indices";

const INSTRUMENT_CONFIG: Record<Instrument, { pipSize: number; pipValuePerLot: number; decimals: number }> = {
  Forex: { pipSize: 0.0001, pipValuePerLot: 10, decimals: 4 },
  Gold: { pipSize: 0.1, pipValuePerLot: 10, decimals: 1 },
  Crypto: { pipSize: 1, pipValuePerLot: 1, decimals: 0 },
  Indices: { pipSize: 1, pipValuePerLot: 1, decimals: 0 },
};

export default function RiskCalculatorPage() {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("2.0");
  const [rr, setRr] = useState("2.0");
  const [entry, setEntry] = useState("1.0842");
  const [sl, setSl] = useState("1.0812");
  const [instrument, setInstrument] = useState<Instrument>("Forex");

  const config = INSTRUMENT_CONFIG[instrument];

  const result = useMemo(() => {
    const acc = parseFloat(accountSize.replace(/[^0-9.]/g, "")) || 0;
    const risk = parseFloat(riskPercent.replace(/[^0-9.]/g, "")) || 0;
    const rrVal = parseFloat(rr) || 0;
    const entryVal = parseFloat(entry) || 0;
    const slVal = parseFloat(sl) || 0;

    const riskDollars = acc * (risk / 100);
    const pipsAtRisk = Math.abs(entryVal - slVal) / config.pipSize;
    const pipValue = config.pipValuePerLot;
    const lotSize = pipsAtRisk > 0 ? riskDollars / (pipsAtRisk * pipValue) : 0;
    const targetDollars = riskDollars * rrVal;

    const isBuy = entryVal >= slVal;
    const distance = Math.abs(entryVal - slVal);
    const takeProfit = isBuy ? entryVal + distance * rrVal : entryVal - distance * rrVal;

    return {
      lotSize,
      riskDollars,
      targetDollars,
      pipsAtRisk,
      pipValue,
      takeProfit,
    };
  }, [accountSize, riskPercent, rr, entry, sl, config]);

  const inputClass =
    "bg-surface border border-border rounded-2xl px-4 py-3.5 text-[15px] text-white outline-none w-full font-sans focus:border-primary transition-colors";
  const labelClass = "text-[13px] font-semibold text-text-body";

  return (
    <>
      <Navbar title="Risk Calculator" subtitle="Position sizing, calculated instantly" />
      <div className="px-6 sm:px-8 py-12 flex justify-center">
        <div className="w-full max-w-[480px] bg-card border border-border rounded-[28px] p-9 shadow-card-lg flex flex-col gap-5.5">
          <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/12 to-primary/[0.03] border border-primary/25">
            <div className="text-[13px] text-text-secondary font-semibold">Recommended Lot Size</div>
            <div className="text-[44px] font-extrabold mt-2 tracking-tight">{result.lotSize.toFixed(2)}</div>
            <div className="text-[13px] text-text-secondary mt-1.5">
              Risking{" "}
              <span className="text-danger-bright font-bold">${result.riskDollars.toFixed(2)}</span> · Target{" "}
              <span className="text-success-bright font-bold">${result.targetDollars.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Account Size</label>
            <input className={inputClass} value={accountSize} onChange={(e) => setAccountSize(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Risk %</label>
              <input className={inputClass} value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Risk-Reward</label>
              <input className={inputClass} value={rr} onChange={(e) => setRr(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Entry Price</label>
              <input className={inputClass} value={entry} onChange={(e) => setEntry(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Stop Loss</label>
              <input className={inputClass} value={sl} onChange={(e) => setSl(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Instrument</label>
            <div className="flex gap-2">
              {(["Forex", "Gold", "Crypto", "Indices"] as Instrument[]).map((i) => {
                const active = instrument === i;
                return (
                  <button
                    key={i}
                    onClick={() => setInstrument(i)}
                    className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-bold cursor-pointer border transition-colors"
                    style={{
                      background: active ? "rgba(37,99,235,.15)" : "#0F172A",
                      color: active ? "#60A5FA" : "#94A3B8",
                      borderColor: active ? "transparent" : "#1F2937",
                    }}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-[11px] text-text-secondary">Pips at Risk</div>
              <div className="text-[15px] font-bold mt-1">{result.pipsAtRisk.toFixed(0)}</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-text-secondary">Pip Value</div>
              <div className="text-[15px] font-bold mt-1">${result.pipValue.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-text-secondary">Take Profit</div>
              <div className="text-[15px] font-bold mt-1">{result.takeProfit.toFixed(config.decimals)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
