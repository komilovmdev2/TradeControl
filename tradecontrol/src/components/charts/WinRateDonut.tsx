"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function WinRateDonut({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses;
  const winRate = total ? (wins / total) * 100 : 0;
  const data = [
    { name: "Wins", value: wins || 0.0001 },
    { name: "Losses", value: losses || 0.0001 },
  ];

  return (
    <div className="relative flex items-center justify-center py-3">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={68}
            outerRadius={82}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill="#22C55E" />
            <Cell fill="#1F2937" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{winRate.toFixed(1)}%</span>
      </div>
    </div>
  );
}
