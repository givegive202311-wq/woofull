"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, ChevronRight } from "lucide-react";
import { PawIcon } from "@/components/ui/PawIcon";

type Step = "idle" | "question" | "email" | "done";

export function ShopChat() {
  const [step, setStep] = useState<Step>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  function open() { setStep("question"); }
  function close() {
    setStep("idle");
    setMessage("");
    setEmail("");
  }

  function handleSendMessage() {
    if (!message.trim()) return;
    setStep("email");
  }

  async function handleSubmit() {
    if (!email.trim()) return;
    setSending(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "チャット質問",
        email,
        category: "ショップへの質問",
        message,
      }),
    });
    setSending(false);
    setStep("done");
  }

  return (
    <>
      {/* フローティングボタン */}
      <AnimatePresence>
        {step === "idle" && (
          <motion.button
            onClick={open}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#F6A54B" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={16} />
            ショップに質問する
          </motion.button>
        )}
      </AnimatePresence>

      {/* モーダル */}
      <AnimatePresence>
        {step !== "idle" && (
          <>
            {/* オーバーレイ */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            {/* チャットパネル */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl overflow-hidden md:left-auto md:right-6 md:bottom-6 md:w-96 md:rounded-3xl"
              style={{ maxHeight: "85vh", backgroundColor: "#FFF8F1" }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              {/* ヘッダー */}
              <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#F6A54B" }}>
                <div className="flex items-center gap-2.5">
                  <PawIcon size={20} color="white" />
                  <span className="text-white font-bold text-base">Woofull</span>
                </div>
                <button onClick={close} className="text-white opacity-80 hover:opacity-100">
                  <X size={20} />
                </button>
              </div>

              {/* チャット本文エリア */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4" style={{ minHeight: 200 }}>

                {/* ショップからの案内バブル */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F6A54B" }}>
                    <PawIcon size={14} color="white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed max-w-[80%]" style={{ backgroundColor: "white", color: "#2D2D2D" }}>
                    お気軽にご質問ください！<br />
                    <span style={{ opacity: 0.6 }}>通常1〜2営業日以内にメールでお返事いたします。</span>
                  </div>
                </div>

                {/* ユーザーの質問バブル（email stepで表示） */}
                {(step === "email" || step === "done") && message && (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-none px-4 py-3 text-sm leading-relaxed max-w-[80%] text-white" style={{ backgroundColor: "#F6A54B" }}>
                      {message}
                    </div>
                  </div>
                )}

                {/* メール入力案内バブル */}
                {step === "email" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F6A54B" }}>
                      <PawIcon size={14} color="white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed max-w-[80%]" style={{ backgroundColor: "white", color: "#2D2D2D" }}>
                      ありがとうございます！<br />
                      <span style={{ opacity: 0.6 }}>回答をお送りするメールアドレスを入力してください。</span>
                    </div>
                  </div>
                )}

                {/* 送信完了バブル */}
                {step === "done" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F6A54B" }}>
                      <PawIcon size={14} color="white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed max-w-[80%]" style={{ backgroundColor: "white", color: "#2D2D2D" }}>
                      送信しました！<br />
                      <span style={{ opacity: 0.6 }}><b>{email}</b> 宛に回答をお送りします。しばらくお待ちください🐾</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 入力エリア */}
              {step === "question" && (
                <div className="px-4 pb-6 pt-2 border-t" style={{ borderColor: "rgba(45,45,45,0.06)" }}>
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="メッセージを入力する"
                      rows={2}
                      className="flex-1 px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#F6A54B] resize-none transition-colors"
                      style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D", backgroundColor: "white" }}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                      style={{ backgroundColor: "#F6A54B" }}
                    >
                      <ChevronRight size={18} color="white" />
                    </button>
                  </div>
                  <p className="text-[10px] mt-2 text-center" style={{ color: "#2D2D2D", opacity: 0.35 }}>Enterで送信 / Shift+Enterで改行</p>
                </div>
              )}

              {step === "email" && (
                <div className="px-4 pb-6 pt-2 border-t" style={{ borderColor: "rgba(45,45,45,0.06)" }}>
                  <div className="flex gap-2 items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#F6A54B] transition-colors"
                      style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D", backgroundColor: "white" }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!email.trim() || sending}
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                      style={{ backgroundColor: "#F6A54B" }}
                    >
                      <Send size={16} color="white" />
                    </button>
                  </div>
                </div>
              )}

              {step === "done" && (
                <div className="px-4 pb-6 pt-2 border-t" style={{ borderColor: "rgba(45,45,45,0.06)" }}>
                  <button
                    onClick={close}
                    className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-80"
                    style={{ backgroundColor: "#F6A54B" }}
                  >
                    閉じる
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
