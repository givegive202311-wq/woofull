import type { SupabaseClient } from "@supabase/supabase-js";

// クーポンをDB基準で検証し、割引額を計算する（金額はクライアントの申告値を信用しない）
export async function validateCoupon(
  supabaseAdmin: SupabaseClient,
  code: string,
  subtotal: number
): Promise<{ error: string } | { coupon: Record<string, unknown>; discount: number }> {
  const { data: coupon } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (!coupon) return { error: "クーポンが見つかりません" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return { error: "クーポンの有効期限が切れています" };
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses)
    return { error: "このクーポンは使用上限に達しました" };
  if (subtotal < coupon.min_amount)
    return { error: `¥${coupon.min_amount.toLocaleString()}以上のご購入で使用できます` };

  const discount = coupon.discount_type === "percent"
    ? Math.floor(subtotal * coupon.discount_value / 100)
    : coupon.discount_value;

  return { coupon, discount };
}
