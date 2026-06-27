"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const called = useRef(false);

  useEffect(() => {
    if (!paymentIntentId || called.current) return;
    called.current = true;

    fetch("/api/confirm-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId }),
    });
  }, [paymentIntentId]);

  return (
    <main className="flex-1 pt-28 pb-20 flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <CheckCircle size={64} color="#F6A54B" className="mx-auto mb-6" />
        </motion.div>

        <h1
          className="text-2xl md:text-3xl font-bold font-heading mb-4"
          style={{ color: "#2D2D2D" }}
        >
          ご注文ありがとうございます！
        </h1>

        <p className="mb-2 leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.6 }}>
          お支払いが完了しました。
        </p>
        <p className="mb-8 leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.6 }}>
          注文確認メールをお送りしますので、しばらくお待ちください。
        </p>

        <PawIcon size={24} color="#F6A54B" className="mx-auto mb-8 opacity-40" double />

        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="inline-block font-bold px-8 py-3 rounded-full text-white text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "#F6A54B" }}
          >
            もっと商品を見る
          </Link>
          <Link
            href="/"
            className="inline-block text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#2D2D2D", opacity: 0.5 }}
          >
            トップページに戻る
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
