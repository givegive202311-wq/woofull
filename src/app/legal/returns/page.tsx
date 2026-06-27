"use client";

import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { AlertTriangle, CheckCircle, Mail } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ReturnsPage() {
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
          返品・交換ポリシー
        </motion.h1>

        {/* 基本方針 */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle size={20} color="#F6A54B" className="flex-shrink-0 mt-0.5" />
            <h2 className="text-base font-bold font-heading" style={{ color: "#2D2D2D" }}>
              お客様都合による返品・交換
            </h2>
          </div>
          <p className="text-sm leading-relaxed ml-9" style={{ color: "#2D2D2D", opacity: 0.65 }}>
            商品の性質上、お客様のご都合による返品・交換はお受けしておりません。
            サイズや色味など、ご不明な点がございましたら、ご購入前にメールにてお問い合わせください。
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <CheckCircle size={20} color="#F6A54B" className="flex-shrink-0 mt-0.5" />
            <h2 className="text-base font-bold font-heading" style={{ color: "#2D2D2D" }}>
              不良品・誤配送の場合
            </h2>
          </div>
          <div className="text-sm leading-relaxed ml-9 space-y-3" style={{ color: "#2D2D2D", opacity: 0.65 }}>
            <p>
              万が一、商品に破損・汚損・初期不良があった場合、または注文と異なる商品が届いた場合は、
              <strong style={{ color: "#2D2D2D", opacity: 1 }}>商品到着後7日以内</strong>にメールにてご連絡ください。
            </p>
            <p>交換品の発送、または返金にて対応いたします。</p>
            <p>返品送料は当社が負担いたします。</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <Mail size={20} color="#F6A54B" className="flex-shrink-0 mt-0.5" />
            <h2 className="text-base font-bold font-heading" style={{ color: "#2D2D2D" }}>
              お問い合わせ先
            </h2>
          </div>
          <div className="text-sm leading-relaxed ml-9 space-y-2" style={{ color: "#2D2D2D", opacity: 0.65 }}>
            <p>メール: givegive202311@gmail.com</p>
            <p>件名に「返品・交換について」と記載のうえ、以下をお知らせください。</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>ご注文番号</li>
              <li>商品名</li>
              <li>不良の状態がわかる写真</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="text-center pt-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PawIcon size={20} color="#F6A54B" className="mx-auto opacity-30" />
        </motion.div>
      </div>
    </main>
  );
}
