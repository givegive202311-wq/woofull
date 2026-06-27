"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { stripePromise } from "@/lib/stripe";
import { PawIcon } from "@/components/ui/PawIcon";
import { getShippingFee, getShippingLabel } from "@/lib/shipping";
import { ArrowLeft, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";

type ShippingInfo = {
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  building: string;
};

const emptyShipping: ShippingInfo = {
  name: "",
  email: "",
  phone: "",
  postalCode: "",
  prefecture: "",
  city: "",
  building: "",
};

const prefectures = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors";
const inputStyle = { borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" };
const labelClass = "text-xs font-bold mb-1 block";
const labelStyle = { color: "#2D2D2D", opacity: 0.6 };

function CheckoutForm({ shipping }: { shipping: ShippingInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: shipping.name,
            email: shipping.email,
            phone: shipping.phone,
            address: {
              country: "JP",
              postal_code: shipping.postalCode,
              state: shipping.prefecture,
              city: shipping.prefecture,
              line1: shipping.city,
              line2: shipping.building,
            },
          },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || "決済に失敗しました");
      setLoading(false);
    } else {
      clearCart();
      localStorage.removeItem("woofull_coupon");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#F6A54B" }}
      >
        {loading ? "処理中..." : "お支払いを確定する"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingInfo>(emptyShipping);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [postalLoading, setPostalLoading] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=checkout");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const saved = localStorage.getItem("woofull_shipping");
    if (saved) setShipping((prev) => ({ ...prev, ...JSON.parse(saved) }));
    const savedCoupon = localStorage.getItem("woofull_coupon");
    if (savedCoupon) {
      const { code, discount } = JSON.parse(savedCoupon);
      setCouponCode(code);
      setCouponDiscount(discount);
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      setShipping((prev) => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 || step !== "payment" || clientSecret) return;

    const discountedSubtotal = Math.max(0, totalPrice - couponDiscount);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: discountedSubtotal + getShippingFee(discountedSubtotal),
        items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
        shipping,
        couponCode,
        couponDiscount,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [items, totalPrice, step, shipping]);

  const lookupPostalCode = async () => {
    const code = shipping.postalCode.replace("-", "");
    if (code.length !== 7) return;
    setPostalLoading(true);
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`);
      const data = await res.json();
      if (data.results) {
        const result = data.results[0];
        setShipping((prev) => ({
          ...prev,
          prefecture: result.address1,
          city: result.address2 + result.address3,
        }));
      }
    } catch {}
    setPostalLoading(false);
  };

  const isShippingValid =
    shipping.name && shipping.email && shipping.phone &&
    shipping.postalCode && shipping.prefecture && shipping.city;

  if (items.length === 0) {
    return (
      <main className="flex-1 pt-32 pb-20 flex flex-col items-center justify-center gap-6 px-6">
        <PawIcon size={48} color="#F6A54B" className="opacity-30" />
        <p className="text-lg font-heading font-bold" style={{ color: "#2D2D2D", opacity: 0.5 }}>
          カートが空です
        </p>
        <Link
          href="/products"
          className="inline-block font-medium px-6 py-3 rounded-full text-sm text-white transition-all duration-300 hover:shadow-lg"
          style={{ backgroundColor: "#F6A54B" }}
        >
          商品を探す
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-lg mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity"
          style={{ color: "#2D2D2D", opacity: 0.5 }}
        >
          <ArrowLeft size={14} />
          カートに戻る
        </Link>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#F6A54B" }}
            >
              1
            </div>
            <span className="text-sm font-bold" style={{ color: "#2D2D2D" }}>配送先</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: step === "payment" ? "#F6A54B" : "rgba(45,45,45,0.1)" }} />
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: step === "payment" ? "#F6A54B" : "rgba(45,45,45,0.08)",
                color: step === "payment" ? "white" : "rgba(45,45,45,0.3)",
              }}
            >
              2
            </div>
            <span className="text-sm font-bold" style={{ color: "#2D2D2D", opacity: step === "payment" ? 1 : 0.3 }}>
              お支払い
            </span>
          </div>
        </div>

        {/* Step 1: 配送先入力 */}
        {step === "shipping" && (
          <motion.div
            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Truck size={18} color="#F6A54B" />
              <h2 className="text-lg font-bold font-heading" style={{ color: "#2D2D2D" }}>
                配送先情報
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>お名前 *</label>
                <input
                  type="text"
                  value={shipping.name}
                  onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                  placeholder="山田 太郎"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>メールアドレス *</label>
                <input
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="example@email.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>電話番号 *</label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  placeholder="090-1234-5678"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>郵便番号 *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    placeholder="123-4567"
                    maxLength={8}
                    className={`${inputClass} flex-1`}
                    style={inputStyle}
                    onBlur={lookupPostalCode}
                  />
                  <button
                    type="button"
                    onClick={lookupPostalCode}
                    disabled={postalLoading}
                    className="px-4 py-2 rounded-xl border text-xs font-medium transition-all hover:bg-gray-50 disabled:opacity-50 flex-shrink-0"
                    style={{ borderColor: "rgba(45,45,45,0.1)", color: "#F6A54B" }}
                  >
                    {postalLoading ? "検索中..." : "住所検索"}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>都道府県 *</label>
                <select
                  value={shipping.prefecture}
                  onChange={(e) => setShipping({ ...shipping, prefecture: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">選択してください</option>
                  {prefectures.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>市区町村・番地 *</label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  placeholder="渋谷区神南1-2-3"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>建物名・部屋番号</label>
                <input
                  type="text"
                  value={shipping.building}
                  onChange={(e) => setShipping({ ...shipping, building: e.target.value })}
                  placeholder="◯◯マンション 101号室"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    localStorage.setItem("woofull_shipping", JSON.stringify(shipping));
                    setStep("payment");
                  }}
                  disabled={!isShippingValid}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#F6A54B" }}
                >
                  お支払いへ進む
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: 決済 */}
        {step === "payment" && (
          <>
            {/* 配送先サマリー */}
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: "#2D2D2D", opacity: 0.5 }}>配送先</span>
                <button
                  onClick={() => { setStep("shipping"); setClientSecret(null); }}
                  className="text-xs font-medium"
                  style={{ color: "#F6A54B" }}
                >
                  変更
                </button>
              </div>
              <p className="text-sm" style={{ color: "#2D2D2D" }}>
                {shipping.name}　〒{shipping.postalCode}
              </p>
              <p className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                {shipping.prefecture}{shipping.city}
                {shipping.building && ` ${shipping.building}`}
              </p>
            </motion.div>

            {/* 合計 */}
            <motion.p
              className="text-right mb-4 text-sm"
              style={{ color: "#2D2D2D", opacity: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            >
              合計: ¥{(totalPrice + getShippingFee(totalPrice)).toLocaleString()}（税込・送料{getShippingLabel(totalPrice)}）
            </motion.p>

            <motion.div
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#F6A54B",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <CheckoutForm shipping={shipping} />
                </Elements>
              ) : (
                <div className="flex justify-center py-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <PawIcon size={28} color="#F6A54B" className="opacity-40" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
