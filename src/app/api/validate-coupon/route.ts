import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "コードを入力してください" }, { status: 400 });

  const { data: coupon } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (!coupon) return NextResponse.json({ error: "クーポンが見つかりません" }, { status: 404 });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return NextResponse.json({ error: "クーポンの有効期限が切れています" }, { status: 400 });
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses)
    return NextResponse.json({ error: "このクーポンは使用上限に達しました" }, { status: 400 });
  if (subtotal < coupon.min_amount)
    return NextResponse.json({ error: `¥${coupon.min_amount.toLocaleString()}以上のご購入で使用できます` }, { status: 400 });

  const discount = coupon.discount_type === "percent"
    ? Math.floor(subtotal * coupon.discount_value / 100)
    : coupon.discount_value;

  return NextResponse.json({ coupon, discount });
}
