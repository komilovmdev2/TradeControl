"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/lib/store";

export default function AddTradeRoutePage() {
  const { openAddTrade } = useApp();
  const router = useRouter();

  useEffect(() => {
    openAddTrade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar title="Add Trade" subtitle="Log a new trade to your journal" />
      <div className="px-8 py-16 flex flex-col items-center gap-4 text-center">
        <p className="text-text-secondary text-sm max-w-sm">
          The Add Trade form is open above. Closing it will return you to the dashboard.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-primary-light text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}
