"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PawIcon } from "@/components/ui/PawIcon";
import { ArrowLeft, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { isDiscountActive, getDiscountedPrice, getRemainingTime } from "@/lib/discount";
import type { Product } from "@/types/database";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: getDiscountedPrice(product),
      image: product.image_url || "/images/concept-brain.png",
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main className="flex-1 pt-24 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <PawIcon size={32} color="#F6A54B" className="opacity-40" />
        </motion.div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-1 pt-24 flex flex-col items-center justify-center gap-4">
        <p style={{ color: "#2D2D2D", opacity: 0.5 }}>商品が見つかりませんでした</p>
        <Link
          href="/products"
          className="text-sm font-medium"
          style={{ color: "#F6A54B" }}
        >
          ← 商品一覧に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* パンくずリスト */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
            style={{ color: "#2D2D2D", opacity: 0.5 }}
          >
            <ArrowLeft size={14} />
            商品一覧に戻る
          </Link>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-14">
          {/* 画像エリア */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {(() => {
              const allImages = [
                product.image_url || "/images/concept-brain.png",
                ...(product.image_urls || []),
              ].filter(Boolean);
              return (
                <div>
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg mb-3">
                    <Image
                      src={allImages[selectedImage] || allImages[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                          style={{
                            border: selectedImage === i ? "2px solid #F6A54B" : "2px solid transparent",
                            opacity: selectedImage === i ? 1 : 0.5,
                          }}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>

          {/* 商品情報エリア */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}
            >
              {product.concept_tag}
            </span>

            <h1
              className="text-2xl md:text-3xl font-bold font-heading mb-4"
              style={{ color: "#2D2D2D" }}
            >
              {product.name}
            </h1>

            {isDiscountActive(product) ? (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {product.discount_percent}%OFF
                  </span>
                  {getRemainingTime(product) && (
                    <span className="text-sm font-bold" style={{ color: "#e53e3e" }}>
                      ⏰ {getRemainingTime(product)}
                    </span>
                  )}
                </div>
                <p className="text-base line-through" style={{ color: "#2D2D2D", opacity: 0.4 }}>
                  ¥{product.sell_price.toLocaleString()}
                </p>
                <p className="text-3xl md:text-4xl font-extrabold font-heading" style={{ color: "#e53e3e" }}>
                  ¥{getDiscountedPrice(product).toLocaleString()}
                  <span className="text-sm font-normal ml-2" style={{ opacity: 0.7 }}>(税込)</span>
                </p>
              </div>
            ) : (
              <p
                className="text-3xl md:text-4xl font-extrabold font-heading mb-6"
                style={{ color: "#2D2D2D" }}
              >
                ¥{product.sell_price.toLocaleString()}
                <span className="text-sm font-normal ml-2" style={{ opacity: 0.5 }}>(税込)</span>
              </p>
            )}

            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "#2D2D2D", opacity: 0.65 }}
            >
              {product.description}
            </p>

            {/* 数量選択 */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                数量
              </span>
              <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "rgba(45,45,45,0.1)" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors"
                  style={{ color: "#2D2D2D" }}
                >
                  −
                </button>
                <span
                  className="w-12 h-10 flex items-center justify-center text-sm font-bold"
                  style={{ color: "#2D2D2D" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors"
                  style={{ color: "#2D2D2D" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* カートに追加ボタン */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 mb-4"
              style={{ backgroundColor: addedToCart ? "#2D2D2D" : "#F6A54B" }}
            >
              {addedToCart ? (
                <>
                  <PawIcon size={18} color="white" />
                  カートに追加しました！
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  カートに追加
                </>
              )}
            </button>

            {/* 安心ポイント */}
            <div className="space-y-3 mt-8 pt-8" style={{ borderTop: "1px solid rgba(45,45,45,0.06)" }}>
              {[
                { icon: Truck, text: "¥5,000以上で送料無料（未満は全国一律¥500）" },
                { icon: Shield, text: "安心の品質保証" },
                { icon: RotateCcw, text: "不良品は到着後7日以内に交換対応" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={16} color="#F6A54B" />
                  <span className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
