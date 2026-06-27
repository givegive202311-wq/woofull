"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ArrowRight, Globe, Heart, Sparkles, CheckCircle } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <main className="flex-1">

      {/* ─── ヒーロー ─── */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-end justify-center pb-16">
        <Image src="/images/hero-gaze.png" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
        <motion.div
          className="relative z-10 text-center text-white px-6 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <PawIcon size={28} color="#F6A54B" className="mx-auto mb-5 opacity-80" />
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 leading-tight">
            ペットと一緒に、<br />楽しい毎日を。
          </h1>
          <p className="text-white/70 text-base md:text-lg">
            Woofullが生まれた理由
          </p>
        </motion.div>
      </section>

      {/* ─── 原点のストーリー ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="space-y-7 text-base md:text-lg leading-loose"
            style={{ color: "#2D2D2D", opacity: 0.85 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl md:text-2xl font-bold font-heading leading-relaxed" style={{ color: "#2D2D2D", opacity: 1 }}>
              「この子と、もっと楽しく過ごしたい。」
            </p>
            <p>
              Woofullは、そんなシンプルな気持ちから始まりました。
            </p>
            <p>
              犬を迎えた日から、毎日が変わりました。散歩の時間が楽しみになって、帰宅するたびに尻尾を振って迎えてくれる。「この子のために、もっといろんなことをしてあげたい」――そう思い始めたのが、このサービスのきっかけです。
            </p>
            <p>
              でも、国内の市場を見渡すと「なんとなく買ったもの」「安いから買ったもの」ばかりが溢れていて、本当に犬のことを考えて作られたグッズに出会いにくかった。
            </p>
            <p className="font-medium" style={{ color: "#F6A54B", opacity: 1 }}>
              「だったら、世界中から探してくればいい。」
            </p>
            <p>
              そう気づいたとき、Woofullが動き始めました。
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── 世界から厳選 ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                <Image src="/images/hero-morning-walk.png" alt="" fill className="object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(246,165,75,0.15), transparent)" }} />
              </div>
              {/* 装飾 */}
              <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none">
                <PawIcon size={80} color="#F6A54B" />
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: "#F6A54B15" }}>
                <Globe size={16} color="#F6A54B" />
                <span className="text-sm font-bold" style={{ color: "#F6A54B" }}>世界基準の品質</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-6 leading-snug" style={{ color: "#2D2D2D" }}>
                国内にないなら、<br />世界から持ってくる。
              </h2>
              <p className="text-base leading-loose mb-6" style={{ color: "#2D2D2D", opacity: 0.65 }}>
                Woofullの商品は、海外で高い評価を受けているグッズを厳選して日本にお届けしています。欧米・アジア各国で実際に使われ、ペットの専門家や飼い主から支持されているものだけを扱います。
              </p>
              <ul className="space-y-3">
                {[
                  "ペットの行動学や健康に基づいて設計されたもの",
                  "素材・耐久性・安全性を自分たちで確認したもの",
                  "価格以上の価値があると確信したもの",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <CheckCircle size={18} color="#F6A54B" className="flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.75 }}>{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── 想い：みんなに使ってほしい ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                <Image src="/images/hero-cozy.png" alt="" fill className="object-cover" />
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: "#F6A54B15" }}>
                <Heart size={16} color="#F6A54B" />
                <span className="text-sm font-bold" style={{ color: "#F6A54B" }}>すべての飼い主へ</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-6 leading-snug" style={{ color: "#2D2D2D" }}>
                「誰でも」使えるものを、<br />届けたかった。
              </h2>
              <p className="text-base leading-loose mb-4" style={{ color: "#2D2D2D", opacity: 0.65 }}>
                ペットグッズって、なぜか「こだわる人向け」か「安かろう悪かろう」の二択になりがちです。
              </p>
              <p className="text-base leading-loose mb-4" style={{ color: "#2D2D2D", opacity: 0.65 }}>
                でも本当は、犬を愛しているすべての飼い主に、質の高いグッズを手に届く価格で使ってほしい。特別な知識がなくても、時間がなくても、「これを選べば間違いない」と思えるものを。
              </p>
              <p className="text-base leading-loose font-medium" style={{ color: "#F6A54B" }}>
                Woofullは、「誰もが愛犬と豊かな時間を過ごせる世界」を目指しています。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── 3つのこだわり ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: "#F6A54B15" }}>
              <Sparkles size={16} color="#F6A54B" />
              <span className="text-sm font-bold" style={{ color: "#F6A54B" }}>Woofullのこだわり</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading" style={{ color: "#2D2D2D" }}>
              大切にしている3つのこと
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "根拠のある商品だけ",
                text: "「なんとなく良さそう」では選びません。犬の行動学・栄養学・運動生理学に基づいた視点で、本当に意味のあるものだけを扱います。",
              },
              {
                num: "02",
                title: "正直に、飾らずに",
                text: "「使えば必ず長生きする」とは言いません。できることとできないことを正直に伝える。信頼は、誠実さからしか生まれないと思っています。",
              },
              {
                num: "03",
                title: "ペットも人も、楽しく",
                text: "健康グッズは「義務感」じゃなくていい。犬がワクワクして、飼い主も一緒に笑顔になれる――そんな遊びの延長線上にあるグッズを探しています。",
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                className="bg-white rounded-2xl p-8 shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-4xl font-bold font-heading mb-4" style={{ color: "#F6A54B", opacity: 0.3 }}>
                  {item.num}
                </p>
                <h3 className="text-lg font-bold font-heading mb-3" style={{ color: "#2D2D2D" }}>
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

      <SectionDivider />

      {/* ─── 締めのメッセージ ─── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <Image src="/images/hero-first-meet.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(246,165,75,0.88), rgba(229,139,45,0.92))" }} />
        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
        >
          <PawIcon size={36} color="white" className="mx-auto mb-6 opacity-60" double />
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 leading-tight">
            10年後も、<br />この笑顔のそばにいたい。
          </h2>
          <p className="text-white/80 text-base md:text-lg leading-loose mb-10 max-w-xl mx-auto">
            Woofullが届けるのは、グッズじゃなくて「時間」です。<br />
            愛犬と過ごす、かけがえのない毎日をもっと豊かにするために。
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: "white", color: "#F6A54B" }}
          >
            商品を見てみる
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
