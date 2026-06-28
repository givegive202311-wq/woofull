"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { Plus, Pencil, Trash2, TrendingUp, Search, X, ChevronUp, ChevronDown, ToggleLeft, ToggleRight } from "lucide-react";
import type { Product } from "@/types/database";

type SalesStats = {
  product_id: string;
  sold_count: number;
  revenue: number;
};

type SortKey = "created_at" | "sell_price" | "revenue" | "sold_count";

function SortIcon({ current, k, dir }: { current: SortKey; k: SortKey; dir: "asc" | "desc" }) {
  if (current !== k) return <ChevronDown size={12} style={{ opacity: 0.2 }} />;
  return dir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />;
}

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [salesStats, setSalesStats] = useState<Record<string, SalesStats>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [{ data: products }, { data: stats }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.rpc("get_product_sales_stats"),
    ]);
    setProducts(products || []);
    const statsMap: Record<string, SalesStats> = {};
    (stats || []).forEach((s: SalesStats) => { statsMap[s.product_id] = s; });
    setSalesStats(statsMap);
    setLoading(false);
  }

  async function togglePublished(product: Product) {
    await supabase.from("products").update({ is_published: !product.is_published }).eq("id", product.id);
    fetchAll();
  }

  async function handleDelete(id: string) {
    if (!confirm("この商品を削除しますか？")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchAll();
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

  if (!isAdmin) return null;

  const totalRevenue = products.reduce((sum, p) => sum + (salesStats[p.id]?.revenue || 0), 0);
  const totalSold = products.reduce((sum, p) => sum + (salesStats[p.id]?.sold_count || 0), 0);

  const filtered = products
    .filter((p) => {
      if (statusFilter === "published") return p.is_published;
      if (statusFilter === "draft") return !p.is_published;
      return true;
    })
    .filter((p) =>
      search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.concept_tag?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let av = 0, bv = 0;
      if (sortKey === "created_at") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      } else if (sortKey === "sell_price") {
        av = a.sell_price; bv = b.sell_price;
      } else if (sortKey === "revenue") {
        av = salesStats[a.id]?.revenue || 0; bv = salesStats[b.id]?.revenue || 0;
      } else if (sortKey === "sold_count") {
        av = salesStats[a.id]?.sold_count || 0; bv = salesStats[b.id]?.sold_count || 0;
      }
      return sortDir === "desc" ? bv - av : av - bv;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 管理メニュー */}
        <div className="flex gap-3 mb-8">
          <Link href="/admin" className="px-5 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#F6A54B" }}>
            商品管理
          </Link>
          <Link href="/admin/orders" className="px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:bg-gray-50" style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}>
            注文管理
          </Link>
          <Link href="/admin/coupons" className="px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:bg-gray-50" style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}>
            クーポン管理
          </Link>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold mb-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>商品数</p>
            <p className="text-2xl font-extrabold font-heading" style={{ color: "#2D2D2D" }}>{products.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold mb-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>総販売数</p>
            <p className="text-2xl font-extrabold font-heading" style={{ color: "#2D2D2D" }}>{totalSold}<span className="text-sm font-normal ml-1">個</span></p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold mb-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>総売上</p>
            <p className="text-2xl font-extrabold font-heading" style={{ color: "#F6A54B" }}>¥{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>商品管理</h1>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "#F6A54B" }}
          >
            <Plus size={16} />
            商品を追加
          </Link>
        </div>

        {/* 検索・フィルター */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" color="#2D2D2D" />
            <input
              type="text"
              placeholder="商品名・タグで検索..."
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
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all"
                style={{
                  backgroundColor: statusFilter === s ? "#F6A54B" : "white",
                  color: statusFilter === s ? "white" : "#2D2D2D",
                  borderColor: statusFilter === s ? "#F6A54B" : "rgba(45,45,45,0.1)",
                }}
              >
                {s === "all" ? "すべて" : s === "published" ? "公開" : "非公開"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs mb-3" style={{ color: "#2D2D2D", opacity: 0.4 }}>{filtered.length}件</p>

        {/* 商品一覧テーブル */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(246,165,75,0.04)", borderBottom: "1px solid rgba(45,45,45,0.06)" }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>商品</th>
                <th className="text-right px-5 py-3 font-bold hidden md:table-cell cursor-pointer select-none hover:opacity-70" style={{ color: "#2D2D2D" }} onClick={() => toggleSort("sell_price")}>
                  <div className="flex items-center justify-end gap-1">売価 <SortIcon current={sortKey} k="sell_price" dir={sortDir} /></div>
                </th>
                <th className="text-right px-5 py-3 font-bold hidden md:table-cell" style={{ color: "#2D2D2D" }}>原価</th>
                <th className="text-center px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>状態</th>
                <th className="text-right px-5 py-3 font-bold cursor-pointer select-none hover:opacity-70" style={{ color: "#F6A54B" }} onClick={() => toggleSort("revenue")}>
                  <div className="flex items-center justify-end gap-1"><TrendingUp size={13} />売上 <SortIcon current={sortKey} k="revenue" dir={sortDir} /></div>
                </th>
                <th className="text-right px-5 py-3 font-bold cursor-pointer select-none hover:opacity-70 hidden md:table-cell" style={{ color: "#2D2D2D" }} onClick={() => toggleSort("sold_count")}>
                  <div className="flex items-center justify-end gap-1">販売数 <SortIcon current={sortKey} k="sold_count" dir={sortDir} /></div>
                </th>
                <th className="text-right px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const stats = salesStats[product.id];
                return (
                  <tr
                    key={product.id}
                    style={{ borderBottom: "1px solid rgba(45,45,45,0.04)" }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={product.image_url || "/images/concept-brain.png"} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-[160px] md:max-w-[240px]" style={{ color: "#2D2D2D" }}>{product.name}</p>
                          <p className="text-[10px]" style={{ color: "#F6A54B" }}>{product.concept_tag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-bold hidden md:table-cell" style={{ color: "#2D2D2D" }}>
                      ¥{product.sell_price.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right hidden md:table-cell" style={{ color: "#2D2D2D", opacity: 0.5 }}>
                      ¥{product.cost_price.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => togglePublished(product)}
                        className="flex items-center gap-1 mx-auto transition-opacity hover:opacity-70"
                      >
                        {product.is_published ? (
                          <>
                            <ToggleRight size={22} color="#1D9E75" />
                            <span className="text-xs font-bold" style={{ color: "#1D9E75" }}>公開</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={22} color="#a0a0a0" />
                            <span className="text-xs font-bold" style={{ color: "#a0a0a0" }}>非公開</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {stats ? (
                        <div>
                          <p className="font-bold text-sm" style={{ color: "#F6A54B" }}>¥{stats.revenue.toLocaleString()}</p>
                          <p className="text-[10px]" style={{ color: "#2D2D2D", opacity: 0.4 }}>{stats.sold_count}個</p>
                        </div>
                      ) : (
                        <span style={{ color: "#2D2D2D", opacity: 0.2 }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right hidden md:table-cell" style={{ color: "#2D2D2D" }}>
                      {stats ? (
                        <span className="font-bold text-sm">{stats.sold_count}<span className="text-xs font-normal ml-0.5 opacity-50">個</span></span>
                      ) : (
                        <span style={{ opacity: 0.2 }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`} className="p-2 hover:opacity-50 transition-opacity">
                          <Pencil size={14} color="#2D2D2D" />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:opacity-50 transition-opacity">
                          <Trash2 size={14} color="#e55" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
