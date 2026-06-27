"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { PawIcon } from "@/components/ui/PawIcon";
import { Send, CheckCircle } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors";
const inputStyle = { borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" };

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("商品について");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, category, message }),
    });

    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <main className="flex-1 pt-32 pb-20 flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle size={48} color="#F6A54B" className="mx-auto mb-6" />
          <h1 className="text-xl font-bold font-heading mb-4" style={{ color: "#2D2D2D" }}>
            お問い合わせを受け付けました
          </h1>
          <p className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>
            内容を確認の上、2〜3営業日以内にご連絡いたします。
          </p>
          <PawIcon size={20} color="#F6A54B" className="mx-auto mt-8 opacity-30" double />
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold font-heading" style={{ color: "#2D2D2D" }}>
            お問い合わせ
          </h1>
          <p className="text-sm mt-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>
            ご質問・ご要望はお気軽にどうぞ
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>
              お名前 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>
              メールアドレス *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>
              お問い合わせ種別
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              <option>商品について</option>
              <option>注文・配送について</option>
              <option>返品・交換について</option>
              <option>その他</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>
              お問い合わせ内容 *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: "#F6A54B" }}
          >
            <Send size={16} />
            {sending ? "送信中..." : "送信する"}
          </button>
        </motion.form>
      </div>
    </main>
  );
}
