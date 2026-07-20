"use client";

import React from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from "recharts";

interface Point {
  label: string;
  balance: number;
}

export function EquityCurveChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
        <Tooltip
          contentStyle={{
            background: "#0F172A",
            border: "1px solid #1F2937",
            borderRadius: 12,
            fontSize: 12,
            color: "#fff",
          }}
          labelFormatter={() => ""}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Balance"]}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#2563EB"
          strokeWidth={2.5}
          fill="url(#eqGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#020817", stroke: "#2563EB", strokeWidth: 2.5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
