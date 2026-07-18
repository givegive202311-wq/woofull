import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/lib/telegram";
import { isDiscountActive, getDiscountedPrice } from "@/lib/discount";
import { getShippingFee } from "@/lib/shipping";
import { validateCoupon } from "@/lib/coupon";
import type { Product } from "@/types/database";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { items, shipping, couponCode } = await req.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "カートが空です" }, { status: 400 });
  }

  // 価格・在庫はクライアントの申告値を信用せず、必ずDBの現在値から再計算する
  const ids: string[] = items.map((i: { id: string }) => i.id);
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*")
    .in("id", ids);

  const productMap = new Map((products || []).map((p: Product) => [p.id, p]));
  if (ids.some((id) => !productMap.has(id))) {
    return NextResponse.json({ error: "無効な商品が含まれています" }, { status: 400 });
  }

  let subtotal = 0;
  for (const item of items as { id: string; quantity: number }[]) {
    const product = productMap.get(item.id)!;
    const quantity = Math.max(1, Math.floor(item.quantity));
    const unitPrice = isDiscountActive(product) ? getDiscountedPrice(product) : product.sell_price;
    subtotal += unitPrice * quantity;
  }

  let couponDiscount = 0;
  if (couponCode) {
    const result = await validateCoupon(supabaseAdmin, couponCode, subtotal);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    couponDiscount = result.discount;
  }

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const amount = discountedSubtotal + getShippingFee(discountedSubtotal);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "jpy",
    metadata: {
      items: JSON.stringify(
        items.map((i: { id: string; quantity: number }) => ({
          id: i.id,
          name: productMap.get(i.id)!.name,
          quantity: i.quantity,
        }))
      ),
      shipping: shipping ? JSON.stringify(shipping) : "",
      coupon_code: couponCode || "",
      coupon_discount: String(couponDiscount),
    },
  });

  const itemList = (items as { id: string; quantity: number }[])
    .map((i) => `  ${productMap.get(i.id)!.name} × ${i.quantity}`)
    .join("\n");

  await sendTelegramNotification(
    `🐾 <b>新しい注文！</b>\n\n` +
    `💰 金額: ¥${amount.toLocaleString()}\n` +
    `📦 商品:\n${itemList}\n` +
    (shipping ? `\n👤 ${shipping.name}\n📍 ${shipping.prefecture}${shipping.city}` : "") +
    `\n\n🔗 管理画面: https://woofull.vercel.app/admin/orders`
  );

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
