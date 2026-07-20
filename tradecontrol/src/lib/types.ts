import type { Locale } from "./i18n/types";

export type Direction = "BUY" | "SELL";

export type Emotion =
  | "Confident"
  | "Calm"
  | "Focused"
  | "Anxious"
  | "Impatient";

export interface Trade {
  id: string;
  broker: string;
  account: string;
  market: string;
  pair: string; // short tile label e.g. "EU"
  pairFull: string; // e.g. "EUR/USD"
  direction: Direction;
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  riskPercent: number;
  lotSize: number;
  rr: number;
  commission: number;
  strategy: string;
  emotion: Emotion;
  notes: string;
  screenshotName?: string;
  pnl: number;
  pips: string;
  date: string; // ISO datetime
}

export type NewTradeInput = Omit<Trade, "id">;

export interface Strategy {
  id: string;
  name: string;
  emoji: string;
  iconBg: string;
  description: string;
}

export type GoalPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface Goals {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface NotificationSettings {
  tradeReminders: boolean;
  weeklyAiReport: boolean;
  goalAchievements: boolean;
}

export interface Settings {
  theme: "dark";
  language: Locale;
  timezone: string;
  notifications: NotificationSettings;
}

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
  joined: string;
}

export interface AuthState {
  loggedIn: boolean;
  user: AuthUser | null;
}

export interface JournalFilters {
  search: string;
  pair: string;
  strategy: string;
  dateRange: "all" | "7d" | "30d" | "90d";
  sort: "newest" | "oldest";
}
