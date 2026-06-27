"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isDiscountActive, getDiscountedPrice } from "@/lib/discount";
import type { Product } from "@/types/database";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const discounted = isDiscountActive(product);
  const price = getDiscountedPrice(product);

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url || "/images/concept-brain.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {discounted && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount_percent}%OFF
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
            {product.concept_tag}
          </span>
          <h3 className="text-xs md:text-sm font-bold font-heading mb-2 line-clamp-2" style={{ color: "#2D2D2D" }}>
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <p className="text-base md:text-lg font-extrabold font-heading" style={{ color: discounted ? "#e53e3e" : "#2D2D2D" }}>
              ¥{price.toLocaleString()}
            </p>
            {discounted && (
              <p className="text-xs line-through" style={{ color: "#2D2D2D", opacity: 0.35 }}>
                ¥{product.sell_price.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: "#2D2D2D", opacity: 0.35 }}>(税込)</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex-1">
      {/* ストーリー型ヒーロースライドショー */}
      <HeroSlideshow />

      {/* ブランドメッセージ */}
      <section className="py-16 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ duration: 0.5 }}>
            <PawIcon size={28} color="#F6A54B" className="mx-auto mb-5 opacity-60" />
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-4 leading-relaxed" style={{ color: "#2D2D2D" }}>
              自分で選べないから、私たちが選ぶ。
            </h2>
            <p className="text-sm md:text-base leading-loose" style={{ color: "#2D2D2D", opacity: 0.65 }}>
              犬は自分でおもちゃを選べない。だからこそ、飼い主が「本当にいいもの」を知ることが大切。
              <br />
              <span className="font-medium" style={{ color: "#F6A54B" }}>Woofullは、愛犬の健康寿命を伸ばすグッズだけを届けます。</span>
            </p>
            <Link href="/concept" className="inline-flex items-center gap-1 mt-4 text-sm font-medium hover:gap-2 transition-all" style={{ color: "#F6A54B" }}>
              Woofullのコンセプトを見る <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* 商品一覧 */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-heading" style={{ color: "#2D2D2D" }}>
            商品一覧
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all duration-300"
            style={{ color: "#F6A54B" }}
          >
            すべて見る <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-2 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <PawIcon size={36} color="#F6A54B" className="mx-auto mb-4 opacity-20" />
            <p style={{ color: "#2D2D2D", opacity: 0.4 }}>商品を準備中です</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      <SectionDivider />

      {/* エモーショナルCTA */}
      <section className="py-20 px-6 pb-24">
        <motion.div
          className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0">
            <Image src="/images/hero-gaze.png" alt="" fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(246,165,75,0.85), rgba(229,139,45,0.9))" }} />
          </div>
          <div className="relative z-10 p-12 md:p-20 text-center text-white">
            <div className="absolute top-8 right-10 opacity-15">
              <PawIcon size={70} color="white" double />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight">
              10年後も、<br />この笑顔のそばに。
            </h2>
            <p className="text-white/85 mb-10 max-w-md mx-auto text-lg leading-relaxed">
              今日の遊びが、明日の健康をつくる。<br />
              Woofullと一緒に、愛犬の未来を変えよう。
            </p>
            <Link
              href="/products"
              className="inline-block font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "white", color: "#2D2D2D" }}
            >
              商品をチェック →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* フッター */}
      <footer className="py-12 px-6" style={{ backgroundColor: "#2D2D2D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <PawIcon size={28} color="#F6A54B" />
            <span className="text-xl font-bold font-heading text-white">Woofull</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-white/70">
            <Link href="/concept" className="hover:text-[#F6A54B] transition-colors">コンセプト</Link>
            <a href="/legal/tokushoho" className="hover:text-[#F6A54B] transition-colors">特定商取引法</a>
            <a href="/legal/privacy" className="hover:text-[#F6A54B] transition-colors">プライバシーポリシー</a>
            <a href="/legal/returns" className="hover:text-[#F6A54B] transition-colors">返品・交換</a>
            <a href="/contact" className="hover:text-[#F6A54B] transition-colors">お問い合わせ</a>
          </nav>
          <p className="text-xs text-white/40">© 2026 Woofull. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
