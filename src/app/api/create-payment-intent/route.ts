import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { amount, items } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "jpy",
    metadata: {
      items: JSON.stringify(items),
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
