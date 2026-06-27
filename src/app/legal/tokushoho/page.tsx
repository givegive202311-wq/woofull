"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const rows = [
  { label: "販売業者", value: "合同会社YOLO" },
  { label: "運営統括責任者", value: "合同会社YOLO" },
  { label: "所在地", value: "請求があった場合、遅滞なく開示いたします。" },
  { label: "電話番号", value: "請求があった場合、遅滞なく開示いたします。" },
  { label: "メールアドレス", value: "givegive202311@gmail.com" },
  { label: "販売URL", value: "https://woofull.jp（予定）" },
  { label: "販売価格", value: "各商品ページに記載" },
  { label: "商品代金以外の必要料金", value: "5,000円以上のご注文で送料無料。5,000円未満の場合は全国一律500円。" },
  { label: "お届け時期", value: "ご注文確定後、7〜14営業日以内にお届け。在庫状況や配送事情によりお届けが遅れる場合は、メールにてご連絡いたします。" },
  { label: "お支払い方法", value: "クレジットカード（Visa / Mastercard / American Express / JCB）" },
  { label: "お支払い時期", value: "ご注文時にお支払いが確定します。" },
  { label: "返品・交換について", value: "商品の性質上、お客様都合による返品・交換はお受けしておりません。商品に不良があった場合は、到着後7日以内にメールにてご連絡ください。交換または返金にて対応いたします。" },
  { label: "返品送料", value: "不良品の場合は当社負担。" },
];

export default function TokushohoPage() {
  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-2xl md:text-3xl font-bold font-heading mb-10"
          style={{ color: "#2D2D2D" }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          特定商取引法に基づく表記
        </motion.h1>

        <motion.div
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="flex flex-col md:flex-row"
              style={{
                borderBottom: i < rows.length - 1 ? "1px solid rgba(45,45,45,0.06)" : "none",
              }}
            >
              <div
                className="md:w-1/3 px-6 py-4 text-sm font-bold flex-shrink-0"
                style={{ color: "#2D2D2D", backgroundColor: "rgba(246,165,75,0.04)" }}
              >
                {row.label}
              </div>
              <div
                className="md:w-2/3 px-6 py-4 text-sm leading-relaxed"
                style={{ color: "#2D2D2D", opacity: 0.7 }}
              >
                {row.value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
