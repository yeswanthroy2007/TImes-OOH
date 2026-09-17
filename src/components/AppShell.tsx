"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { SITES } from "@/data/sites";
import type { Site, SiteFilters, Zone } from "@/types/site";
import { filterSites, getBounds, getDisplayTypes } from "@/lib/siteUtils";
import { useSiteSelection } from "@/hooks/useSiteSelection";
import { useToast } from "@/hooks/useToast";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterBar } from "@/components/filters/FilterBar";
import { CartPanel } from "@/components/cart/CartPanel";
import { MobileCartSheet } from "@/components/cart/MobileCartSheet";
import { ToastStack } from "@/components/ui/Toast";

const SiteMap = dynamic(() => import("@/components/map/SiteMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading map…
      </div>
    </div>
  ),
});

const FALLBACK_BOUNDS: [[number, number], [number, number]] = [
  [28.55, 77.25],
  [28.6, 77.32],
];

const INITIAL_FILTERS: SiteFilters = { search: "", zone: "ALL", displayType: "ALL" };

export function AppShell() {
  const [filters, setFilters] = useState<SiteFilters>(INITIAL_FILTERS);
  const [draggingSiteId, setDraggingSiteId] = useState<string | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const { availableSites, cartSites, addToCart, removeFromCart, isSelected } =
    useSiteSelection(SITES);
  const { toasts, push, dismiss } = useToast();

  const displayTypes = useMemo(() => getDisplayTypes(SITES), []);
  const bounds = useMemo(() => {
    const b = getBounds(SITES);
    if (!b) return FALLBACK_BOUNDS;
    return [
      [b.minLat, b.minLng],
      [b.maxLat, b.maxLng],
    ] as [[number, number], [number, number]];
  }, []);

  const visibleSites = useMemo(
    () => filterSites(availableSites, filters),
    [availableSites, filters]
  );

  const hasActiveFilters =
    filters.search.trim() !== "" || filters.zone !== "ALL" || filters.displayType !== "ALL";

  const handleAddToCart = (siteId: string) => {
    if (isSelected(siteId)) return;
    const site = SITES.find((s) => s.id === siteId);
    addToCart(siteId);
    if (site) push(`Added ${site.siteCode} to cart`, "success");
  };

  const handleRemove = (siteId: string) => {
    const site = SITES.find((s) => s.id === siteId);
    removeFromCart(siteId);
    if (site) push(`Removed ${site.siteCode} from cart`, "info");
  };

  const handleDrop = (siteId: string) => {
    handleAddToCart(siteId);
    setDraggingSiteId(null);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header />

      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
          />
          <FilterBar
            zone={filters.zone}
            onZoneChange={(zone: Zone | "ALL") => setFilters((prev) => ({ ...prev, zone }))}
            displayType={filters.displayType}
            onDisplayTypeChange={(displayType) =>
              setFilters((prev) => ({ ...prev, displayType }))
            }
            displayTypes={displayTypes}
            visibleCount={visibleSites.length}
            totalCount={SITES.length}
            hasActiveFilters={hasActiveFilters}
            onClear={() => setFilters(INITIAL_FILTERS)}
          />
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-3 sm:p-5 lg:flex-row">
        <div className="relative h-[52vh] min-h-[320px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm lg:h-full lg:flex-1">
          <SiteMap
            sites={visibleSites as Site[]}
            bounds={bounds}
            onDragStart={setDraggingSiteId}
            onDragEnd={() => setDraggingSiteId(null)}
            onAddToCart={handleAddToCart}
          />
        </div>

        <aside className="hidden lg:flex lg:h-full lg:w-[360px] lg:shrink-0 lg:flex-col">
          <CartPanel
            sites={cartSites}
            isDragging={draggingSiteId !== null}
            onDrop={handleDrop}
            onRemove={handleRemove}
            className="flex-1"
          />
        </aside>
      </main>

      <MobileCartSheet
        sites={cartSites}
        isOpen={mobileCartOpen}
        onOpen={() => setMobileCartOpen(true)}
        onClose={() => setMobileCartOpen(false)}
        onRemove={handleRemove}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
