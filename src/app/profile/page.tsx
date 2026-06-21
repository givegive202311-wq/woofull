"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { User, ShoppingBag, LogOut, Shield } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();

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

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#F6A54B15" }}
          >
            <User size={28} color="#F6A54B" />
          </div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>
            マイページ
          </h1>
          <p className="text-sm mt-1" style={{ color: "#2D2D2D", opacity: 0.5 }}>
            {user.email}
          </p>
        </motion.div>

        <div className="space-y-3">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/products"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <ShoppingBag size={20} color="#F6A54B" />
              <div>
                <p className="text-sm font-bold" style={{ color: "#2D2D2D" }}>商品を見る</p>
                <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.5 }}>お買い物をする</p>
              </div>
            </Link>
          </motion.div>

          {isAdmin && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/admin"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <Shield size={20} color="#F6A54B" />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#2D2D2D" }}>管理画面</p>
                  <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.5 }}>商品の追加・編集・注文管理</p>
                </div>
              </Link>
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <LogOut size={20} color="#2D2D2D" className="opacity-40" />
              <p className="text-sm font-medium" style={{ color: "#2D2D2D", opacity: 0.5 }}>
                ログアウト
              </p>
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
