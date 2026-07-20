"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { AddTradeModal } from "../AddTradeModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-white">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
      <AddTradeModal />
    </div>
  );
}
