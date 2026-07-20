"use client";

import React from "react";
import { heatColor } from "@/lib/calculations";

interface HeatCell {
  pnl: number | null;
  label: string;
}

export function CalendarHeatmap({
  weeks,
  cellSize = 13,
  maxAbs,
}: {
  weeks: HeatCell[][];
  cellSize?: number;
  maxAbs: number;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => (
            <div
              key={di}
              title={day.label}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 3,
                background: heatColor(day.pnl, maxAbs),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
