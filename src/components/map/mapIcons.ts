import L from "leaflet";
import type { Site } from "@/types/site";
import { zoneColor } from "@/lib/zoneColors";

/**
 * Renders a small billboard-on-a-pin glyph, colour-coded by zone, as a Leaflet
 * DivIcon. Using an inline SVG (rather than an image asset) keeps this dependency
 * free and lets us recolour / badge it per site without shipping multiple PNGs.
 */
export function createSiteIcon(site: Site, clusterSize: number): L.DivIcon {
  const color = zoneColor(site.zone);
  const badge =
    clusterSize > 1
      ? `<span class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-900 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">${clusterSize}</span>`
      : "";

  const html = `
    <div class="dnd-marker group relative flex h-11 w-9 cursor-grab items-center justify-center outline-none active:cursor-grabbing" data-site-id="${site.id}">
      ${badge}
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none" class="drop-shadow-md transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:scale-110">
        <path d="M15 0C6.7 0 0 6.62 0 14.79 0 24.95 15 38 15 38s15-13.05 15-23.21C30 6.62 23.3 0 15 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="15" cy="14.6" r="6.4" fill="white"/>
      </svg>
      <svg class="absolute top-[6px] left-1/2 -translate-x-1/2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="12" rx="1.5"/>
        <path d="M8 20l1.4-4M16 20l-1.4-4M12 16v4"/>
      </svg>
    </div>`;

  return L.divIcon({
    html,
    className: "dnd-marker-icon",
    iconSize: [36, 44],
    iconAnchor: [18, 40],
    popupAnchor: [0, -36],
  });
}
