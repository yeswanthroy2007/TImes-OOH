"use client";

import { Maximize2 } from "lucide-react";
import { useMap } from "react-leaflet";
import type L from "leaflet";

interface MapControlsProps {
  bounds: L.LatLngBoundsExpression;
}

export function MapControls({ bounds }: MapControlsProps) {
  const map = useMap();

  return (
    <div className="absolute right-3 top-3 z-[900] flex flex-col gap-2">
      <button
        type="button"
        onClick={() => map.fitBounds(bounds, { padding: [36, 36] })}
        aria-label="Fit map to all sites"
        title="Fit to sites"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-[900] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] text-slate-600 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" /> Delhi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d97706]" /> Noida
        </span>
      </div>
      <p className="mt-1 text-[10px] text-slate-400">
        Overlapping kiosks are auto-separated for clarity
      </p>
    </div>
  );
}
