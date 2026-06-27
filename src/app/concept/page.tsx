"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Heart, Brain, Dumbbell, MessageCircle, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const concepts = [
  {
    icon: Brain,
    title: "脳を使う",
    description: "知育・ノーズワークで認知症を予防。考えることで脳が活性化し、シニア期の認知機能低下を防ぎます。",
    image: "/images/concept-brain.png",
    color: "#F6A54B",
  },
  {
    icon: Dumbbell,
    title: "体を動かす",
    description: "適度な運動で筋肉と関節を健やかに。毎日の「楽しい！」が、長く歩ける体をつくります。",
    image: "/images/concept-exercise.png",
    color: "#E58B2D",
  },
  {
    icon: MessageCircle,
    title: "絆を深める",
    description: "コミュニケーションボタンで気持ちを伝え合う。「通じた！」という喜びが、信頼関係を深めます。",
    image: "/images/concept-bond.png",
    color: "#F6A54B",
  },
  {
    icon: Heart,
    title: "長く一緒に",
    description: "遊び・運動・脳トレ。毎日のちいさな積み重ねが、愛犬の健康寿命を伸ばします。",
    image: "/images/concept-longevity.png",
    color: "#E58B2D",
  },
];

export default function ConceptPage() {
  return (
    <main className="flex-1 pt-24 pb-20">
      {/* ヒーロー */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "#FFF8F1" }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <PawIcon size={36} color="#F6A54B" className="mx-auto mb-6 opacity-60" />
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6 leading-relaxed" style={{ color: "#2D2D2D" }}>
            自分で選べないから、<br />私たちが選ぶ。
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg leading-loose" style={{ color: "#2D2D2D", opacity: 0.65 }}>
            犬は自分でおもちゃを選べない。散歩の道具も、遊び方も。<br />
            だからこそ、飼い主が「本当にいいもの」を知ることが大切。<br />
            <span className="font-medium" style={{ color: "#F6A54B" }}>
              Woofullは、愛犬の健康寿命を伸ばすために<br />
              本当に意味のあるグッズだけを届けます。
            </span>
          </p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* 4つのコンセプト */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-2xl md:text-3xl font-bold font-heading text-center mb-4"
          style={{ color: "#2D2D2D" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          4つのコンセプト
        </motion.h2>
        <motion.p
          className="text-center mb-16 max-w-lg mx-auto"
          style={{ color: "#2D2D2D", opacity: 0.6 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          犬と過ごす時間をもっと豊かに。<br />
          毎日の遊び・運動・食事から、愛犬の健康寿命を伸ばすグッズを届けます。
        </motion.p>

        <div className="space-y-16">
          {concepts.map((concept, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={concept.title}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-full md:w-1/2 relative">
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg group">
                    <Image
                      src={concept.image}
                      alt={concept.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className={`absolute ${isEven ? "-bottom-4 -right-4" : "-bottom-4 -left-4"} opacity-15`}>
                    <PawIcon size={48} color={concept.color} />
                  </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                    style={{ backgroundColor: `${concept.color}15` }}
                  >
                    <concept.icon size={18} color={concept.color} />
                    <span className="text-sm font-bold" style={{ color: concept.color }}>{concept.title}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4" style={{ color: "#2D2D2D" }}>
                    {concept.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.65 }}>
                    {concept.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-bold mb-6" style={{ color: "#2D2D2D" }}>
            愛犬の健康寿命を伸ばすグッズを、今すぐチェック。
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "#F6A54B" }}
          >
            商品一覧を見る
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
