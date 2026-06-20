"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { stripePromise } from "@/lib/stripe";
import { PawIcon } from "@/components/ui/PawIcon";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
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
      },
    });

    if (stripeError) {
      setError(stripeError.message || "決済に失敗しました");
      setLoading(false);
    } else {
      clearCart();
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
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice,
        items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [items, totalPrice]);

  if (items.length === 0) {
    return (
      <main className="flex-1 pt-24 pb-20 flex flex-col items-center justify-center gap-6 px-6">
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
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-lg mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity"
          style={{ color: "#2D2D2D", opacity: 0.5 }}
        >
          <ArrowLeft size={14} />
          カートに戻る
        </Link>

        <motion.h1
          className="text-3xl font-bold font-heading mb-2"
          style={{ color: "#2D2D2D" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          お支払い
        </motion.h1>
        <motion.p
          className="mb-8"
          style={{ color: "#2D2D2D", opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          合計: ¥{totalPrice.toLocaleString()}（税込・送料無料）
        </motion.p>

        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
              <CheckoutForm />
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
      </div>
    </main>
  );
}
