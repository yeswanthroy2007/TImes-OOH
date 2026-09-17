"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Site } from "@/types/site";
import { CartItem } from "./CartItem";
import { CartEmptyState } from "./CartEmptyState";

interface CartPanelProps {
  sites: Site[];
  isDragging: boolean;
  onDrop: (siteId: string) => void;
  onRemove: (siteId: string) => void;
  className?: string;
}

export function CartPanel({ sites, isDragging, onDrop, onRemove, className = "" }: CartPanelProps) {
  const [rawIsOver, setIsOver] = useState(false);
  // Derived rather than reset via an effect: if a drag ends outside the window
  // (no "drop" ever fires) isDragging alone flipping back to false is enough to
  // stop showing the "over" state, with no extra render pass needed.
  const isOver = rawIsOver && isDragging;

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const siteId = e.dataTransfer.getData("text/plain");
        if (siteId) onDrop(siteId);
      }}
      className={`flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-colors duration-150 ${
        isOver
          ? "border-blue-400 bg-blue-50/70 ring-2 ring-blue-200"
          : isDragging
            ? "border-blue-300 border-dashed bg-blue-50/30"
            : "border-slate-200"
      } ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-[18px] w-[18px] text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-800">Selected Sites</h2>
        </div>
        <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-semibold text-white">
          {sites.length}
        </span>
      </div>

      {isDragging ? (
        <div
          className={`mx-3 mt-3 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-2.5 text-xs font-medium transition-colors ${
            isOver
              ? "border-blue-500 bg-blue-100 text-blue-700"
              : "border-blue-300 bg-blue-50 text-blue-500"
          }`}
        >
          {isOver ? "Release to add to cart" : "Drop site here"}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {sites.length === 0 ? (
          <CartEmptyState />
        ) : (
          <ul className="space-y-2">
            {sites.map((site) => (
              <CartItem key={site.id} site={site} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
