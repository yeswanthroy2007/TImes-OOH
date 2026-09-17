"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { PlusCircle } from "lucide-react";
import type { Site } from "@/types/site";
import { createSiteIcon } from "./mapIcons";
import { zoneColor } from "@/lib/zoneColors";
import { formatArea, formatCoordinates, formatDimensions } from "@/lib/siteUtils";

interface SiteMarkerProps {
  site: Site;
  lat: number;
  lng: number;
  clusterSize: number;
  onDragStart: (siteId: string) => void;
  onDragEnd: () => void;
  onAddToCart: (siteId: string) => void;
}

export function SiteMarker({
  site,
  lat,
  lng,
  clusterSize,
  onDragStart,
  onDragEnd,
  onAddToCart,
}: SiteMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const icon = useMemo(() => createSiteIcon(site, clusterSize), [site, clusterSize]);

  useEffect(() => {
    const marker = markerRef.current;
    const el = marker?.getElement();
    if (!marker || !el) return;

    // This is a native HTML5 drag source, not Leaflet's own marker.dragging —
    // stopping mousedown/click from bubbling keeps the map from panning
    // underneath the gesture while the browser drives the drag.
    L.DomEvent.disableClickPropagation(el);
    el.setAttribute("draggable", "true");
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute(
      "aria-label",
      `${site.siteCode}, ${site.displayType}, ${site.location}. Drag onto the cart to select, or press Enter for details.`
    );

    const handleDragStart = (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", site.id);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      el.classList.add("dnd-marker-dragging");
      onDragStart(site.id);
    };
    const handleDragEnd = () => {
      el.classList.remove("dnd-marker-dragging");
      onDragEnd();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        marker.openPopup();
      }
    };

    el.addEventListener("dragstart", handleDragStart);
    el.addEventListener("dragend", handleDragEnd);
    el.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("dragstart", handleDragStart);
      el.removeEventListener("dragend", handleDragEnd);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [site, onDragStart, onDragEnd]);

  const dimensions = formatDimensions(site);
  const area = formatArea(site);

  return (
    <Marker
      ref={markerRef}
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{
        mouseover: (e) => e.target.openPopup(),
        mouseout: (e) => e.target.closePopup(),
      }}
    >
      <Popup
        closeButton={false}
        autoPan
        autoPanPadding={[24, 24]}
        className="dnd-popup"
        minWidth={220}
      >
        <div className="min-w-[210px] space-y-2 p-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[11px] font-semibold text-slate-900">{site.siteCode}</p>
              <p className="text-[11px] text-slate-500">{site.location}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: zoneColor(site.zone) }}
            >
              {site.zone}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600">
            <span className="text-slate-400">Display</span>
            <span className="text-right font-medium text-slate-700">{site.displayType}</span>
            {dimensions ? (
              <>
                <span className="text-slate-400">Dimensions</span>
                <span className="text-right font-medium text-slate-700">{dimensions}</span>
              </>
            ) : null}
            {area ? (
              <>
                <span className="text-slate-400">Area</span>
                <span className="text-right font-medium text-slate-700">{area}</span>
              </>
            ) : null}
            {site.mediaStatus ? (
              <>
                <span className="text-slate-400">Media</span>
                <span className="text-right font-medium text-slate-700">{site.mediaStatus}</span>
              </>
            ) : null}
            {site.litStatus ? (
              <>
                <span className="text-slate-400">Lit status</span>
                <span className="text-right font-medium text-slate-700">{site.litStatus}</span>
              </>
            ) : null}
            <span className="text-slate-400">Coordinates</span>
            <span className="text-right font-mono text-[10px] text-slate-500">
              {formatCoordinates(site)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(site.id)}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-slate-900 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-700"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add to cart
          </button>
          <p className="text-center text-[10px] text-slate-400">
            Tip: drag the pin onto the cart panel instead
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
