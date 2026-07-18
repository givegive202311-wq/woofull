import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "@/lib/email";

// 決済成功済みのPaymentIntentから注文をDBに保存する。
// Webhookとconfirm-orderの両方から呼ばれるため、stripe_payment_intent_idの重複チェックで
// 何度呼ばれても注文が二重に作られない（冪等）
export async function saveOrderFromPaymentIntent(
  supabaseAdmin: SupabaseClient,
  pi: Stripe.PaymentIntent
): Promise<{ ok: true; alreadySaved: boolean }> {
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", pi.id)
    .single();

  if (existing) {
    return { ok: true, alreadySaved: true };
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
    stripe_payment_intent_id: pi.id,
    payment_status: "paid",
    fulfillment_status: "not_ordered",
    coupon_code: couponCode,
    coupon_discount: couponDiscount,
  }).select("id").single();

  if (couponCode && order) {
    await supabaseAdmin.rpc("increment_coupon_used", { coupon_code: couponCode });
  }

  if (shipping.email && order) {
    await sendOrderConfirmationEmail({
      to: shipping.email,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      items,
      totalAmount: pi.amount,
      shipping,
    });
  }

  return { ok: true, alreadySaved: false };
}
