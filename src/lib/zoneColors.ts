const ZONE_COLORS: Record<string, string> = {
  DELHI: "#2563eb",
  NOIDA: "#d97706",
};

export function zoneColor(zone: string): string {
  return ZONE_COLORS[zone] ?? "#475569";
}
