"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { Heart, Brain, Dumbbell, MessageCircle, Crown, ArrowRight } from "lucide-react";

const rankingProducts = [
  {
    id: 1,
    name: "にんじん畑ノーズワークマット",
    price: 3480,
    tag: "脳トレ",
    image: "/images/concept_brain.png",
    slug: "carrot-snuffle-mat",
  },
  {
    id: 2,
    name: "録音コミュニケーションボタン",
    price: 3980,
    tag: "コミュニケーション",
    image: "/images/concept_bond.png",
    slug: "communication-button",
  },
  {
    id: 3,
    name: "自動ボールランチャー",
    price: 7980,
    tag: "運動",
    image: "/images/concept_exercise.png",
    slug: "ball-launcher",
  },
];

const allProducts = [
  ...rankingProducts,
  {
    id: 4,
    name: "知育パズルフィーダー",
    price: 2480,
    tag: "脳トレ",
    image: "/images/concept_brain.png",
    slug: "puzzle-feeder",
  },
  {
    id: 5,
    name: "ハンズフリーキャリアバッグ",
    price: 4980,
    tag: "お散歩",
    image: "/images/concept_exercise.png",
    slug: "carrier-bag",
  },
];

const concepts = [
  {
    icon: Brain,
    title: "脳を使う",
    description: "知育・ノーズワークで認知症を予防。考えることで脳が活性化し、シニア期の認知機能低下を防ぎます。",
    image: "/images/concept_brain.png",
    color: "#F6A54B",
  },
  {
    icon: Dumbbell,
    title: "体を動かす",
    description: "適度な運動で筋肉と関節を健やかに。毎日の「楽しい！」が、長く歩ける体をつくります。",
    image: "/images/concept_exercise.png",
    color: "#E58B2D",
  },
  {
    icon: MessageCircle,
    title: "絆を深める",
    description: "コミュニケーションボタンで気持ちを伝え合う。「通じた！」という喜びが、信頼関係を深めます。",
    image: "/images/concept_bond.png",
    color: "#F6A54B",
  },
  {
    icon: Heart,
    title: "長く一緒に",
    description: "遊び・運動・脳トレ。毎日のちいさな積み重ねが、愛犬の健康寿命を伸ばします。",
    image: "/images/concept_longevity.png",
    color: "#E58B2D",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProductCard({
  product,
  rank,
}: {
  product: (typeof allProducts)[0];
  rank?: number;
}) {
  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
        whileHover={{ y: -6 }}
      >
        {/* ランキングバッジ */}
        {rank && (
          <div
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              backgroundColor: rank === 1 ? "#F6A54B" : rank === 2 ? "#A0A0A0" : "#C07A3E",
            }}
          >
            {rank}
          </div>
        )}

        {/* 商品画像 */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* 商品情報 */}
        <div className="p-4 md:p-5">
          <span
            className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2"
            style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}
          >
            {product.tag}
          </span>
          <h3
            className="text-sm md:text-base font-bold font-heading mb-2 line-clamp-2"
            style={{ color: "#2D2D2D" }}
          >
            {product.name}
          </h3>
          <p className="text-lg font-extrabold font-heading" style={{ color: "#2D2D2D" }}>
            ¥{product.price.toLocaleString()}
            <span className="text-xs font-normal ml-1" style={{ opacity: 0.5 }}>
              (税込)
            </span>
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* ストーリー型ヒーロースライドショー */}
      <HeroSlideshow />

      {/* ブランドメッセージセクション */}
      <section className="py-24 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <PawIcon size={32} color="#F6A54B" className="mx-auto mb-8 opacity-60" />
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold font-heading leading-relaxed mb-8"
            style={{ color: "#2D2D2D" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            自分で選べないから、
            <br />
            私たちが選ぶ。
          </motion.h2>

          <motion.div
            className="text-base md:text-lg leading-loose"
            style={{ color: "#2D2D2D", opacity: 0.7 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>犬は自分でおもちゃを選べない。</p>
            <p>散歩の道具も、遊び方も。</p>
            <p className="mt-4">
              だからこそ、飼い主が「本当にいいもの」を知ることが大切。
            </p>
            <p className="mt-4 font-medium" style={{ color: "#F6A54B" }}>
              Woofullは、愛犬の健康寿命を伸ばすために
              <br />
              本当に意味のあるグッズだけを届けます。
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* 人気ランキング */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Crown size={24} color="#F6A54B" />
          <h2
            className="text-3xl md:text-4xl font-bold font-heading text-center"
            style={{ color: "#2D2D2D" }}
          >
            人気ランキング
          </h2>
        </motion.div>
        <motion.p
          className="text-center mb-12"
          style={{ color: "#2D2D2D", opacity: 0.5 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          今、いちばん選ばれているグッズ
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {rankingProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} rank={i + 1} />
            </motion.div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* 商品一覧プレビュー */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
            style={{ color: "#2D2D2D" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            商品一覧
          </motion.h2>
          <motion.p
            className="text-center mb-12"
            style={{ color: "#2D2D2D", opacity: 0.5 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            愛犬の健康寿命を伸ばすグッズ
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {allProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-medium text-base tracking-wide transition-all duration-300 hover:gap-3 border-b-2 pb-1"
              style={{ color: "#2D2D2D", borderColor: "#F6A54B" }}
            >
              すべての商品を見る
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* コンセプトセクション（写真付き） */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
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
          犬と過ごす時間をもっと豊かに。
          <br />
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
                    <span className="text-sm font-bold" style={{ color: concept.color }}>
                      {concept.title}
                    </span>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold font-heading mb-4"
                    style={{ color: "#2D2D2D" }}
                  >
                    {concept.title}
                  </h3>
                  <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: "#2D2D2D", opacity: 0.65 }}
                  >
                    {concept.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* エモーショナルCTAセクション */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/slide_03.png"
              alt=""
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(246,165,75,0.85), rgba(229,139,45,0.9))" }}
            />
          </div>

          <div className="relative z-10 p-12 md:p-20 text-center text-white">
            <div className="absolute top-8 right-10 opacity-15">
              <PawIcon size={70} color="white" double />
            </div>

            <motion.h2
              className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              10年後も、
              <br />
              この笑顔のそばに。
            </motion.h2>
            <motion.p
              className="text-white/85 mb-10 max-w-md mx-auto text-lg leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              今日の遊びが、明日の健康をつくる。
              <br />
              Woofullと一緒に、愛犬の未来を変えよう。
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="/products"
                className="inline-block font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: "white", color: "#2D2D2D" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2D2D2D"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#2D2D2D"; }}
              >
                商品をチェック →
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* フッター */}
      <footer className="py-12 px-6" style={{ backgroundColor: "#2D2D2D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <PawIcon size={28} color="#F6A54B" />
            <span className="text-xl font-bold font-heading text-white">
              Woofull
            </span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-white/70">
            <a href="/about" className="hover:text-[#F6A54B] transition-colors">
              ブランドストーリー
            </a>
            <a href="/legal/tokushoho" className="hover:text-[#F6A54B] transition-colors">
              特定商取引法
            </a>
            <a href="/legal/privacy" className="hover:text-[#F6A54B] transition-colors">
              プライバシーポリシー
            </a>
            <a href="/legal/returns" className="hover:text-[#F6A54B] transition-colors">
              返品・交換
            </a>
          </nav>
          <p className="text-xs text-white/40">
            © 2026 Woofull. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
