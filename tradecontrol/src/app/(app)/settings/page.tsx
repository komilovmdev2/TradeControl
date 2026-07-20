"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Toggle } from "@/components/ui/Toggle";
import { useApp } from "@/lib/store";
import { useTranslation, tf } from "@/lib/i18n";
import { LOCALES, LANGUAGE_LABELS, type Locale } from "@/lib/i18n/types";
import { settings as settingsDict } from "@/lib/i18n/namespaces/settings";

export default function SettingsPage() {
  const { settings, updateSettings, toggleNotification, auth } = useApp();
  const t = useTranslation(settingsDict);
  const SUBNAV = [
    t.subnavGeneral,
    t.subnavBrokerAccounts,
    t.subnavNotifications,
    t.subnavSubscription,
    t.subnavSecurity,
    t.subnavApiKeys,
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <>
      <Navbar title={t.title} subtitle={t.subtitle} />
      <div className="px-6 sm:px-8 pt-7 pb-12 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto">
          {SUBNAV.map((item, index) => (
            <button
              key={item}
              onClick={() => setActiveIndex(index)}
              className="text-left px-3.5 py-2.5 rounded-xl text-sm whitespace-nowrap cursor-pointer transition-colors"
              style={{
                background: activeIndex === index ? "rgba(37,99,235,.12)" : "transparent",
                color: activeIndex === index ? "#FFFFFF" : "#94A3B8",
                fontWeight: activeIndex === index ? 600 : 500,
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5 max-w-[680px]">
          <div className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-5">
            <div className="text-[15px] font-bold">{t.appearance}</div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-sm font-semibold">{t.theme}</div>
                <div className="text-xs text-text-secondary mt-0.5">{t.themeDescription}</div>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-[10px] bg-primary/15 text-primary-light text-[13px] font-bold">{t.themeDark}</div>
                <div className="px-4 py-2 rounded-[10px] bg-surface border border-border text-text-muted text-[13px] font-semibold">
                  {t.themeLightSoon}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-2">
              <div>
                <div className="text-sm font-semibold">{t.language}</div>
                <div className="text-xs text-text-secondary mt-0.5">{t.languageDescription}</div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-surface border border-border text-[13px] font-semibold cursor-pointer hover:border-text-muted transition-colors"
                >
                  {LANGUAGE_LABELS[settings.language]}
                  <ChevronDown size={14} strokeWidth={2.5} className={langOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                    <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-[180px] bg-card border border-border rounded-xl p-1.5 shadow-modal">
                      {LOCALES.map((loc: Locale) => (
                        <button
                          key={loc}
                          onClick={() => {
                            updateSettings({ language: loc });
                            setLangOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors"
                          style={{
                            background: settings.language === loc ? "rgba(37,99,235,.12)" : "transparent",
                            color: settings.language === loc ? "#FFFFFF" : "#94A3B8",
                          }}
                        >
                          {LANGUAGE_LABELS[loc]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-2">
              <div>
                <div className="text-sm font-semibold">{t.timezone}</div>
                <div className="text-xs text-text-secondary mt-0.5">{t.timezoneDescription}</div>
              </div>
              <div className="px-4 py-2 rounded-[10px] bg-surface border border-border text-[13px] font-semibold">
                {settings.timezone}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-4xl p-6.5 flex flex-col gap-4.5">
            <div className="text-[15px] font-bold">{t.notifications}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t.tradeReminders}</span>
              <Toggle checked={settings.notifications.tradeReminders} onChange={() => toggleNotification("tradeReminders")} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t.weeklyAiReport}</span>
              <Toggle checked={settings.notifications.weeklyAiReport} onChange={() => toggleNotification("weeklyAiReport")} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t.goalAchievements}</span>
              <Toggle checked={settings.notifications.goalAchievements} onChange={() => toggleNotification("goalAchievements")} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-4xl p-6.5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[15px] font-bold">{auth.user?.plan ?? "Pro Plan"}</div>
              <div className="text-[13px] text-text-secondary mt-1">{tf(t.renewsOn, { date: "Aug 19, 2026", price: "$29" })}</div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-border text-[13px] font-semibold cursor-pointer hover:bg-text-muted/40 transition-colors">
              {t.manageSubscription}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
