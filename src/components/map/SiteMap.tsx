"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type L from "leaflet";
import type { Site } from "@/types/site";
import { computeDisplayPositions } from "@/lib/siteUtils";
import { SiteMarker } from "./SiteMarker";
import { MapControls, MapLegend } from "./MapControls";

interface SiteMapProps {
  sites: Site[];
  bounds: L.LatLngBoundsExpression;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onAddToCart: (id: string) => void;
}

export default function SiteMap({
  sites,
  bounds,
  onDragStart,
  onDragEnd,
  onAddToCart,
}: SiteMapProps) {
  const positions = useMemo(() => computeDisplayPositions(sites), [sites]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [36, 36] }}
        scrollWheelZoom
        className="h-full w-full bg-slate-100"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map(({ site, lat, lng, clusterSize }) => (
          <SiteMarker
            key={site.id}
            site={site}
            lat={lat}
            lng={lng}
            clusterSize={clusterSize}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onAddToCart={onAddToCart}
          />
        ))}
        <MapControls bounds={bounds} />
        <MapLegend />
      </MapContainer>

      {sites.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 z-[950] flex items-center justify-center">
          <div className="pointer-events-auto rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-lg">
            <p className="text-sm font-semibold text-slate-700">No sites match your filters</p>
            <p className="mt-1 text-xs text-slate-500">Try clearing the search or filters above.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
