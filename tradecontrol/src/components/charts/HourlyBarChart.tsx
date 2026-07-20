"use client";

import React from "react";
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface HourBucket {
  hour: number;
  pnl: number;
  count: number;
}

export function HourlyBarChart({ data }: { data: HourBucket[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap={4}>
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,.04)" }}
          contentStyle={{
            background: "#0F172A",
            border: "1px solid #1F2937",
            borderRadius: 12,
            fontSize: 12,
            color: "#fff",
          }}
          formatter={(value) => [`$${Number(value).toFixed(0)}`, "P/L"]}
          labelFormatter={(_, payload) => (payload?.[0] ? `${payload[0].payload.hour}:00` : "")}
        />
        <Bar dataKey={(d: HourBucket) => Math.max(Math.abs(d.pnl), max * 0.06)} radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.pnl > max * 0.15 ? "#2563EB" : "#1F2937"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
