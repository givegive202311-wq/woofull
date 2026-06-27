"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    title: "1. 個人情報の取得",
    content:
      "当サイトでは、商品の購入・配送に必要な範囲で、お客様の氏名、住所、メールアドレス、電話番号、決済情報を取得します。",
  },
  {
    title: "2. 個人情報の利用目的",
    content:
      "取得した個人情報は、以下の目的で利用いたします。\n・商品の発送および配送状況のご連絡\n・ご注文内容の確認、お問い合わせへの対応\n・サービスの改善および新商品のご案内（お客様の同意がある場合）",
  },
  {
    title: "3. 個人情報の第三者提供",
    content:
      "当サイトでは、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。\n・お客様の同意がある場合\n・配送業者への配送先情報の提供\n・決済処理のためのStripe社への情報提供\n・法令に基づく場合",
  },
  {
    title: "4. 個人情報の管理",
    content:
      "お客様の個人情報は、不正アクセス・紛失・破損・改ざんおよび漏えい等を防止するため、適切な安全管理措置を講じます。決済情報はStripe社が管理しており、当サイトにクレジットカード番号が保存されることはありません。",
  },
  {
    title: "5. Cookieの使用",
    content:
      "当サイトでは、サービスの利便性向上のためにCookieを使用する場合があります。ブラウザの設定によりCookieの受け取りを拒否することができますが、一部の機能が利用できなくなる場合があります。",
  },
  {
    title: "6. プライバシーポリシーの変更",
    content:
      "本ポリシーの内容は、法令の変更やサービスの変更に伴い、事前の通知なく変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。",
  },
  {
    title: "7. お問い合わせ",
    content: "個人情報に関するお問い合わせは、下記メールアドレスまでご連絡ください。\nメール: givegive202311@gmail.com",
  },
];

export default function PrivacyPage() {
  return (
    <main className="flex-1 pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-2xl md:text-3xl font-bold font-heading mb-3"
          style={{ color: "#2D2D2D" }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          プライバシーポリシー
        </motion.h1>
        <motion.p
          className="text-sm mb-10"
          style={{ color: "#2D2D2D", opacity: 0.4 }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          最終更新日: 2026年6月21日
        </motion.p>

        <motion.p
          className="text-sm leading-relaxed mb-10"
          style={{ color: "#2D2D2D", opacity: 0.7 }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Woofull（以下「当サイト」）は、お客様の個人情報の保護を重要な責務と考え、以下のプライバシーポリシーに基づき、適切に取り扱います。
        </motion.p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
            >
              <h2
                className="text-base font-bold font-heading mb-3"
                style={{ color: "#2D2D2D" }}
              >
                {section.title}
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "#2D2D2D", opacity: 0.65 }}
              >
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
