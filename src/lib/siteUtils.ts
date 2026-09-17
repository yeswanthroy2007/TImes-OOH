import type { Site, SiteFilters, Zone } from "@/types/site";

export function getZones(sites: readonly Site[]): Zone[] {
  return Array.from(new Set(sites.map((s) => s.zone))).sort();
}

export function getDisplayTypes(sites: readonly Site[]): string[] {
  return Array.from(new Set(sites.map((s) => s.displayType))).sort();
}

export function matchesFilters(site: Site, filters: SiteFilters): boolean {
  if (filters.zone !== "ALL" && site.zone !== filters.zone) return false;
  if (filters.displayType !== "ALL" && site.displayType !== filters.displayType)
    return false;

  const q = filters.search.trim().toLowerCase();
  if (!q) return true;

  const haystack = `${site.siteCode} ${site.location} ${site.displayType} ${site.zone}`.toLowerCase();
  return haystack.includes(q);
}

export function filterSites(sites: readonly Site[], filters: SiteFilters): Site[] {
  return sites.filter((s) => matchesFilters(s, filters));
}

export function formatDimensions(site: Site): string | null {
  if (site.width == null || site.height == null) return null;
  return `${site.width} × ${site.height} ft`;
}

export function formatArea(site: Site): string | null {
  if (site.areaSqft == null) return null;
  return `${site.areaSqft.toLocaleString("en-IN")} sq ft`;
}

export function formatCoordinates(site: Site, precision = 6): string {
  return `${site.latitude.toFixed(precision)}, ${site.longitude.toFixed(precision)}`;
}

export function googleMapsLink(site: Site): string {
  return `https://www.google.com/maps?q=${site.latitude},${site.longitude}`;
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function getBounds(sites: readonly Site[]): Bounds | null {
  if (sites.length === 0) return null;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const s of sites) {
    if (s.latitude < minLat) minLat = s.latitude;
    if (s.latitude > maxLat) maxLat = s.latitude;
    if (s.longitude < minLng) minLng = s.longitude;
    if (s.longitude > maxLng) maxLng = s.longitude;
  }
  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Several DND kiosks sit within a few metres of each other (same gantry / same
 * stretch of road surveyed twice). Rounding to ~4 decimal degrees (~11m) groups
 * those together, then each site in a group is nudged onto a small circle around
 * the group's true centroid purely for on-screen placement — the stored
 * latitude/longitude on the Site object itself is never modified.
 */
export interface DisplayPosition {
  site: Site;
  lat: number;
  lng: number;
  clusterSize: number;
}

const CLUSTER_ROUND_DP = 4;
const SPIDERFY_RADIUS_DEG = 0.00045;

export function computeDisplayPositions(sites: readonly Site[]): DisplayPosition[] {
  const groups = new Map<string, Site[]>();
  for (const site of sites) {
    const key = `${site.latitude.toFixed(CLUSTER_ROUND_DP)},${site.longitude.toFixed(
      CLUSTER_ROUND_DP
    )}`;
    const group = groups.get(key);
    if (group) group.push(site);
    else groups.set(key, [site]);
  }

  const positions: DisplayPosition[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      const site = group[0];
      positions.push({ site, lat: site.latitude, lng: site.longitude, clusterSize: 1 });
      continue;
    }

    const centroidLat =
      group.reduce((sum, s) => sum + s.latitude, 0) / group.length;
    const centroidLng =
      group.reduce((sum, s) => sum + s.longitude, 0) / group.length;

    group.forEach((site, index) => {
      const angle = (2 * Math.PI * index) / group.length;
      positions.push({
        site,
        lat: centroidLat + SPIDERFY_RADIUS_DEG * Math.sin(angle),
        lng:
          centroidLng +
          (SPIDERFY_RADIUS_DEG * Math.cos(angle)) /
            Math.cos((centroidLat * Math.PI) / 180),
        clusterSize: group.length,
      });
    });
  }

  return positions;
}
