"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  Calendar,
  Clock,
  Sparkles,
  Target,
  FileText,
  Bot,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { nav as navDict } from "@/lib/i18n/namespaces/nav";

interface NavItem {
  labelKey: keyof (typeof navDict)["en"];
  href: string;
  icon: LucideIcon;
}

const MAIN: NavItem[] = [
  { labelKey: "navDashboard", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "navJournal", href: "/journal", icon: BookOpen },
  { labelKey: "navAnalytics", href: "/analytics", icon: LineChart },
  { labelKey: "navCalendar", href: "/calendar", icon: Calendar },
  { labelKey: "navRiskCalculator", href: "/risk-calculator", icon: Clock },
];

const GROWTH: NavItem[] = [
  { labelKey: "navStrategies", href: "/strategies", icon: Sparkles },
  { labelKey: "navGoals", href: "/goals", icon: Target },
  { labelKey: "navReports", href: "/reports", icon: FileText },
  { labelKey: "navAiCoach", href: "/ai-coach", icon: Bot },
];

const ACCOUNT: NavItem[] = [{ labelKey: "navSettings", href: "/settings", icon: SettingsIcon }];

function NavRow({ item, active, t }: { item: NavItem; active: boolean; t: (typeof navDict)["en"] }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
      style={{
        background: active ? "rgba(37,99,235,.12)" : "transparent",
        color: active ? "#FFFFFF" : "#94A3B8",
        fontWeight: active ? 600 : 500,
      }}
    >
      <Icon size={18} strokeWidth={2} className={active ? "" : ""} color={active ? "#60A5FA" : "currentColor"} />
      {t[item.labelKey]}
    </Link>
  );
}

function NavGroup({ title, items, pathname, t }: { title: string; items: NavItem[]; pathname: string; t: (typeof navDict)["en"] }) {
  return (
    <>
      <div className="text-[11px] font-semibold tracking-wider text-text-muted px-3 pt-4 pb-1.5 uppercase">
        {title}
      </div>
      {items.map((item) => (
        <NavRow key={item.href} item={item} active={pathname === item.href} t={t} />
      ))}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { auth } = useApp();
  const t = useTranslation(navDict);
  const initials = auth.user ? `${auth.user.firstName[0]}${auth.user.lastName[0]}` : "DK";
  const displayName = auth.user ? `${auth.user.firstName} ${auth.user.lastName[0]}.` : "Diyorbek K.";

  return (
    <div className="w-[280px] shrink-0 bg-surface border-r border-border flex flex-col p-4 sticky top-0 h-screen">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 pt-2 pb-7">
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 12L6 7L9 10L14 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-base font-bold tracking-tight text-white">TradeControl</span>
      </Link>

      <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
        <NavGroup title={t.groupMain} items={MAIN} pathname={pathname} t={t} />
        <NavGroup title={t.groupGrowth} items={GROWTH} pathname={pathname} t={t} />
        <NavGroup title={t.groupAccount} items={ACCOUNT} pathname={pathname} t={t} />
      </div>

      <Link
        href="/profile"
        className="flex items-center gap-2.5 p-3 rounded-2xl border border-border mt-2 transition-colors"
        style={{ background: pathname === "/profile" ? "rgba(37,99,235,.12)" : "#111827" }}
      >
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[13px] font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
            {displayName}
          </div>
          <div className="text-[11px] text-text-secondary">{auth.user?.plan ?? "Pro Plan"}</div>
        </div>
      </Link>
    </div>
  );
}
