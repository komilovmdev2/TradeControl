"use client";

import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-glow hover:bg-primary-dark",
  secondary: "bg-card border border-border text-white hover:border-text-muted",
  ghost: "bg-transparent text-text-secondary hover:text-white",
  danger: "bg-danger/15 text-danger-bright border border-danger/30 hover:bg-danger/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-2 rounded-xl gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-sm px-6 py-3.5 rounded-2xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
