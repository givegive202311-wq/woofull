"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { Mail, ExternalLink } from "lucide-react";

function detectBrowserEnv(): "line" | "other-inapp" | "normal" {
  if (typeof navigator === "undefined") return "normal";
  const ua = navigator.userAgent || "";
  if (/Line\//i.test(ua)) return "line";
  if (/FBAN|FBAV|Instagram|TikTok|Snapchat|WeChat|MicroMessenger|Twitter/i.test(ua)) return "other-inapp";
  return "normal";
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { user, signInWithGoogle, signInWithLine, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "profile";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [browserEnv, setBrowserEnv] = useState<"line" | "other-inapp" | "normal">("normal");

  useEffect(() => {
    setBrowserEnv(detectBrowserEnv());
  }, []);

  if (user) {
    router.push(`/${redirectTo}`);
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
        router.push(`/${redirectTo}`);
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

          {/* ブラウザ環境別に認証ボタンを出し分け */}
          {browserEnv === "line" && (
            /* LINEブラウザ: メールのみ（LINE認証は承認待ち） */
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.7 }}>
                メールアドレスでログインしてください
              </p>
            </div>
          )}

          {browserEnv === "other-inapp" && (
            /* TikTok/Instagram等: メールのみ + ブラウザで開くヒント */
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
          )}

          {browserEnv === "normal" && (
            /* 通常ブラウザ: Google + LINE */
            <>
              <button
                onClick={() => signInWithGoogle(redirectTo)}
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
            </>
          )}

          {/* メールアドレス取得に関する説明 */}
          <p className="text-[10px] leading-relaxed mt-3" style={{ color: "#2D2D2D", opacity: 0.35 }}>
            Google・LINEでログインした場合、メールアドレスを取得します。取得したメールアドレスは、注文確認・配送状況のご連絡に使用し、それ以外の目的では使用しません。詳しくは<a href="/legal/privacy" className="underline">プライバシーポリシー</a>をご覧ください。
          </p>
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
