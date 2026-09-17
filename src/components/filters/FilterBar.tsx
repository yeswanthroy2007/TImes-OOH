"use client";

import { ListFilter, MapPin, RotateCcw } from "lucide-react";
import type { Zone } from "@/types/site";

interface FilterBarProps {
  zone: Zone | "ALL";
  onZoneChange: (zone: Zone | "ALL") => void;
  displayType: string | "ALL";
  onDisplayTypeChange: (type: string | "ALL") => void;
  displayTypes: string[];
  visibleCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onClear: () => void;
}

const selectClass =
  "appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-7 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export function FilterBar({
  zone,
  onZoneChange,
  displayType,
  onDisplayTypeChange,
  displayTypes,
  visibleCount,
  totalCount,
  hasActiveFilters,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <select
          value={zone}
          onChange={(e) => onZoneChange(e.target.value as Zone | "ALL")}
          aria-label="Filter by zone"
          className={selectClass}
        >
          <option value="ALL">All zones</option>
          <option value="DELHI">Delhi</option>
          <option value="NOIDA">Noida</option>
        </select>
      </div>

      <div className="relative">
        <ListFilter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <select
          value={displayType}
          onChange={(e) => onDisplayTypeChange(e.target.value)}
          aria-label="Filter by display type"
          className={selectClass}
        >
          <option value="ALL">All display types</option>
          {displayTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear filters
        </button>
      ) : null}

      <span className="ml-auto text-xs font-medium text-slate-500">
        Showing <span className="text-slate-800">{visibleCount}</span> of {totalCount} sites
      </span>
    </div>
  );
}
