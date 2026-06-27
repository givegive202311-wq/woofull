"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import type { Product } from "@/types/database";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  concept_tag: string;
  cost_price: number;
  sell_price: number;
  image_url: string;
  supplier_url: string;
  detail_content: string;
  stock_status: string;
  is_published: boolean;
  discount_percent: number;
  discount_start: string;
  discount_end: string;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  concept_tag: "脳トレ",
  cost_price: 0,
  sell_price: 0,
  image_url: "",
  supplier_url: "",
  detail_content: "",
  stock_status: "in_stock",
  is_published: true,
  discount_percent: 0,
  discount_start: "",
  discount_end: "",
};

const conceptTags = ["脳トレ", "運動", "コミュニケーション", "お散歩", "リラックス"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      concept_tag: product.concept_tag,
      cost_price: product.cost_price,
      sell_price: product.sell_price,
      image_url: product.image_url,
      supplier_url: product.supplier_url || "",
      detail_content: product.detail_content || "",
      stock_status: product.stock_status,
      is_published: product.is_published,
      discount_percent: product.discount_percent || 0,
      discount_start: product.discount_start ? product.discount_start.slice(0, 16) : "",
      discount_end: product.discount_end ? product.discount_end.slice(0, 16) : "",
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);

    if (editingId) {
      await supabase.from("products").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editingId);
    } else {
      await supabase.from("products").insert(form);
    }

    setSaving(false);
    setShowForm(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("この商品を削除しますか？")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  if (authLoading || loading) {
    return (
      <main className="flex-1 pt-24 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <PawIcon size={32} color="#F6A54B" className="opacity-40" />
        </motion.div>
      </main>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 管理メニュー */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#F6A54B" }}
          >
            商品管理
          </Link>
          <Link
            href="/admin/orders"
            className="px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:bg-gray-50"
            style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>
            商品管理
          </h1>
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "#F6A54B" }}
          >
            <Plus size={16} />
            商品を追加
          </button>
        </div>

        {/* 商品一覧テーブル */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(246,165,75,0.04)", borderBottom: "1px solid rgba(45,45,45,0.06)" }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>商品</th>
                <th className="text-left px-5 py-3 font-bold hidden md:table-cell" style={{ color: "#2D2D2D" }}>タグ</th>
                <th className="text-right px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>売価</th>
                <th className="text-right px-5 py-3 font-bold hidden md:table-cell" style={{ color: "#2D2D2D" }}>原価</th>
                <th className="text-center px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>状態</th>
                <th className="text-right px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
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
                      <span className="font-medium truncate max-w-[200px]" style={{ color: "#2D2D2D" }}>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
                      {product.concept_tag}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold" style={{ color: "#2D2D2D" }}>
                    ¥{product.sell_price.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right hidden md:table-cell" style={{ color: "#2D2D2D", opacity: 0.5 }}>
                    ¥{product.cost_price.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.is_published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {product.is_published ? "公開" : "非公開"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="p-2 hover:opacity-50 transition-opacity">
                        <Pencil size={14} color="#2D2D2D" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:opacity-50 transition-opacity">
                        <Trash2 size={14} color="#e55" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 編集モーダル */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <motion.div
              className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-heading" style={{ color: "#2D2D2D" }}>
                  {editingId ? "商品を編集" : "商品を追加"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1">
                  <X size={20} color="#2D2D2D" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>商品名</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                    style={{ borderColor: "rgba(45,45,45,0.1)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>スラッグ（URL）</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                    style={{ borderColor: "rgba(45,45,45,0.1)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>説明文</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] resize-none"
                    style={{ borderColor: "rgba(45,45,45,0.1)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>コンセプトタグ</label>
                    <select
                      value={form.concept_tag}
                      onChange={(e) => setForm({ ...form, concept_tag: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                      style={{ borderColor: "rgba(45,45,45,0.1)" }}
                    >
                      {conceptTags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>在庫状態</label>
                    <select
                      value={form.stock_status}
                      onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                      style={{ borderColor: "rgba(45,45,45,0.1)" }}
                    >
                      <option value="in_stock">在庫あり</option>
                      <option value="out_of_stock">在庫なし</option>
                      <option value="preorder">予約受付中</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>売価（円）</label>
                    <input
                      type="number"
                      value={form.sell_price}
                      onChange={(e) => setForm({ ...form, sell_price: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                      style={{ borderColor: "rgba(45,45,45,0.1)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>原価（円）</label>
                    <input
                      type="number"
                      value={form.cost_price}
                      onChange={(e) => setForm({ ...form, cost_price: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                      style={{ borderColor: "rgba(45,45,45,0.1)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>画像URL</label>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="/images/xxx.png"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                    style={{ borderColor: "rgba(45,45,45,0.1)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>仕入れ元URL</label>
                  <input
                    type="url"
                    value={form.supplier_url}
                    onChange={(e) => setForm({ ...form, supplier_url: e.target.value })}
                    placeholder="https://www.aliexpress.com/item/..."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                    style={{ borderColor: "rgba(45,45,45,0.1)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                    商品詳細コンテンツ（マークダウン）
                  </label>
                  <textarea
                    value={form.detail_content}
                    onChange={(e) => setForm({ ...form, detail_content: e.target.value })}
                    rows={10}
                    placeholder={"## 商品の特徴\n\n- ポイント1\n- ポイント2\n\n## 使い方\n\n1. ステップ1\n2. ステップ2"}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] resize-y font-mono"
                    style={{ borderColor: "rgba(45,45,45,0.1)" }}
                  />
                  <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.35 }}>
                    ## 見出し、- リスト、**太字**、&gt; 引用 が使えます
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 accent-[#F6A54B]"
                  />
                  <label className="text-sm" style={{ color: "#2D2D2D" }}>公開する</label>
                </div>

                {/* 期間限定割引 */}
                <div className="pt-4 mt-4" style={{ borderTop: "1px solid rgba(45,45,45,0.06)" }}>
                  <p className="text-xs font-bold mb-3" style={{ color: "#e53e3e" }}>期間限定割引</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>割引率（%）</label>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={form.discount_percent}
                        onChange={(e) => setForm({ ...form, discount_percent: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#e53e3e]"
                        style={{ borderColor: "rgba(45,45,45,0.1)" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>開始日時</label>
                        <input
                          type="datetime-local"
                          value={form.discount_start}
                          onChange={(e) => setForm({ ...form, discount_start: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#e53e3e]"
                          style={{ borderColor: "rgba(45,45,45,0.1)" }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold mb-1 block" style={{ color: "#2D2D2D", opacity: 0.6 }}>終了日時</label>
                        <input
                          type="datetime-local"
                          value={form.discount_end}
                          onChange={(e) => setForm({ ...form, discount_end: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#e53e3e]"
                          style={{ borderColor: "rgba(45,45,45,0.1)" }}
                        />
                      </div>
                    </div>
                    {form.discount_percent > 0 && form.sell_price > 0 && (
                      <p className="text-xs" style={{ color: "#e53e3e" }}>
                        割引後価格: ¥{Math.round(form.sell_price * (1 - form.discount_percent / 100)).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.slug || !form.sell_price}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: "#F6A54B" }}
                >
                  <Save size={16} />
                  {saving ? "保存中..." : "保存する"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
