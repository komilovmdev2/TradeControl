import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  bg: string;
  color: string;
  className?: string;
}

export function Badge({ children, bg, color, className }: BadgeProps) {
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${className ?? ""}`}
      style={{ background: bg, color }}
    >
      {children}
    </span>
  );
}

export const directionColors = {
  BUY: { bg: "rgba(34,197,94,.15)", color: "#4ADE80" },
  SELL: { bg: "rgba(239,68,68,.15)", color: "#F87171" },
};
