import { Trade } from "./types";
import { STARTING_BALANCE } from "./mockData";
import type { Locale } from "./i18n/types";

const MONTH_NAMES: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
  ru: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
};

const MISTAKE_LABELS: Record<Locale, string[]> = {
  en: ["Moving stop loss after entry", "Trading outside defined session hours", "Oversized position on revenge trades"],
  uz: ["Kirishdan keyin stop lossni ko'chirish", "Belgilangan sessiya soatlaridan tashqarida savdo qilish", "Qasos savdolarida haddan tashqari katta pozitsiya"],
  ru: ["Перемещение стоп-лосса после входа", "Торговля вне установленных часов сессии", "Завышенный объём позиции на «отыгрышных» сделках"],
};

export function sortByDateAsc(trades: Trade[]) {
  return [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function totalPnl(trades: Trade[]) {
  return trades.reduce((sum, t) => sum + t.pnl, 0);
}

export function totalBalance(trades: Trade[]) {
  return STARTING_BALANCE + totalPnl(trades);
}

function isWithinDays(iso: string, days: number, now: Date) {
  const diff = (now.getTime() - new Date(iso).getTime()) / 86400000;
  return diff >= 0 && diff < days;
}

function isSameDay(iso: string, now: Date) {
  const d = new Date(iso);
  return d.toDateString() === now.toDateString();
}

export interface DashboardKpis {
  totalBalance: number;
  todayPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  winRate: number;
  profitFactor: number;
  avgRR: number;
  maxDrawdownPct: number;
  growthPct: number;
}

export function computeKpis(trades: Trade[], now = new Date()): DashboardKpis {
  const balance = totalBalance(trades);
  const todayPnl = trades.filter((t) => isSameDay(t.date, now)).reduce((s, t) => s + t.pnl, 0);
  const weeklyPnl = trades.filter((t) => isWithinDays(t.date, 7, now)).reduce((s, t) => s + t.pnl, 0);
  const monthlyPnl = trades.filter((t) => isWithinDays(t.date, 30, now)).reduce((s, t) => s + t.pnl, 0);

  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const winRate = trades.length ? (wins.length / trades.length) * 100 : 0;

  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;

  const avgRR = trades.length ? trades.reduce((s, t) => s + t.rr, 0) / trades.length : 0;

  const { maxDrawdownPct } = computeEquityCurve(trades);
  const growthPct = ((balance - STARTING_BALANCE) / STARTING_BALANCE) * 100;

  return {
    totalBalance: balance,
    todayPnl,
    weeklyPnl,
    monthlyPnl,
    winRate,
    profitFactor,
    avgRR,
    maxDrawdownPct,
    growthPct,
  };
}

export interface EquityPoint {
  date: string;
  balance: number;
}

export function computeEquityCurve(trades: Trade[]) {
  const sorted = sortByDateAsc(trades);
  let balance = STARTING_BALANCE;
  let peak = STARTING_BALANCE;
  let maxDrawdownPct = 0;
  const points: EquityPoint[] = [{ date: "start", balance }];

  for (const t of sorted) {
    balance += t.pnl;
    peak = Math.max(peak, balance);
    const dd = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
    maxDrawdownPct = Math.max(maxDrawdownPct, dd);
    points.push({ date: t.date, balance: +balance.toFixed(2) });
  }

  return { points, maxDrawdownPct: -maxDrawdownPct };
}

export function equityCurveLastNDays(trades: Trade[], days: number, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  const sorted = sortByDateAsc(trades);
  let balance =
    STARTING_BALANCE + sorted.filter((t) => new Date(t.date) < cutoff).reduce((s, t) => s + t.pnl, 0);

  const points: { label: string; balance: number }[] = [{ label: "start", balance: +balance.toFixed(2) }];
  for (const t of sorted.filter((t) => new Date(t.date) >= cutoff)) {
    balance += t.pnl;
    points.push({ label: t.date, balance: +balance.toFixed(2) });
  }
  return points;
}

export interface DayPnl {
  date: Date;
  pnl: number;
  count: number;
}

export function dailyPnlMap(trades: Trade[]) {
  const map = new Map<string, DayPnl>();
  for (const t of trades) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const existing = map.get(key);
    if (existing) {
      existing.pnl += t.pnl;
      existing.count += 1;
    } else {
      map.set(key, { date: new Date(d.getFullYear(), d.getMonth(), d.getDate()), pnl: t.pnl, count: 1 });
    }
  }
  return map;
}

export function heatColor(pnl: number | null, maxAbs: number) {
  if (pnl === null) return "#1F2937";
  if (maxAbs <= 0) return "#1F2937";
  const ratio = pnl / maxAbs;
  if (ratio > 0.5) return "#22C55E";
  if (ratio > 0) return "#14532D";
  if (ratio > -0.5) return "#7F1D1D";
  return "#450A0A";
}

export function performanceByPair(trades: Trade[]) {
  const map = new Map<string, { pairFull: string; pnl: number; count: number }>();
  for (const t of trades) {
    const existing = map.get(t.pairFull);
    if (existing) {
      existing.pnl += t.pnl;
      existing.count += 1;
    } else {
      map.set(t.pairFull, { pairFull: t.pairFull, pnl: t.pnl, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.pnl - a.pnl);
}

export function performanceByHour(trades: Trade[]) {
  const buckets: { hour: number; pnl: number; count: number }[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    pnl: 0,
    count: 0,
  }));
  for (const t of trades) {
    const h = new Date(t.date).getHours();
    buckets[h].pnl += t.pnl;
    buckets[h].count += 1;
  }
  return buckets;
}

export function winRateByEmotion(trades: Trade[]) {
  const map = new Map<string, { wins: number; total: number }>();
  for (const t of trades) {
    const existing = map.get(t.emotion) ?? { wins: 0, total: 0 };
    existing.total += 1;
    if (t.pnl > 0) existing.wins += 1;
    map.set(t.emotion, existing);
  }
  return [...map.entries()].map(([emotion, v]) => ({
    emotion,
    winRate: v.total ? (v.wins / v.total) * 100 : 0,
    total: v.total,
  }));
}

export function strategyStats(trades: Trade[], strategyName: string) {
  const list = trades.filter((t) => t.strategy === strategyName);
  const wins = list.filter((t) => t.pnl > 0);
  const losses = list.filter((t) => t.pnl <= 0);
  const winRate = list.length ? (wins.length / list.length) * 100 : 0;
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;
  const avgRR = list.length ? list.reduce((s, t) => s + t.rr, 0) / list.length : 0;
  const netPnl = list.reduce((s, t) => s + t.pnl, 0);
  return { trades: list.length, winRate, profitFactor, avgRR, netPnl };
}

export function commonMistakes(trades: Trade[], locale: Locale = "en") {
  // Heuristic pattern detection over notes/emotion/RR fields, purely derived from real data.
  const stopMoved = trades.filter((t) => t.emotion === "Anxious" && t.pnl < 0).length;
  const outsideHours = trades.filter((t) => {
    const h = new Date(t.date).getHours();
    return (h < 6 || h > 20) && t.pnl < 0;
  }).length;
  const oversized = trades.filter((t) => t.riskPercent > 2.2 && t.pnl < 0).length;
  const [moveStop, outside, oversize] = MISTAKE_LABELS[locale];
  return [
    { label: moveStop, count: stopMoved },
    { label: outside, count: outsideHours },
    { label: oversize, count: oversized },
  ].sort((a, b) => b.count - a.count);
}

export function monthlyBreakdown(trades: Trade[], locale: Locale = "en") {
  const map = new Map<string, { label: string; pnl: number; count: number; year: number; month: number }>();
  for (const t of trades) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const months = MONTH_NAMES[locale];
    const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
    const existing = map.get(key);
    if (existing) {
      existing.pnl += t.pnl;
      existing.count += 1;
    } else {
      map.set(key, { label, pnl: t.pnl, count: 1, year: d.getFullYear(), month: d.getMonth() });
    }
  }
  return [...map.values()].sort((a, b) => (a.year - b.year) || (a.month - b.month)).reverse();
}

export function bestWorstDay(trades: Trade[]) {
  const map = dailyPnlMap(trades);
  const entries = [...map.values()];
  if (!entries.length) return { best: null as DayPnl | null, worst: null as DayPnl | null, green: 0, red: 0 };
  const best = entries.reduce((a, b) => (b.pnl > a.pnl ? b : a));
  const worst = entries.reduce((a, b) => (b.pnl < a.pnl ? b : a));
  const green = entries.filter((e) => e.pnl > 0).length;
  const red = entries.filter((e) => e.pnl < 0).length;
  return { best, worst, green, red };
}
