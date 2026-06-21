import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { name, email, category, message } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("inquiries").insert({
    name,
    email,
    category,
    message,
  });

  await sendTelegramNotification(
    `📩 <b>お問い合わせ</b>\n\n` +
    `👤 ${name}\n` +
    `📧 ${email}\n` +
    `📂 ${category}\n\n` +
    `💬 ${message}`
  );

  return NextResponse.json({ ok: true });
}
