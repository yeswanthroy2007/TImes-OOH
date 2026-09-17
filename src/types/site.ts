export type Zone = "DELHI" | "NOIDA";

/**
 * A single DND-corridor OOH site.
 *
 * `siteCode` is copied verbatim from the source spreadsheet and is display-only —
 * it is NOT guaranteed unique across all 122 rows (a handful of sites share the
 * literal code "LANDSCAPE ADVERTISING", and one code appears twice for two distinct
 * kiosks). `id` is the stable, always-unique identifier derived from the sheet's
 * Sr.No column and is what selection/cart state keys off.
 */
export interface Site {
  id: string;
  srNo: number;
  zone: Zone;
  siteCode: string;
  displayType: string;
  location: string;
  width: number | null;
  height: number | null;
  quantity: number | null;
  areaSqft: number | null;
  mediaStatus: string | null;
  litStatus: string | null;
  latitude: number;
  longitude: number;
}

export interface SiteFilters {
  search: string;
  zone: Zone | "ALL";
  displayType: string | "ALL";
}
