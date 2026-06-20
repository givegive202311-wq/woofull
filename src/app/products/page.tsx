"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PawIcon } from "@/components/ui/PawIcon";
import type { Product } from "@/types/database";

const tags = ["すべて", "脳トレ", "運動", "コミュニケーション", "お散歩"];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTag, setActiveTag] = useState("すべて");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered =
    activeTag === "すべて"
      ? products
      : products.filter((p) => p.concept_tag === activeTag);

  return (
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-3xl md:text-4xl font-bold font-heading mb-3"
            style={{ color: "#2D2D2D" }}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            商品一覧
          </motion.h1>
          <motion.p
            style={{ color: "#2D2D2D", opacity: 0.5 }}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            愛犬の健康寿命を伸ばすグッズ
          </motion.p>
        </div>

        {/* フィルタータブ */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor: activeTag === tag ? "#F6A54B" : "white",
                color: activeTag === tag ? "white" : "#2D2D2D",
                boxShadow: activeTag === tag ? "0 4px 12px rgba(246,165,75,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* 商品グリッド */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <PawIcon size={32} color="#F6A54B" className="opacity-40" />
            </motion.div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20" style={{ color: "#2D2D2D", opacity: 0.4 }}>
            該当する商品がありません
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image_url || "/images/concept_brain.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <span
                        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2"
                        style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}
                      >
                        {product.concept_tag}
                      </span>
                      <h3
                        className="text-sm md:text-base font-bold font-heading mb-2 line-clamp-2"
                        style={{ color: "#2D2D2D" }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-lg font-extrabold font-heading" style={{ color: "#2D2D2D" }}>
                        ¥{product.sell_price.toLocaleString()}
                        <span className="text-xs font-normal ml-1" style={{ opacity: 0.5 }}>
                          (税込)
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
