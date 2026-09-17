import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function CartEmptyState() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Drag a site from the map here to select it."
    />
  );
}
