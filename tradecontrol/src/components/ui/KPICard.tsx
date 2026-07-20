import React from "react";

interface KPICardProps {
  label: string;
  value: string;
  tag?: string;
  tagBg?: string;
  tagColor?: string;
  valueColor?: string;
}

export function KPICard({ label, value, tag, tagBg, tagColor, valueColor }: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-4xl p-5 flex flex-col gap-2.5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary font-medium">{label}</span>
        {tag && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
            style={{ background: tagBg, color: tagColor }}
          >
            {tag}
          </span>
        )}
      </div>
      <div className="text-2xl font-extrabold tracking-tight" style={{ color: valueColor ?? "#FFFFFF" }}>
        {value}
      </div>
    </div>
  );
}
