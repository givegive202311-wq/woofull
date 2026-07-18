import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { saveOrderFromPaymentIntent } from "@/lib/order";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 決済完了直後に成功画面から呼ばれる即時パス。
// 何らかの理由でここが呼ばれなくても /api/webhook が同じ処理を保証する
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

  const result = await saveOrderFromPaymentIntent(supabaseAdmin, pi);
  return NextResponse.json(result);
}
