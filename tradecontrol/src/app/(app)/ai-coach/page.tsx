"use client";

import React, { useMemo, useState } from "react";
import { Bot, Search, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";
import { commonMistakes, winRateByEmotion, computeKpis } from "@/lib/calculations";

export default function AiCoachPage() {
  const { trades } = useApp();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const mistakes = useMemo(() => commonMistakes(trades), [trades]);
  const psychology = useMemo(
    () => winRateByEmotion(trades).sort((a, b) => b.winRate - a.winRate),
    [trades]
  );
  const [now] = useState(() => new Date());
  const kpis = useMemo(() => computeKpis(trades), [trades]);

  const recent7 = useMemo(
    () => trades.filter((t) => (now.getTime() - new Date(t.date).getTime()) / 86400000 <= 7),
    [trades, now]
  );
  const prior7 = useMemo(
    () =>
      trades.filter((t) => {
        const d = (now.getTime() - new Date(t.date).getTime()) / 86400000;
        return d > 7 && d <= 14;
      }),
    [trades, now]
  );
  const recentWinRate = recent7.length ? (recent7.filter((t) => t.pnl > 0).length / recent7.length) * 100 : 0;
  const priorWinRate = prior7.length ? (prior7.filter((t) => t.pnl > 0).length / prior7.length) * 100 : 0;
  const winRateDelta = recentWinRate - priorWinRate;

  const topStrategyByPnl = useMemo(() => {
    const map = new Map<string, number>();
    trades.forEach((t) => map.set(t.strategy, (map.get(t.strategy) ?? 0) + t.pnl));
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "your top strategy";
  }, [trades]);

  const worstEmotion = psychology.length ? psychology[psychology.length - 1] : null;

  function askCoach() {
    if (!question.trim()) return;
    setAnswer(
      `Based on ${trades.length} logged trades, your win rate is ${kpis.winRate.toFixed(
        1
      )}% with a profit factor of ${kpis.profitFactor === Infinity ? "∞" : kpis.profitFactor.toFixed(
        2
      )}. Your strongest edge right now is "${topStrategyByPnl}" — consider concentrating position sizing there while you refine the rest.`
    );
    setQuestion("");
  }

  return (
    <>
      <Navbar title="AI Coach" subtitle="Personalized insights from your last 90 days" />
      <div className="px-6 sm:px-8 pt-7 pb-12 flex flex-col gap-5">
        <div className="bg-gradient-to-br from-primary/14 to-primary/[0.02] border border-primary/25 rounded-4xl p-6.5 flex gap-4.5 items-start">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Bot size={20} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="text-[15px] font-bold">Weekly AI Review</div>
            <div className="text-[13px] text-text-body mt-2 leading-relaxed">
              Your win rate {winRateDelta >= 0 ? "improved" : "declined"} {Math.abs(winRateDelta).toFixed(0)}%
              this week compared to the previous week, driven largely by trades on{" "}
              <b>{topStrategyByPnl}</b> setups.{" "}
              {worstEmotion &&
                `Trades logged while feeling "${worstEmotion.emotion}" show the weakest win rate at ${worstEmotion.winRate.toFixed(
                  0
                )}% — that's worth a closer look.`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3.5 shadow-card">
            <div className="text-[15px] font-bold">Mistakes Detected</div>
            <div className="flex flex-col gap-2.5">
              {mistakes.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-surface border border-border"
                >
                  <span className="text-[13px]">{m.label}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: m.count > 10 ? "#F87171" : "#F59E0B" }}
                  >
                    {m.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3.5 shadow-card">
            <div className="text-[15px] font-bold">Trading Psychology</div>
            <div className="flex flex-col gap-3">
              {psychology.map((p) => (
                <div key={p.emotion}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span>{p.emotion}</span>
                    <span
                      className="font-bold"
                      style={{ color: p.winRate >= 55 ? "#4ADE80" : "#F87171" }}
                    >
                      {p.winRate.toFixed(0)}% win rate
                    </span>
                  </div>
                  <div className="h-1.5 rounded bg-border overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${p.winRate}%`,
                        background: p.winRate >= 55 ? "#22C55E" : "#EF4444",
                      }}
                    />
                  </div>
                </div>
              ))}
              {psychology.length === 0 && <div className="text-sm text-text-secondary">No data yet.</div>}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-4xl p-6 flex flex-col gap-3.5 shadow-card">
          <div className="text-[15px] font-bold">Recommendations</div>
          <div className="flex flex-col gap-2.5">
            {worstEmotion && (
              <div className="flex gap-3 items-start px-3.5 py-3.5 rounded-2xl bg-surface border border-border">
                <Check size={16} strokeWidth={2.5} className="text-success-bright shrink-0 mt-0.5" />
                <span className="text-[13px] text-text-body">
                  Avoid entering trades while feeling &quot;{worstEmotion.emotion}&quot; — your win rate drops to{" "}
                  {worstEmotion.winRate.toFixed(0)}% in that state.
                </span>
              </div>
            )}
            <div className="flex gap-3 items-start px-3.5 py-3.5 rounded-2xl bg-surface border border-border">
              <Check size={16} strokeWidth={2.5} className="text-success-bright shrink-0 mt-0.5" />
              <span className="text-[13px] text-text-body">Set a hard rule: never adjust stop loss once a trade is live.</span>
            </div>
            <div className="flex gap-3 items-start px-3.5 py-3.5 rounded-2xl bg-surface border border-border">
              <Check size={16} strokeWidth={2.5} className="text-success-bright shrink-0 mt-0.5" />
              <span className="text-[13px] text-text-body">
                Double down on <b>{topStrategyByPnl}</b> — it&apos;s your highest expectancy strategy right now.
              </span>
            </div>
          </div>
        </div>

        {answer && (
          <div className="bg-primary/10 border border-primary/25 rounded-3xl p-5 text-[13px] text-text-body leading-relaxed">
            {answer}
          </div>
        )}

        <div className="flex items-center gap-3.5 bg-surface border border-border rounded-3xl px-4.5 py-3.5">
          <div className="w-9 h-9 rounded-[10px] bg-border flex items-center justify-center shrink-0">
            <Search size={16} className="text-text-secondary" strokeWidth={2} />
          </div>
          <input
            className="bg-transparent outline-none text-[13px] text-white placeholder:text-text-muted flex-1 font-sans"
            placeholder='Ask AI Coach about your trades, e.g. "Why did I lose on XAU/USD this week?"'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askCoach()}
          />
          <button
            onClick={askCoach}
            className="px-4 py-2.5 rounded-xl bg-primary text-[13px] font-semibold cursor-pointer hover:bg-primary-dark transition-colors"
          >
            Ask
          </button>
        </div>
      </div>
    </>
  );
}
