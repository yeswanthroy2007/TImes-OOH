"use client";

import { CheckCircle2, Info, X } from "lucide-react";
import type { ToastMessage } from "@/hooks/useToast";

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[1200] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:right-6 sm:left-auto"
      aria-live="polite"
      role="status"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/10 animate-toast-in"
        >
          {toast.tone === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
          ) : (
            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-600" />
          )}
          <p className="flex-1 text-sm font-medium text-slate-700">{toast.text}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
