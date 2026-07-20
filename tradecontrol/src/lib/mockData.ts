import { Direction, Emotion, Strategy, Trade } from "./types";
import type { Locale } from "./i18n/types";

// Simple deterministic LCG PRNG, same family as the design prototype scripts.
export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const INSTRUMENTS: { pair: string; pairFull: string; market: string; pip: number; basePrice: number }[] = [
  { pair: "EU", pairFull: "EUR/USD", market: "Forex", pip: 0.0001, basePrice: 1.085 },
  { pair: "XAU", pairFull: "XAU/USD", market: "Gold", pip: 0.1, basePrice: 2410 },
  { pair: "GU", pairFull: "GBP/USD", market: "Forex", pip: 0.0001, basePrice: 1.271 },
  { pair: "US30", pairFull: "US30", market: "Indices", pip: 1, basePrice: 39800 },
  { pair: "BTC", pairFull: "BTC/USD", market: "Crypto", pip: 1, basePrice: 64500 },
  { pair: "NQ", pairFull: "NASDAQ 100", market: "Indices", pip: 1, basePrice: 19300 },
];

export const STRATEGY_DEFS: Strategy[] = [
  {
    id: "breakout-momentum",
    name: "Breakout Momentum",
    emoji: "⚡",
    iconBg: "rgba(37,99,235,.15)",
    description: "Enter on confirmed breakout of key levels with volume confirmation.",
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    emoji: "↩️",
    iconBg: "rgba(34,197,94,.15)",
    description: "Fade extreme moves back toward the mean on oversold/overbought signals.",
  },
  {
    id: "news-scalping",
    name: "News Scalping",
    emoji: "📰",
    iconBg: "rgba(245,158,11,.15)",
    description: "Fast entries around high-impact news releases, tight stops.",
  },
  {
    id: "trend-continuation",
    name: "Trend Continuation",
    emoji: "📈",
    iconBg: "rgba(239,68,68,.15)",
    description: "Ride established trends on pullback entries at moving averages.",
  },
];

const EMOTIONS: Emotion[] = ["Confident", "Calm", "Focused", "Anxious", "Impatient"];
const ACCOUNTS = [
  { broker: "FTMO", account: "100K Challenge" },
  { broker: "Personal", account: "Personal" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function fmtPrice(v: number, pip: number) {
  const decimals = pip >= 1 ? 0 : pip >= 0.1 ? 1 : 4;
  return v.toFixed(decimals);
}

/** Generates a deterministic but realistic set of historical trades. */
export function generateMockTrades(count = 140, seed = 42, endDate = new Date()): Trade[] {
  const rnd = seededRandom(seed);
  const trades: Trade[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rnd() * 270); // spread over ~9 months
    const date = new Date(endDate);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(rnd() * 24), Math.floor(rnd() * 60), 0, 0);

    const inst = INSTRUMENTS[Math.floor(rnd() * INSTRUMENTS.length)];
    const strategy = STRATEGY_DEFS[Math.floor(rnd() * STRATEGY_DEFS.length)];
    const emotion = EMOTIONS[Math.floor(rnd() * EMOTIONS.length)];
    const acct = ACCOUNTS[Math.floor(rnd() * ACCOUNTS.length)];
    const direction: Direction = rnd() > 0.48 ? "BUY" : "SELL";

    // Win probability skewed by emotion for the AI-coach psychology view
    const winBias =
      emotion === "Confident" ? 0.78 : emotion === "Calm" || emotion === "Focused" ? 0.72 : emotion === "Anxious" ? 0.38 : 0.34;
    const isWin = rnd() < winBias;

    const riskPercent = +(0.5 + rnd() * 2.5).toFixed(1);
    const rr = isWin ? +(1 + rnd() * 2.5).toFixed(1) : +(0.3 + rnd() * 0.9).toFixed(1);
    const entry = inst.basePrice * (1 + (rnd() - 0.5) * 0.01);
    const slDist = entry * (0.002 + rnd() * 0.004) * (inst.market === "Crypto" ? 3 : 1);
    const sl = direction === "BUY" ? entry - slDist : entry + slDist;
    const tpDist = slDist * rr;
    const tp = direction === "BUY" ? entry + tpDist : entry - tpDist;
    const exit = isWin ? tp : sl;

    const accountSize = 10000 + (acct.broker === "FTMO" ? 90000 : 0);
    const riskDollars = accountSize * (riskPercent / 100);
    const pnl = isWin ? +(riskDollars * rr).toFixed(2) : -+riskDollars.toFixed(2);
    const commission = +(1.5 + rnd() * 3.5).toFixed(2);

    const pipsMoved = Math.abs(exit - entry) / inst.pip;
    const pips =
      inst.market === "Crypto"
        ? `${isWin ? "+" : "-"}${(pipsMoved / inst.basePrice * 100).toFixed(1)}%`
        : `${isWin ? "+" : "-"}${pipsMoved.toFixed(0)} ${inst.market === "Indices" ? "pts" : "pips"}`;

    trades.push({
      id: `t_${seed}_${i}_${date.getTime()}`,
      broker: acct.broker,
      account: acct.account,
      market: inst.market,
      pair: inst.pair,
      pairFull: inst.pairFull,
      direction,
      entry: +fmtPrice(entry, inst.pip),
      exit: +fmtPrice(exit, inst.pip),
      sl: +fmtPrice(sl, inst.pip),
      tp: +fmtPrice(tp, inst.pip),
      riskPercent,
      lotSize: +(0.1 + rnd() * 1.2).toFixed(2),
      rr,
      commission,
      strategy: strategy.name,
      emotion,
      notes: "",
      pnl,
      pips,
      date: date.toISOString(),
    });
  }

  return trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const STARTING_BALANCE = 10000;

export function defaultDate(y: number, m: number, d: number, h = 12, min = 0) {
  return new Date(y, m, d, h, min).toISOString();
}

const MONTHS_SHORT: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
  ru: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
};

const AGO_UNITS: Record<Locale, { m: string; h: string; d: string }> = {
  en: { m: "m ago", h: "h ago", d: "d ago" },
  uz: { m: "daq. oldin", h: "soat oldin", d: "kun oldin" },
  ru: { m: "мин. назад", h: "ч. назад", d: "дн. назад" },
};

export function formatDateTime(iso: string, locale: Locale = "en") {
  const d = new Date(iso);
  const months = MONTHS_SHORT[locale];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function timeAgo(iso: string, now = new Date(), locale: Locale = "en") {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const units = AGO_UNITS[locale];
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}${units.m}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${units.h}`;
  const days = Math.floor(hours / 24);
  return `${days}${units.d}`;
}
