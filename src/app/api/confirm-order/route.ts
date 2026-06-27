import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { paymentIntentId } = await req.json();
  if (!paymentIntentId) {
    return NextResponse.json({ error: "paymentIntentId is required" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (pi.status !== "succeeded") {
    return NextResponse.json({ error: "Payment not succeeded" }, { status: 400 });
  }

  // すでに保存済みか確認（二重保存防止）
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .single();

  if (existing) {
    return NextResponse.json({ ok: true, alreadySaved: true });
  }

  const items = pi.metadata?.items ? JSON.parse(pi.metadata.items) : [];
  const shipping = pi.metadata?.shipping ? JSON.parse(pi.metadata.shipping) : {};
  const couponCode = pi.metadata?.coupon_code || null;
  const couponDiscount = parseInt(pi.metadata?.coupon_discount || "0");

  const { data: order } = await supabaseAdmin.from("orders").insert({
    customer_name: shipping.name || "",
    customer_email: shipping.email || "",
    shipping_address: shipping,
    items,
    total_amount: pi.amount,
    stripe_payment_intent_id: paymentIntentId,
    payment_status: "paid",
    fulfillment_status: "not_ordered",
    coupon_code: couponCode,
    coupon_discount: couponDiscount,
  }).select("id").single();

  // クーポン使用回数をインクリメント
  if (couponCode && order) {
    await supabaseAdmin.rpc("increment_coupon_used", { coupon_code: couponCode });
  }

  // 注文確認メールを送信
  if (shipping.email && order) {
    await sendOrderConfirmationEmail({
      to: shipping.email,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      items,
      totalAmount: pi.amount,
      shipping,
    });
  }

  return NextResponse.json({ ok: true });
}
