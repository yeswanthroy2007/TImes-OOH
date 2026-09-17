"use client";

import { MapPin, X } from "lucide-react";
import type { Site } from "@/types/site";
import { formatArea, formatCoordinates, formatDimensions } from "@/lib/siteUtils";
import { zoneColor } from "@/lib/zoneColors";

interface CartItemProps {
  site: Site;
  onRemove: (id: string) => void;
}

export function CartItem({ site, onRemove }: CartItemProps) {
  const dimensions = formatDimensions(site);
  const area = formatArea(site);

  return (
    <li className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-[12px] font-semibold text-slate-900">
            {site.siteCode}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: zoneColor(site.zone) }}
            />
            {site.displayType} · {site.zone}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(site.id)}
          aria-label={`Remove ${site.siteCode} from cart`}
          className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mt-1.5 flex items-start gap-1 text-[11px] text-slate-500">
        <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
        {site.location}
      </p>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>{[dimensions, area].filter(Boolean).join(" · ") || "—"}</span>
      </div>
      <p className="mt-1 font-mono text-[10px] text-slate-400">{formatCoordinates(site)}</p>
    </li>
  );
}
