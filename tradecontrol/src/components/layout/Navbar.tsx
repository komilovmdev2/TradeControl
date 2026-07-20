"use client";

import React from "react";
import { Search, Bell, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { nav } from "@/lib/i18n/namespaces/nav";

interface NavbarProps {
  title: string;
  subtitle?: string;
  showAddTrade?: boolean;
  showSearch?: boolean;
  right?: React.ReactNode;
}

export function Navbar({ title, subtitle, showAddTrade = false, showSearch = false, right }: NavbarProps) {
  const { openAddTrade } = useApp();
  const t = useTranslation(nav);

  return (
    <div className="h-20 shrink-0 flex items-center justify-between px-8 border-b border-border sticky top-0 bg-[rgba(2,8,23,.85)] backdrop-blur-md z-10">
      <div>
        <div className="text-xl font-bold tracking-tight">{title}</div>
        {subtitle && <div className="text-[13px] text-text-secondary">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5 w-[260px]">
            <Search size={16} className="text-text-muted" strokeWidth={2} />
            <span className="text-[13px] text-text-muted">{t.searchPlaceholder}</span>
          </div>
        )}
        {right}
        <button
          aria-label={t.notifications}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center relative cursor-pointer hover:border-text-muted transition-colors"
        >
          <Bell size={18} className="text-text-secondary" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger border-2 border-bg" />
        </button>
        {showAddTrade && (
          <button
            onClick={openAddTrade}
            className="flex items-center gap-2 bg-primary rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer shadow-glow hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            {t.addTrade}
          </button>
        )}
      </div>
    </div>
  );
}
