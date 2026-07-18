import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateCoupon } from "@/lib/coupon";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "コードを入力してください" }, { status: 400 });

  const result = await validateCoupon(supabaseAdmin, code, subtotal);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json(result);
}
