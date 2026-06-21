import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { amount, items, shipping } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "jpy",
    metadata: {
      items: JSON.stringify(items),
      shipping: shipping ? JSON.stringify(shipping) : "",
    },
  });

  const itemList = items.map((i: { name: string; quantity: number }) => `  ${i.name} × ${i.quantity}`).join("\n");

  await sendTelegramNotification(
    `🐾 <b>新しい注文！</b>\n\n` +
    `💰 金額: ¥${amount.toLocaleString()}\n` +
    `📦 商品:\n${itemList}\n` +
    (shipping ? `\n👤 ${shipping.name}\n📍 ${shipping.prefecture}${shipping.city}` : "") +
    `\n\n🔗 管理画面: https://woofull.vercel.app/admin/orders`
  );

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
