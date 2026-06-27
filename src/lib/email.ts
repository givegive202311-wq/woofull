import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = { name: string; quantity: number; price: number };
type ShippingAddress = {
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  building?: string;
};

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  items,
  totalAmount,
  shipping,
}: {
  to: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shipping: ShippingAddress;
}) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">×${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">¥${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">

    <!-- ヘッダー -->
    <div style="background:#F6A54B;padding:32px;text-align:center;">
      <p style="color:#fff;font-size:24px;font-weight:bold;margin:0;">🐾 Woofull</p>
      <p style="color:#fff;opacity:0.9;margin:8px 0 0;font-size:14px;">ご注文ありがとうございます！</p>
    </div>

    <!-- 本文 -->
    <div style="padding:32px;">
      <p style="color:#2D2D2D;font-size:15px;line-height:1.7;">${shipping.name} 様</p>
      <p style="color:#2D2D2D;font-size:15px;line-height:1.7;">
        この度はWoofullをご利用いただき、ありがとうございます。<br>
        ご注文を受け付けました。商品の準備ができ次第、発送のご連絡をいたします。
      </p>

      <!-- 注文番号 -->
      <div style="background:#FFF8F1;border-radius:12px;padding:16px;margin:24px 0;text-align:center;">
        <p style="color:#F6A54B;font-size:12px;font-weight:bold;margin:0 0 4px;">注文番号</p>
        <p style="color:#2D2D2D;font-size:16px;font-weight:bold;margin:0;font-family:monospace;">${orderNumber}</p>
      </div>

      <!-- 注文内容 -->
      <h3 style="color:#2D2D2D;font-size:14px;font-weight:bold;margin:24px 0 12px;">📦 ご注文内容</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#2D2D2D;">
        ${itemRows}
        <tr>
          <td colspan="2" style="padding:12px 0 4px;font-weight:bold;">合計</td>
          <td style="padding:12px 0 4px;text-align:right;font-weight:bold;color:#F6A54B;font-size:16px;">¥${totalAmount.toLocaleString()}</td>
        </tr>
      </table>

      <!-- 配送先 -->
      <h3 style="color:#2D2D2D;font-size:14px;font-weight:bold;margin:24px 0 12px;">🚚 配送先</h3>
      <div style="background:#f9f9f9;border-radius:12px;padding:16px;font-size:14px;color:#2D2D2D;line-height:1.8;">
        <p style="margin:0;">${shipping.name}</p>
        <p style="margin:0;">〒${shipping.postalCode}</p>
        <p style="margin:0;">${shipping.prefecture}${shipping.city}${shipping.building || ""}</p>
        <p style="margin:0;">${shipping.phone}</p>
      </div>

      <p style="color:#2D2D2D;opacity:0.5;font-size:12px;line-height:1.8;margin-top:24px;">
        ご不明な点がございましたら、お気軽にお問い合わせください。<br>
        ※このメールは自動送信です。返信はできません。
      </p>
    </div>

    <!-- フッター -->
    <div style="background:#f9f9f9;padding:20px;text-align:center;">
      <p style="color:#2D2D2D;opacity:0.4;font-size:12px;margin:0;">
        © Woofull / 合同会社YOLO<br>
        <a href="https://woofull.vercel.app" style="color:#F6A54B;">woofull.vercel.app</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: "Woofull <onboarding@resend.dev>",
    to,
    subject: `【Woofull】ご注文ありがとうございます（注文番号: ${orderNumber}）`,
    html,
  });
}
