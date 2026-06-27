"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { PawIcon } from "@/components/ui/PawIcon";
import { Trash2, Minus, Plus, ArrowRight, Truck, Tag, X } from "lucide-react";
import { getShippingFee, getShippingLabel, getAmountUntilFreeShipping } from "@/lib/shipping";

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

type Coupon = { code: string; discount_type: "percent" | "fixed"; discount_value: number };

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    const res = await fetch("/api/validate-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal: totalPrice }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCouponError(data.error);
    } else {
      setAppliedCoupon(data.coupon);
      setCouponDiscount(data.discount);
      localStorage.setItem("woofull_coupon", JSON.stringify({ code: data.coupon.code, discount: data.discount }));
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError(null);
    localStorage.removeItem("woofull_coupon");
  };

  const finalTotal = Math.max(0, totalPrice - couponDiscount) + getShippingFee(Math.max(0, totalPrice - couponDiscount));

  if (items.length === 0) {
    return (
      <main className="flex-1 pt-32 pb-20 flex flex-col items-center justify-center gap-6 px-6">
        <PawIcon size={48} color="#F6A54B" className="opacity-30" />
        <p className="text-lg font-heading font-bold" style={{ color: "#2D2D2D", opacity: 0.5 }}>カートに商品がありません</p>
        <Link href="/products" className="inline-block font-medium px-6 py-3 rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-white" style={{ backgroundColor: "#F6A54B" }}>
          商品を探す
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1 className="text-3xl font-bold font-heading mb-10" style={{ color: "#2D2D2D" }} initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5 }}>
          カート
        </motion.h1>

        {/* 商品リスト */}
        <div className="space-y-4 mb-10">
          {items.map((item, i) => (
            <motion.div key={item.cartKey} className="flex gap-4 md:gap-6 bg-white rounded-2xl p-4 md:p-5 shadow-sm" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="text-sm md:text-base font-bold font-heading mb-1 truncate hover:opacity-70 transition-opacity" style={{ color: "#2D2D2D" }}>{item.name}</h3>
                </Link>
                {item.size && (
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
                    サイズ: {item.size}
                  </span>
                )}
                <p className="text-base md:text-lg font-extrabold font-heading mb-3" style={{ color: "#2D2D2D" }}>¥{item.price.toLocaleString()}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "rgba(45,45,45,0.1)" }}>
                    <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus size={14} color="#2D2D2D" /></button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ color: "#2D2D2D" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus size={14} color="#2D2D2D" /></button>
                  </div>
                  <button onClick={() => removeItem(item.cartKey)} className="p-2 hover:opacity-50 transition-opacity"><Trash2 size={16} color="#2D2D2D" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 合計・チェックアウト */}
        <motion.div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>

          {/* クーポン入力 */}
          <div className="mb-6">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#F0FFF4" }}>
                <div className="flex items-center gap-2">
                  <Tag size={14} color="#1D9E75" />
                  <span className="text-sm font-bold" style={{ color: "#1D9E75" }}>
                    {appliedCoupon.code} — ¥{couponDiscount.toLocaleString()}割引
                  </span>
                </div>
                <button onClick={removeCoupon}><X size={14} color="#1D9E75" /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="クーポンコード"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors"
                  style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}
                >
                  {couponLoading ? "確認中..." : "適用"}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
          </div>

          {getAmountUntilFreeShipping(totalPrice - couponDiscount) && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: "#FFF8F1" }}>
              <Truck size={14} color="#F6A54B" />
              <span className="text-xs" style={{ color: "#F6A54B" }}>
                あと¥{getAmountUntilFreeShipping(totalPrice - couponDiscount)!.toLocaleString()}で送料無料！
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>小計</span>
            <span className="text-sm font-bold" style={{ color: "#2D2D2D" }}>¥{totalPrice.toLocaleString()}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#1D9E75" }}>クーポン割引</span>
              <span className="text-sm font-bold" style={{ color: "#1D9E75" }}>-¥{couponDiscount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>送料</span>
            <span className="text-sm font-bold" style={{ color: getShippingFee(totalPrice - couponDiscount) === 0 ? "#1D9E75" : "#2D2D2D" }}>
              {getShippingLabel(totalPrice - couponDiscount)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-4 mb-8" style={{ borderTop: "1px solid rgba(45,45,45,0.06)" }}>
            <span className="text-base font-bold" style={{ color: "#2D2D2D" }}>合計</span>
            <span className="text-2xl font-extrabold font-heading" style={{ color: "#2D2D2D" }}>
              ¥{finalTotal.toLocaleString()}
              <span className="text-xs font-normal ml-1" style={{ opacity: 0.5 }}>(税込)</span>
            </span>
          </div>

          <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: "#F6A54B" }}>
            レジに進む
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
