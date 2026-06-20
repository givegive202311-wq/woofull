"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { PawIcon } from "@/components/ui/PawIcon";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="flex-1 pt-24 pb-20 flex flex-col items-center justify-center gap-6 px-6">
        <PawIcon size={48} color="#F6A54B" className="opacity-30" />
        <p className="text-lg font-heading font-bold" style={{ color: "#2D2D2D", opacity: 0.5 }}>
          カートに商品がありません
        </p>
        <Link
          href="/products"
          className="inline-block font-medium px-6 py-3 rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-white"
          style={{ backgroundColor: "#F6A54B" }}
        >
          商品を探す
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-3xl font-bold font-heading mb-10"
          style={{ color: "#2D2D2D" }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          カート
        </motion.h1>

        {/* 商品リスト */}
        <div className="space-y-4 mb-10">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="flex gap-4 md:gap-6 bg-white rounded-2xl p-4 md:p-5 shadow-sm"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {/* 画像 */}
              <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* 情報 */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3
                    className="text-sm md:text-base font-bold font-heading mb-1 truncate hover:opacity-70 transition-opacity"
                    style={{ color: "#2D2D2D" }}
                  >
                    {item.name}
                  </h3>
                </Link>
                <p className="text-base md:text-lg font-extrabold font-heading mb-3" style={{ color: "#2D2D2D" }}>
                  ¥{item.price.toLocaleString()}
                </p>

                <div className="flex items-center justify-between">
                  {/* 数量 */}
                  <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "rgba(45,45,45,0.1)" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={14} color="#2D2D2D" />
                    </button>
                    <span
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                      style={{ color: "#2D2D2D" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} color="#2D2D2D" />
                    </button>
                  </div>

                  {/* 削除 */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:opacity-50 transition-opacity"
                  >
                    <Trash2 size={16} color="#2D2D2D" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 合計・チェックアウト */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>小計</span>
            <span className="text-sm font-bold" style={{ color: "#2D2D2D" }}>
              ¥{totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>送料</span>
            <span className="text-sm font-bold" style={{ color: "#F6A54B" }}>無料</span>
          </div>
          <div
            className="flex items-center justify-between pt-4 mb-8"
            style={{ borderTop: "1px solid rgba(45,45,45,0.06)" }}
          >
            <span className="text-base font-bold" style={{ color: "#2D2D2D" }}>合計</span>
            <span className="text-2xl font-extrabold font-heading" style={{ color: "#2D2D2D" }}>
              ¥{totalPrice.toLocaleString()}
              <span className="text-xs font-normal ml-1" style={{ opacity: 0.5 }}>(税込)</span>
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "#F6A54B" }}
          >
            レジに進む
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
