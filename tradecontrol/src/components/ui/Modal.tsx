"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, subtitle, children, footer, width = 760 }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full bg-card border border-border rounded-4xl shadow-modal max-h-[88vh] overflow-y-auto"
        style={{ maxWidth: width }}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <div className="text-[17px] font-bold text-white">{title}</div>
            {subtitle && <div className="text-xs text-text-secondary mt-0.5">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg bg-border flex items-center justify-center cursor-pointer hover:bg-text-muted/40 transition-colors"
          >
            <X size={14} strokeWidth={2.5} className="text-text-secondary" />
          </button>
        </div>

        <div className="px-7 py-6">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 px-7 py-5 border-t border-border sticky bottom-0 bg-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
