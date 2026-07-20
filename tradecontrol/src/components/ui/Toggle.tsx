"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="relative w-[42px] h-6 rounded-xl transition-colors cursor-pointer"
      style={{ background: checked ? "#2563EB" : "#1F2937" }}
    >
      <span
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all"
        style={{
          background: checked ? "#FFFFFF" : "#64748B",
          left: checked ? "21px" : "3px",
        }}
      />
    </button>
  );
}
