"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { Mail, ExternalLink } from "lucide-react";

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line\/|Twitter|TikTok|Snapchat|WeChat|MicroMessenger/i.test(ua);
}

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithLine, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setInApp(isInAppBrowser());
  }, []);

  if (user) {
    router.push("/profile");
    return null;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        setSignupDone(true);
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        router.push("/profile");
      }
    }
    setLoading(false);
  };

  const handleOpenInBrowser = () => {
    const url = window.location.href;
    window.open(url, "_system");
    window.location.href = url;
  };

  if (signupDone) {
    return (
      <main className="flex-1 pt-24 pb-20 flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Mail size={48} color="#F6A54B" className="mx-auto mb-6" />
          <h1 className="text-xl font-bold font-heading mb-4" style={{ color: "#2D2D2D" }}>
            確認メールを送信しました
          </h1>
          <p className="text-sm" style={{ color: "#2D2D2D", opacity: 0.6 }}>
            {email} に確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-20 flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <PawIcon size={36} color="#F6A54B" className="mx-auto mb-4" double />
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>
            {mode === "login" ? "ログイン" : "新規登録"}
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          {/* メール+パスワード（メインに配置） */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors"
              style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
            />
            <input
              type="password"
              placeholder="パスワード（6文字以上）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors"
              style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
            />
            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: "#F6A54B" }}
            >
              {loading ? "処理中..." : mode === "login" ? "ログイン" : "新規登録"}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(45,45,45,0.08)" }} />
            <span className="text-xs" style={{ color: "#2D2D2D", opacity: 0.3 }}>または</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(45,45,45,0.08)" }} />
          </div>

          {/* アプリ内ブラウザの場合 */}
          {inApp ? (
            <div className="space-y-3">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.7 }}>
                  GoogleログインはSafari/Chromeで開く必要があります
                </p>
              </div>
              <button
                onClick={handleOpenInBrowser}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-300 hover:bg-gray-50"
                style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
              >
                <ExternalLink size={16} />
                ブラウザで開いてGoogleログイン
              </button>
            </div>
          ) : (
            <>
              {/* Google */}
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-medium transition-all duration-300 hover:bg-gray-50"
                style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Googleでログイン
              </button>

              {/* LINE */}
              <button
                onClick={signInWithLine}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: "#06C755" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.27 8.846 10.035 9.608.391.084.923.258 1.058.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.248 14.253 24 12.39 24 10.304zM8.281 13.032h-2.64c-.256 0-.464-.208-.464-.464V8.552c0-.256.208-.464.464-.464.256 0 .464.208.464.464v3.552h2.176c.256 0 .464.208.464.464 0 .256-.208.464-.464.464zm1.835-.464c0 .256-.208.464-.464.464-.256 0-.464-.208-.464-.464V8.552c0-.256.208-.464.464-.464.256 0 .464.208.464.464v4.016zm5.258 0c0 .2-.129.377-.321.441-.063.021-.129.032-.192.032-.132 0-.26-.057-.349-.158L12.42 10.2v2.368c0 .256-.208.464-.464.464-.256 0-.464-.208-.464-.464V8.552c0-.2.129-.377.321-.441.063-.021.129-.032.192-.032.132 0 .26.057.349.158l2.092 2.683V8.552c0-.256.208-.464.464-.464.256 0 .464.208.464.464v4.016zm3.392-2.584c.256 0 .464.208.464.464 0 .256-.208.464-.464.464h-2.176v1.12h2.176c.256 0 .464.208.464.464 0 .256-.208.464-.464.464h-2.64c-.256 0-.464-.208-.464-.464V8.552c0-.256.208-.464.464-.464h2.64c.256 0 .464.208.464.464 0 .256-.208.464-.464.464h-2.176v1.12h2.176z"/>
                </svg>
                LINEでログイン
              </button>
            </>
          )}
        </div>

        {/* 切り替え */}
        <p className="text-center mt-6 text-sm" style={{ color: "#2D2D2D", opacity: 0.5 }}>
          {mode === "login" ? "アカウントをお持ちでない方は" : "すでにアカウントをお持ちの方は"}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="ml-1 font-bold underline"
            style={{ color: "#F6A54B" }}
          >
            {mode === "login" ? "新規登録" : "ログイン"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
