"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ArrowRight, ChevronLeft, ChevronRight, Crown, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isDiscountActive, getDiscountedPrice } from "@/lib/discount";
import type { Product } from "@/types/database";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// おすすめ商品が読み込まれるまでの間だけ表示するフォールバック画像
const fallbackHeroImages = [
  "/images/hero-first-meet.png",
  "/images/hero-morning-walk.png",
  "/images/hero-gaze.png",
  "/images/hero-cozy.png",
];

function ProductCard({ product, rank }: { product: Product; rank?: number }) {
  const discounted = isDiscountActive(product);
  const price = getDiscountedPrice(product);

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex-shrink-0"
        style={{ width: "160px" }}
        whileHover={{ y: -4 }}
      >
        <div className="relative w-full aspect-square overflow-hidden">
          {rank && (
            <div
              className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: rank === 1 ? "#F6A54B" : rank === 2 ? "#A0A0A0" : rank === 3 ? "#C07A3E" : "rgba(45,45,45,0.5)" }}
            >
              {rank}
            </div>
          )}
          <Image
            src={product.image_url || "/images/concept-brain.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {discounted && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {product.discount_percent}%OFF
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-[10px] font-bold mb-1" style={{ color: "#F6A54B" }}>{product.concept_tag}</p>
          <h3 className="text-xs font-bold font-heading mb-1.5 line-clamp-2" style={{ color: "#2D2D2D" }}>
            {product.name}
          </h3>
          {discounted && (
            <p className="text-[10px] line-through mb-0.5" style={{ color: "#2D2D2D", opacity: 0.35 }}>
              ¥{product.sell_price.toLocaleString()}
            </p>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-extrabold font-heading" style={{ color: discounted ? "#e53e3e" : "#2D2D2D" }}>
              ¥{price.toLocaleString()}
            </p>
            {discounted && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: "#e53e3e" }}>
                {product.discount_percent}%OFF
              </span>
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
  const [rankedProducts, setRankedProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // ヒーロー自動スライド：おすすめ商品が読み込めたらそちらを、まだなら仮画像を使う
  const heroSlideCount = recommendedProducts.length > 0 ? recommendedProducts.length : fallbackHeroImages.length;
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlideCount);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlideCount]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: productsData }, { data: statsData }] = await Promise.all([
        supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false }),
        supabase.rpc("get_product_sales_stats"),
      ]);

      const allProducts = productsData || [];
      setProducts(allProducts);

      // 販売数でソートしてランキング作成
      const statsMap: Record<string, number> = {};
      (statsData || []).forEach((s: { product_id: string; sold_count: number }) => {
        statsMap[s.product_id] = s.sold_count;
      });

      const ranked = [...allProducts].sort((a, b) => (statsMap[b.id] || 0) - (statsMap[a.id] || 0));
      setRankedProducts(ranked);
      // スケルトン→実データの切り替えでスクロール位置がずれることがあるため、明示的に先頭へ戻す
      requestAnimationFrame(() => {
        carouselRef.current?.scrollTo({ left: 0 });
      });

      // おすすめ商品：管理画面でON設定した商品を優先。
      // まだ何もONにしていない場合は、コンセプトタグごとに1点ずつ選び
      // 「どんなジャンルを扱っているか」が一目で伝わるようにする
      const manuallyRecommended = allProducts.filter((p) => p.is_recommended);
      if (manuallyRecommended.length > 0) {
        setRecommendedProducts(manuallyRecommended);
      } else {
        const seenTags = new Set<string>();
        const oneEach: Product[] = [];
        for (const p of allProducts) {
          if (!seenTags.has(p.concept_tag)) {
            seenTags.add(p.concept_tag);
            oneEach.push(p);
          }
        }
        setRecommendedProducts(oneEach);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  function scrollCarousel(dir: "left" | "right") {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  }

  return (
    <main className="flex-1 pt-16 md:pt-20">

      {/* ─── ヒーロー＝おすすめ商品カルーセル（キャッチコピー×商品画像の左右分割）─── */}
      <section className="relative w-full overflow-hidden" style={{ backgroundColor: "#FFF8F1", minHeight: "50vh" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-8 md:gap-12" style={{ minHeight: "50vh" }}>
          {/* 左：キャッチコピー */}
          <div className="flex-1 py-14 md:py-0 text-center md:text-left order-2 md:order-1">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: "#F6A54B15", color: "#F6A54B", letterSpacing: "0.15em" }}
            >
              <Sparkles size={12} />
              おすすめ商品
            </span>

            {recommendedProducts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-2xl md:text-4xl font-bold font-heading mb-3 leading-tight" style={{ color: "#2D2D2D" }}>
                    {recommendedProducts[heroIndex]?.name}
                  </h1>
                  <p className="text-lg md:text-xl font-extrabold font-heading mb-8" style={{ color: "#F6A54B" }}>
                    ¥{recommendedProducts[heroIndex] ? getDiscountedPrice(recommendedProducts[heroIndex]).toLocaleString() : ""}
                    <span className="text-xs font-normal ml-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>(税込)</span>
                  </p>
                  <Link
                    href={`/products/${recommendedProducts[heroIndex]?.slug}`}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    style={{ backgroundColor: "#F6A54B", color: "white" }}
                  >
                    この商品を見る
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 leading-tight" style={{ color: "#2D2D2D" }}>
                  愛犬の健康寿命を
                  <br />
                  <span style={{ color: "#F6A54B" }}>伸ばす</span>グッズ
                </h1>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  style={{ backgroundColor: "#F6A54B", color: "white" }}
                >
                  商品をすべて見る
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* 右：商品画像 */}
          <div className="flex-1 w-full order-1 md:order-2">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Image
                    src={
                      recommendedProducts.length > 0
                        ? recommendedProducts[heroIndex]?.image_url || fallbackHeroImages[0]
                        : fallbackHeroImages[heroIndex % fallbackHeroImages.length]
                    }
                    alt={recommendedProducts[heroIndex]?.name || ""}
                    fill
                    className="object-cover"
                    priority={heroIndex === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* スライド操作：矢印＋カウンター（右下） */}
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-full" style={{ backgroundColor: "rgba(45,45,45,0.55)", backdropFilter: "blur(4px)" }}>
                <button
                  onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlideCount) % heroSlideCount)}
                  aria-label="前の商品"
                  className="text-white/90 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-white text-xs font-bold tabular-nums">
                  {heroIndex + 1} / {heroSlideCount}
                </span>
                <button
                  onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlideCount)}
                  aria-label="次の商品"
                  className="text-white/90 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── ランキングカルーセル ─────────────────────────────── */}
      <section className="py-10 px-0" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="px-6 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown size={20} color="#F6A54B" />
            <h2 className="text-xl font-bold font-heading" style={{ color: "#2D2D2D" }}>人気ランキング</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:bg-white"
              style={{ borderColor: "rgba(45,45,45,0.1)" }}
            >
              <ChevronLeft size={16} color="#2D2D2D" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:bg-white"
              style={{ borderColor: "rgba(45,45,45,0.1)" }}
            >
              <ChevronRight size={16} color="#2D2D2D" />
            </button>
          </div>
        </div>

        {/* スクロールコンテナ */}
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto pb-2 px-6"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden animate-pulse" style={{ scrollSnapAlign: "start" }}>
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))
            : rankedProducts.map((product, i) => (
                <div key={product.id} style={{ scrollSnapAlign: "start" }}>
                  <ProductCard product={product} rank={i + 1} />
                </div>
              ))}
        </div>
      </section>

      <SectionDivider />

      {/* ─── 全商品グリッド ──────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>すべての商品</h2>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all duration-300" style={{ color: "#F6A54B" }}>
            一覧ページへ <ArrowRight size={14} />
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
              <Link key={product.id} href={`/products/${product.slug}`}>
                <motion.div
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image_url || "/images/concept-brain.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isDiscountActive(product) && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
                    {isDiscountActive(product) && (
                      <p className="text-xs line-through mb-0.5" style={{ color: "#2D2D2D", opacity: 0.35 }}>
                        ¥{product.sell_price.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-base md:text-lg font-extrabold font-heading" style={{ color: isDiscountActive(product) ? "#e53e3e" : "#2D2D2D" }}>
                        ¥{getDiscountedPrice(product).toLocaleString()}
                      </p>
                      {isDiscountActive(product) && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: "#e53e3e" }}>
                          {product.discount_percent}%OFF
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: "#2D2D2D", opacity: 0.35 }}>(税込)</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SectionDivider />

      {/* ─── ブランドメッセージ ───────────────────────────────── */}
      <section className="py-14 px-6" style={{ backgroundColor: "#FFF8F1" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ duration: 0.5 }}>
            <PawIcon size={24} color="#F6A54B" className="mx-auto mb-4 opacity-60" />
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-3 leading-relaxed" style={{ color: "#2D2D2D" }}>
              自分で選べないから、私たちが選ぶ。
            </h2>
            <p className="text-sm leading-loose mb-4" style={{ color: "#2D2D2D", opacity: 0.65 }}>
              犬は自分でおもちゃを選べない。だからこそ、飼い主が「本当にいいもの」を知ることが大切。
              <br />
              <span className="font-medium" style={{ color: "#F6A54B" }}>Woofullは、愛犬の健康寿命を伸ばすグッズだけを届けます。</span>
            </p>
            <Link href="/concept" className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all" style={{ color: "#F6A54B" }}>
              Woofullのコンセプトを見る <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── エモーショナルCTA ────────────────────────────────── */}
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
              今日の遊びが、明日の健康をつくる。<br />Woofullと一緒に、愛犬の未来を変えよう。
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
            <Link href="/guides" className="hover:text-[#F6A54B] transition-colors">お悩み相談室</Link>
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
