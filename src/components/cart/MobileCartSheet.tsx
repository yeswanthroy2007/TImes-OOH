"use client";

import { ShoppingCart, X } from "lucide-react";
import type { Site } from "@/types/site";
import { CartItem } from "./CartItem";
import { CartEmptyState } from "./CartEmptyState";

interface MobileCartSheetProps {
  sites: Site[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRemove: (siteId: string) => void;
}

export function MobileCartSheet({ sites, isOpen, onOpen, onClose, onRemove }: MobileCartSheetProps) {
  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open cart, ${sites.length} sites selected`}
        className="fixed bottom-4 right-4 z-[1100] flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 lg:hidden"
      >
        <ShoppingCart className="h-4 w-4" />
        Cart
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-slate-900">
          {sites.length}
        </span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[1150] flex flex-col justify-end lg:hidden">
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />
          <div className="relative flex max-h-[75vh] flex-col rounded-t-2xl bg-white shadow-2xl animate-sheet-in">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-[18px] w-[18px] text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-800">Selected Sites</h2>
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-semibold text-white">
                  {sites.length}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
        </div>
      ) : null}
    </>
  );
}
