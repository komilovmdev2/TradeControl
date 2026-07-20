"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  AuthState,
  AuthUser,
  Goals,
  NewTradeInput,
  Settings,
  Strategy,
  Trade,
} from "./types";
import { generateMockTrades, STRATEGY_DEFS } from "./mockData";

const LS_KEYS = {
  trades: "tc_trades",
  goals: "tc_goals",
  strategies: "tc_strategies",
  settings: "tc_settings",
  auth: "tc_auth",
} as const;

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — silently ignore for MVP
  }
}

const DEFAULT_GOALS: Goals = { daily: 200, weekly: 1000, monthly: 4000, yearly: 30000 };

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  language: "en",
  timezone: "UTC+05:00 Tashkent",
  notifications: {
    tradeReminders: true,
    weeklyAiReport: true,
    goalAchievements: false,
  },
};

const DEFAULT_AUTH: AuthState = {
  loggedIn: false,
  user: null,
};

interface AppContextValue {
  hydrated: boolean;

  trades: Trade[];
  addTrade: (input: NewTradeInput) => Trade;
  updateTrade: (id: string, patch: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;

  goals: Goals;
  setGoal: (period: keyof Goals, value: number) => void;

  strategies: Strategy[];
  addStrategy: (s: Omit<Strategy, "id">) => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  toggleNotification: (key: keyof Settings["notifications"]) => void;

  auth: AuthState;
  login: (email: string) => void;
  register: (user: Omit<AuthUser, "plan" | "joined">) => void;
  logout: () => void;

  isAddTradeOpen: boolean;
  openAddTrade: () => void;
  closeAddTrade: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);
  const [strategies, setStrategies] = useState<Strategy[]>(STRATEGY_DEFS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [auth, setAuth] = useState<AuthState>(DEFAULT_AUTH);
  const [isAddTradeOpen, setAddTradeOpen] = useState(false);

  // Hydrate from localStorage on mount (client-only).
  // This one-time hydration effect intentionally sets state directly — it's the standard
  // SSR-safe pattern for reading localStorage only after mount to avoid hydration mismatches.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const seededTrades = generateMockTrades(140, 42);
    setTrades(readLS(LS_KEYS.trades, seededTrades));
    setGoals(readLS(LS_KEYS.goals, DEFAULT_GOALS));
    setStrategies(readLS(LS_KEYS.strategies, STRATEGY_DEFS));
    setSettings(readLS(LS_KEYS.settings, DEFAULT_SETTINGS));
    setAuth(
      readLS(LS_KEYS.auth, {
        loggedIn: true,
        user: {
          firstName: "Diyorbek",
          lastName: "Karimov",
          email: "diyorbek@tradecontrol.app",
          plan: "Pro Plan",
          joined: "2025-02-01T00:00:00.000Z",
        },
      })
    );
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (hydrated) writeLS(LS_KEYS.trades, trades);
  }, [trades, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(LS_KEYS.goals, goals);
  }, [goals, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(LS_KEYS.strategies, strategies);
  }, [strategies, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(LS_KEYS.settings, settings);
    if (hydrated) document.documentElement.lang = settings.language;
  }, [settings, hydrated]);
  useEffect(() => {
    if (hydrated) writeLS(LS_KEYS.auth, auth);
  }, [auth, hydrated]);

  const addTrade = useCallback((input: NewTradeInput) => {
    const trade: Trade = { ...input, id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` };
    setTrades((prev) => [trade, ...prev]);
    return trade;
  }, []);

  const updateTrade = useCallback((id: string, patch: Partial<Trade>) => {
    setTrades((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setGoal = useCallback((period: keyof Goals, value: number) => {
    setGoals((prev) => ({ ...prev, [period]: value }));
  }, []);

  const addStrategy = useCallback((s: Omit<Strategy, "id">) => {
    setStrategies((prev) => [...prev, { ...s, id: `s_${Date.now()}` }]);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleNotification = useCallback((key: keyof Settings["notifications"]) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  }, []);

  const login = useCallback((email: string) => {
    setAuth({
      loggedIn: true,
      user: {
        firstName: "Diyorbek",
        lastName: "Karimov",
        email,
        plan: "Pro Plan",
        joined: "2025-02-01T00:00:00.000Z",
      },
    });
  }, []);

  const register = useCallback((user: Omit<AuthUser, "plan" | "joined">) => {
    setAuth({
      loggedIn: true,
      user: { ...user, plan: "Starter Plan", joined: new Date().toISOString() },
    });
  }, []);

  const logout = useCallback(() => {
    setAuth({ loggedIn: false, user: null });
  }, []);

  const openAddTrade = useCallback(() => setAddTradeOpen(true), []);
  const closeAddTrade = useCallback(() => setAddTradeOpen(false), []);

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      trades,
      addTrade,
      updateTrade,
      deleteTrade,
      goals,
      setGoal,
      strategies,
      addStrategy,
      settings,
      updateSettings,
      toggleNotification,
      auth,
      login,
      register,
      logout,
      isAddTradeOpen,
      openAddTrade,
      closeAddTrade,
    }),
    [
      hydrated,
      trades,
      addTrade,
      updateTrade,
      deleteTrade,
      goals,
      setGoal,
      strategies,
      addStrategy,
      settings,
      updateSettings,
      toggleNotification,
      auth,
      login,
      register,
      logout,
      isAddTradeOpen,
      openAddTrade,
      closeAddTrade,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
