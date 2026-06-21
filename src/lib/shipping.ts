const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 500;

export function getShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function getShippingLabel(subtotal: number): string {
  const fee = getShippingFee(subtotal);
  if (fee === 0) return "無料";
  return `¥${fee.toLocaleString()}`;
}

export function getAmountUntilFreeShipping(subtotal: number): number | null {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return null;
  return FREE_SHIPPING_THRESHOLD - subtotal;
}
