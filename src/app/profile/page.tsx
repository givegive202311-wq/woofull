"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { PawIcon } from "@/components/ui/PawIcon";
import { User, ShoppingBag, LogOut, Shield, Package, ChevronDown, ChevronUp } from "lucide-react";

type OrderItem = { name: string; quantity: number; price: number };
type Order = {
  id: string;
  created_at: string;
  total_amount: number;
  fulfillment_status: string;
  items: OrderItem[];
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  not_ordered:           { label: "準備中",       color: "#F6A54B" },
  ordered_from_supplier: { label: "仕入れ発注済み", color: "#3B82F6" },
  shipped:               { label: "発送済み",      color: "#10B981" },
  delivered:             { label: "配達完了",      color: "#6B7280" },
};

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, created_at, total_amount, fulfillment_status, items")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) || []));
  }, [user]);

  if (loading) {
    return (
      <main className="flex-1 pt-32 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <PawIcon size={32} color="#F6A54B" className="opacity-40" />
        </motion.div>
      </main>
    );
  }

  if (!user) { router.push("/login"); return null; }

  const handleSignOut = async () => { await signOut(); router.push("/"); };

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div className="text-center mb-10" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#F6A54B15" }}>
            <User size={28} color="#F6A54B" />
          </div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>マイページ</h1>
          <p className="text-sm mt-1" style={{ color: "#2D2D2D", opacity: 0.5 }}>{user.email}</p>
        </motion.div>

        {/* 購入履歴 */}
        {orders.length > 0 && (
          <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.05 }}>
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>
              <Package size={14} /> 購入履歴
            </h2>
            <div className="space-y-2">
              {orders.map((order) => {
                const status = STATUS_LABEL[order.fulfillment_status] || { label: order.fulfillment_status, color: "#6B7280" };
                const isOpen = openId === order.id;
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left"
                      onClick={() => setOpenId(isOpen ? null : order.id)}
                    >
                      <div>
                        <p className="text-xs font-mono mb-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm font-bold" style={{ color: "#2D2D2D" }}>
                          ¥{order.total_amount.toLocaleString()}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#2D2D2D", opacity: 0.4 }}>
                          {new Date(order.created_at).toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${status.color}18`, color: status.color }}>
                          {status.label}
                        </span>
                        {isOpen ? <ChevronUp size={16} color="#2D2D2D" className="opacity-30" /> : <ChevronDown size={16} color="#2D2D2D" className="opacity-30" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(45,45,45,0.06)" }}>
                        <div className="pt-3 space-y-2">
                          {(order.items as OrderItem[]).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm" style={{ color: "#2D2D2D" }}>
                              <span className="opacity-70">{item.name} × {item.quantity}</span>
                              <span>¥{((item.price || 0) * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <Link href="/products" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <ShoppingBag size={20} color="#F6A54B" />
              <div>
                <p className="text-sm font-bold" style={{ color: "#2D2D2D" }}>商品を見る</p>
                <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.5 }}>お買い物をする</p>
              </div>
            </Link>
          </motion.div>

          {isAdmin && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
              <Link href="/admin" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <Shield size={20} color="#F6A54B" />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#2D2D2D" }}>管理画面</p>
                  <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.5 }}>商品の追加・編集・注文管理</p>
                </div>
              </Link>
            </motion.div>
          )}

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
            <button onClick={handleSignOut} className="w-full flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <LogOut size={20} color="#2D2D2D" className="opacity-40" />
              <p className="text-sm font-medium" style={{ color: "#2D2D2D", opacity: 0.5 }}>ログアウト</p>
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
