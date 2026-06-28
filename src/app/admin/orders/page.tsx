"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { ChevronDown, ChevronUp, Package, Truck, CheckCircle, Clock, X, Download, Search } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types/database";

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "未決済", color: "#a0a0a0", bg: "#f5f5f5" },
  paid: { label: "決済済み", color: "#1D9E75", bg: "#E1F5EE" },
  failed: { label: "決済失敗", color: "#e53e3e", bg: "#FEE2E2" },
};

const fulfillmentLabels: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  not_ordered: { label: "未発注", color: "#a0a0a0", bg: "#f5f5f5", icon: Clock },
  ordered_from_supplier: { label: "仕入先に発注済み", color: "#F6A54B", bg: "#FFF8F1", icon: Package },
  shipped: { label: "発送済み", color: "#3B82F6", bg: "#EFF6FF", icon: Truck },
  delivered: { label: "配達完了", color: "#1D9E75", bg: "#E1F5EE", icon: CheckCircle },
};

export default function AdminOrdersPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"created_at" | "total_amount">("created_at");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateFulfillment(orderId: string, status: string) {
    setUpdatingId(orderId);
    await supabase
      .from("orders")
      .update({ fulfillment_status: status })
      .eq("id", orderId);
    await fetchOrders();
    setUpdatingId(null);
  }

  async function updateNote(orderId: string, note: string) {
    await supabase
      .from("orders")
      .update({ supplier_order_note: note })
      .eq("id", orderId);
  }

  if (authLoading || loading) {
    return (
      <main className="flex-1 pt-32 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <PawIcon size={32} color="#F6A54B" className="opacity-40" />
        </motion.div>
      </main>
    );
  }

  function downloadCSV() {
    const header = ["注文ID", "注文日時", "氏名", "メール", "電話番号", "郵便番号", "住所", "商品", "合計金額", "決済状態", "配送状態", "メモ"];
    const rows = orders.map((o) => {
      const addr = o.shipping_address || {};
      const items = (o.items || []) as Array<{ name: string; quantity: number }>;
      const itemsStr = items.map((i) => `${i.name}×${i.quantity}`).join(" / ");
      return [
        o.id,
        new Date(o.created_at).toLocaleString("ja-JP"),
        o.customer_name,
        o.customer_email,
        addr.phone || "",
        addr.postalCode || "",
        `${addr.prefecture || ""}${addr.city || ""}${addr.address || ""}${addr.building || ""}`,
        itemsStr,
        o.total_amount,
        statusLabels[o.payment_status]?.label || o.payment_status,
        fulfillmentLabels[o.fulfillment_status]?.label || o.fulfillment_status,
        o.supplier_order_note || "",
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });
    const csv = "﻿" + [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `woofull-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isAdmin) return null;

  const filtered = orders
    .filter((o) => paymentFilter === "all" || o.payment_status === paymentFilter)
    .filter((o) => fulfillmentFilter === "all" || o.fulfillment_status === fulfillmentFilter)
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.customer_name?.toLowerCase().includes(q) ||
        o.customer_email?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = sortKey === "created_at" ? new Date(a.created_at).getTime() : (a.total_amount ?? 0);
      const bv = sortKey === "created_at" ? new Date(b.created_at).getTime() : (b.total_amount ?? 0);
      return sortDir === "desc" ? bv - av : av - bv;
    });

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 管理メニュー */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:bg-gray-50"
            style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
          >
            商品管理
          </Link>
          <Link
            href="/admin/orders"
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#F6A54B" }}
          >
            注文管理
          </Link>
          <Link
            href="/admin/coupons"
            className="px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:bg-gray-50"
            style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
          >
            クーポン管理
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>注文管理</h1>
          {orders.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-all hover:bg-gray-50"
              style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
            >
              <Download size={14} />
              CSV出力
            </button>
          )}
        </div>

        {/* 検索・フィルター */}
        <div className="space-y-3 mb-4">
          {/* 検索 */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" color="#2D2D2D" />
            <input
              type="text"
              placeholder="氏名・メール・注文IDで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors bg-white"
              style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60">
                <X size={14} color="#2D2D2D" />
              </button>
            )}
          </div>

          {/* フィルター・ソート */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold mr-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>決済</span>
            {[["all", "すべて"], ["paid", "決済済み"], ["pending", "未決済"], ["failed", "失敗"]].map(([v, l]) => (
              <button key={v} onClick={() => setPaymentFilter(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                style={{ backgroundColor: paymentFilter === v ? "#2D2D2D" : "white", color: paymentFilter === v ? "white" : "#2D2D2D", borderColor: paymentFilter === v ? "#2D2D2D" : "rgba(45,45,45,0.1)" }}>
                {l}
              </button>
            ))}
            <span className="text-xs font-bold ml-2 mr-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>配送</span>
            {[["all", "すべて"], ["not_ordered", "未発注"], ["ordered_from_supplier", "発注済"], ["shipped", "発送済"], ["delivered", "完了"]].map(([v, l]) => (
              <button key={v} onClick={() => setFulfillmentFilter(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                style={{ backgroundColor: fulfillmentFilter === v ? "#F6A54B" : "white", color: fulfillmentFilter === v ? "white" : "#2D2D2D", borderColor: fulfillmentFilter === v ? "#F6A54B" : "rgba(45,45,45,0.1)" }}>
                {l}
              </button>
            ))}
          </div>

          {/* ソート */}
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold mr-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>並び順</span>
            {([["created_at", "注文日時"], ["total_amount", "金額"]] as const).map(([k, l]) => (
              <button key={k}
                onClick={() => { if (sortKey === k) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortKey(k); setSortDir("desc"); } }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                style={{ backgroundColor: sortKey === k ? "#F6A54B" : "white", color: sortKey === k ? "white" : "#2D2D2D", borderColor: sortKey === k ? "#F6A54B" : "rgba(45,45,45,0.1)" }}>
                {l}
                {sortKey === k && (sortDir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs mb-3" style={{ color: "#2D2D2D", opacity: 0.4 }}>{filtered.length}件</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <PawIcon size={48} color="#F6A54B" className="mx-auto mb-4 opacity-30" />
            <p style={{ color: "#2D2D2D", opacity: 0.5 }}>{orders.length === 0 ? "まだ注文がありません" : "条件に合う注文がありません"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const isExpanded = expandedId === order.id;
              const payment = statusLabels[order.payment_status] || statusLabels.pending;
              const fulfillment = fulfillmentLabels[order.fulfillment_status] || fulfillmentLabels.not_ordered;
              const FulfillmentIcon = fulfillment.icon;
              const address = order.shipping_address || {};
              const items = (order.items || []) as Array<{ name: string; price: number; quantity: number }>;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* ヘッダー行 */}
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono" style={{ color: "#2D2D2D", opacity: 0.4 }}>
                          {order.id.slice(0, 8)}...
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ color: payment.color, backgroundColor: payment.bg }}
                        >
                          {payment.label}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ color: fulfillment.color, backgroundColor: fulfillment.bg }}
                        >
                          <FulfillmentIcon size={10} />
                          {fulfillment.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold" style={{ color: "#2D2D2D" }}>
                          {order.customer_name || "名前未設定"}
                        </span>
                        <span className="text-sm font-extrabold" style={{ color: "#2D2D2D" }}>
                          ¥{order.total_amount.toLocaleString()}
                        </span>
                        <span className="text-xs" style={{ color: "#2D2D2D", opacity: 0.4 }}>
                          {new Date(order.created_at).toLocaleString("ja-JP")}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} color="#2D2D2D" /> : <ChevronDown size={16} color="#2D2D2D" />}
                  </button>

                  {/* 詳細 */}
                  {isExpanded && (
                    <motion.div
                      className="px-5 pb-5 space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="h-px" style={{ backgroundColor: "rgba(45,45,45,0.06)" }} />

                      {/* お客様情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold mb-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>お客様情報</p>
                          <div className="text-sm space-y-1" style={{ color: "#2D2D2D" }}>
                            <p>{order.customer_name}</p>
                            <p style={{ opacity: 0.6 }}>{order.customer_email}</p>
                            {address.phone && <p style={{ opacity: 0.6 }}>{address.phone}</p>}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold mb-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>配送先</p>
                          <div className="text-sm" style={{ color: "#2D2D2D", opacity: 0.7 }}>
                            <p>〒{address.postalCode}</p>
                            <p>{address.prefecture}{address.city}{address.address}</p>
                            {address.building && <p>{address.building}</p>}
                          </div>
                        </div>
                      </div>

                      {/* 注文商品 */}
                      <div>
                        <p className="text-xs font-bold mb-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>注文商品</p>
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm" style={{ color: "#2D2D2D" }}>
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-bold">¥{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-2 text-sm font-bold" style={{ borderTop: "1px solid rgba(45,45,45,0.06)", color: "#2D2D2D" }}>
                            <span>合計</span>
                            <span>¥{order.total_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* ステータス変更 */}
                      <div>
                        <p className="text-xs font-bold mb-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>配送ステータスを変更</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(fulfillmentLabels).map(([key, val]) => {
                            const Icon = val.icon;
                            const isCurrent = order.fulfillment_status === key;
                            return (
                              <button
                                key={key}
                                onClick={() => updateFulfillment(order.id, key)}
                                disabled={updatingId === order.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                style={{
                                  backgroundColor: isCurrent ? val.color : val.bg,
                                  color: isCurrent ? "white" : val.color,
                                  border: `1px solid ${isCurrent ? val.color : "transparent"}`,
                                }}
                              >
                                <Icon size={12} />
                                {val.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* メモ */}
                      <div>
                        <p className="text-xs font-bold mb-2" style={{ color: "#2D2D2D", opacity: 0.5 }}>仕入れ・発送メモ</p>
                        <textarea
                          defaultValue={order.supplier_order_note || ""}
                          onBlur={(e) => updateNote(order.id, e.target.value)}
                          placeholder="AliExpressの注文番号、追跡番号などをメモ"
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] resize-none"
                          style={{ borderColor: "rgba(45,45,45,0.1)" }}
                        />
                      </div>

                      {/* Stripe決済ID */}
                      {order.stripe_payment_intent_id && (
                        <p className="text-[10px] font-mono" style={{ color: "#2D2D2D", opacity: 0.3 }}>
                          Stripe: {order.stripe_payment_intent_id}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
