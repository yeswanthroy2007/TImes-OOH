import { useCallback, useMemo, useState } from "react";
import type { Site } from "@/types/site";

export function useSiteSelection(allSites: readonly Site[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const isSelected = useCallback(
    (id: string) => selectedIdSet.has(id),
    [selectedIdSet]
  );

  const addToCart = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((existing) => existing !== id));
  }, []);

  const availableSites = useMemo(
    () => allSites.filter((s) => !selectedIdSet.has(s.id)),
    [allSites, selectedIdSet]
  );

  const cartSites = useMemo(() => {
    const byId = new Map(allSites.map((s) => [s.id, s] as const));
    return selectedIds
      .map((id) => byId.get(id))
      .filter((s): s is Site => Boolean(s));
  }, [allSites, selectedIds]);

  return {
    availableSites,
    cartSites,
    isSelected,
    addToCart,
    removeFromCart,
    count: selectedIds.length,
  };
}
