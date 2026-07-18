import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { saveOrderFromPaymentIntent } from "@/lib/order";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Stripeからのイベントを直接受け取り、注文をDBに保存する。
// クライアントが決済後にタブを閉じる/通信が切れる等で /api/confirm-order を
// 呼べなかった場合でも、ここで確実に購入履歴が残る（confirm-orderと二重に
// 呼ばれても stripe_payment_intent_id の重複チェックで冪等）
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `signature verification failed: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await saveOrderFromPaymentIntent(supabaseAdmin, pi);
  }

  return NextResponse.json({ received: true });
}
