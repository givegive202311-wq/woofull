import type { Product } from "@/types/database";

export function isDiscountActive(product: Product): boolean {
  if (!product.discount_percent || product.discount_percent <= 0) return false;
  const now = new Date();
  if (product.discount_start && new Date(product.discount_start) > now) return false;
  if (product.discount_end && new Date(product.discount_end) < now) return false;
  return true;
}

export function getDiscountedPrice(product: Product): number {
  if (!isDiscountActive(product)) return product.sell_price;
  return Math.round(product.sell_price * (1 - product.discount_percent / 100));
}

export function getRemainingTime(product: Product): string | null {
  if (!product.discount_end || !isDiscountActive(product)) return null;
  const now = new Date();
  const end = new Date(product.discount_end);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `残り${days}日${hours}時間`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `残り${hours}時間${minutes}分`;
  return `残り${minutes}分`;
}
