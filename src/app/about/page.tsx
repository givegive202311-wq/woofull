"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { SectionDivider } from "@/components/ui/SectionDivider";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* ヒーロー */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/hero-first-meet.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.2))" }}
        />
        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PawIcon size={32} color="#F6A54B" className="mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold font-heading">
            ブランドストーリー
          </h1>
        </motion.div>
      </section>

      {/* ストーリー本文 */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="space-y-8 text-base md:text-lg leading-loose"
            style={{ color: "#2D2D2D" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <p>
              犬を飼い始めた日のことを覚えていますか。
            </p>
            <p>
              小さな体を抱き上げたとき、「この子を幸せにしよう」と誓ったはず。
              でも毎日が忙しくなると、散歩もおもちゃも、つい「いつものアレ」になってしまう。
            </p>
            <p>
              Woofullは、そんな飼い主の気持ちに寄り添いたくて生まれました。
            </p>
            <p className="font-medium" style={{ color: "#F6A54B" }}>
              「愛犬の毎日を、もっと豊かに。もっと長く。」
            </p>
            <p>
              脳を使うこと。体を動かすこと。飼い主と気持ちを通わせること。
              犬の健康寿命を伸ばすために本当に大切なことを、
              毎日の遊びの中に取り入れられるグッズを届けます。
            </p>
            <p>
              特別なことじゃなくていい。
              毎日のちょっとした工夫が、5年後、10年後の愛犬の姿を変える。
              そう信じて、Woofullは一つひとつの商品を選んでいます。
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ミッション */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-bold font-heading text-center mb-12"
            style={{ color: "#2D2D2D" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Woofullが大切にしていること
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "本当に意味のあるものだけ",
                text: "見た目だけのグッズは扱いません。犬の行動学や健康に根拠のある商品だけを厳選しています。",
              },
              {
                title: "飼い主の目線で選ぶ",
                text: "使いやすさ、お手入れのしやすさ、価格のバランス。飼い主として「自分が買いたいか」を基準に選んでいます。",
              },
              {
                title: "正直に伝える",
                text: "「これで病気が治る」とは言いません。できることとできないことを正直に。信頼関係を大切にしています。",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-2xl p-8 shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#F6A54B15" }}
                >
                  <span className="text-lg font-bold" style={{ color: "#F6A54B" }}>
                    {i + 1}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold font-heading mb-3"
                  style={{ color: "#2D2D2D" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
