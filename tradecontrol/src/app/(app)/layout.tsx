"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/store";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, auth } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !auth.loggedIn) {
      router.replace("/login");
    }
  }, [hydrated, auth.loggedIn, router]);

  if (!hydrated || !auth.loggedIn) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-[3px] border-border border-t-primary animate-spin" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
