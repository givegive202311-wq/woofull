"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import {
  ArrowLeft, Save, Trash2, Plus, X, Upload, GripVertical,
  ImageIcon, Tag, DollarSign, BarChart2, FileText, Settings
} from "lucide-react";
import type { Product, ProductSpec } from "@/types/database";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  concept_tag: string;
  cost_price: number;
  sell_price: number;
  image_url: string;
  image_urls: string[];
  supplier_url: string;
  detail_content: string;
  stock_status: string;
  stock_quantity: string;
  is_published: boolean;
  discount_percent: number;
  discount_start: string;
  discount_end: string;
  specs: ProductSpec[];
  sizes: string[];
  newSize: string;
};

const conceptTags = ["脳トレ", "運動", "コミュニケーション", "お散歩", "リラックス"];

const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors";
const inputStyle = { borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" };
const labelClass = "text-xs font-bold mb-1.5 block";
const labelStyle = { color: "#2D2D2D", opacity: 0.55 };

type SalesStats = { sold_count: number; revenue: number };

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";

  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "images" | "specs" | "detail" | "pricing">("basic");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    concept_tag: "脳トレ",
    cost_price: 0,
    sell_price: 0,
    image_url: "",
    image_urls: [],
    supplier_url: "",
    detail_content: "",
    stock_status: "in_stock",
    stock_quantity: "",
    is_published: true,
    discount_percent: 0,
    discount_start: "",
    discount_end: "",
    specs: [],
    sizes: [],
    newSize: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push("/login");
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    if (isNew) return;
    fetchProduct();
    fetchStats();
  }, [id]);

  async function fetchProduct() {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (!data) { router.push("/admin"); return; }
    setProduct(data);
    setForm({
      name: data.name,
      slug: data.slug,
      description: data.description,
      concept_tag: data.concept_tag,
      cost_price: data.cost_price,
      sell_price: data.sell_price,
      image_url: data.image_url || "",
      image_urls: data.image_urls || [],
      supplier_url: data.supplier_url || "",
      detail_content: data.detail_content || "",
      stock_status: data.stock_status,
      stock_quantity: data.stock_quantity != null ? String(data.stock_quantity) : "",
      is_published: data.is_published,
      discount_percent: data.discount_percent || 0,
      discount_start: data.discount_start ? data.discount_start.slice(0, 16) : "",
      discount_end: data.discount_end ? data.discount_end.slice(0, 16) : "",
      specs: data.specs || [],
      sizes: data.sizes || [],
      newSize: "",
    });
    setLoading(false);
  }

  async function fetchStats() {
    const { data } = await supabase.rpc("get_product_sales_stats");
    const found = (data || []).find((s: { product_id: string } & SalesStats) => s.product_id === id);
    if (found) setStats(found);
  }

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { setUploading(false); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm((prev) => ({ ...prev, image_url: url }));
  }

  async function handleSubImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, url] }));
  }

  function removeSubImage(index: number) {
    setForm((prev) => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
  }

  function addSpec() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { label: "", value: "" }] }));
  }

  function updateSpec(index: number, field: "label" | "value", val: string) {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: val };
      return { ...prev, specs };
    });
  }

  function removeSpec(index: number) {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { newSize, ...formData } = form;
    const payload = {
      ...formData,
      stock_quantity: form.stock_quantity !== "" ? parseInt(form.stock_quantity) : null,
      specs: form.specs.filter((s) => s.label.trim()),
      sizes: form.sizes.length > 0 ? form.sizes : null,
      discount_start: form.discount_start || null,
      discount_end: form.discount_end || null,
      updated_at: new Date().toISOString(),
    };
    if (isNew) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { setSaveError(error.message); setSaving(false); return; }
      router.push("/admin");
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", id);
      if (error) { setSaveError(error.message); setSaving(false); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
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

  const tabs = [
    { key: "basic", label: "基本情報", icon: Tag },
    { key: "images", label: "画像", icon: ImageIcon },
    { key: "specs", label: "スペック", icon: FileText },
    { key: "detail", label: "詳細", icon: FileText },
    { key: "pricing", label: "価格・在庫", icon: DollarSign },
  ] as const;

  return (
    <main className="flex-1 pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: "#2D2D2D", opacity: 0.5 }}>
            <ArrowLeft size={14} />
            商品一覧へ
          </Link>
          {!isNew && stats && (
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-[10px] font-bold" style={{ color: "#2D2D2D", opacity: 0.4 }}>販売数</p>
                <p className="text-lg font-extrabold font-heading" style={{ color: "#2D2D2D" }}>{stats.sold_count}<span className="text-xs font-normal ml-0.5">個</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold" style={{ color: "#2D2D2D", opacity: 0.4 }}>売上</p>
                <p className="text-lg font-extrabold font-heading" style={{ color: "#F6A54B" }}>¥{stats.revenue.toLocaleString()}</p>
              </div>
              <BarChart2 size={28} color="#F6A54B" className="opacity-30" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold font-heading mb-6" style={{ color: "#2D2D2D" }}>
          {isNew ? "商品を追加" : form.name || "商品を編集"}
        </h1>

        {/* タブ */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                backgroundColor: activeTab === key ? "#F6A54B" : "rgba(45,45,45,0.06)",
                color: activeTab === key ? "white" : "#2D2D2D",
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-5">

          {/* 基本情報タブ */}
          {activeTab === "basic" && (
            <>
              <div>
                <label className={labelClass} style={labelStyle}>商品名 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: isNew ? slugify(e.target.value) : form.slug })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="例：知育パズル ワンちゃん用"
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>スラッグ（URL） *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="inu-puzzle"
                />
                <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.35 }}>
                  URL: woofull.vercel.app/products/{form.slug}
                </p>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>短い説明文</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  placeholder="商品一覧・OGPに表示される短い説明（100文字程度）"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>コンセプトタグ</label>
                  <select
                    value={form.concept_tag}
                    onChange={(e) => setForm({ ...form, concept_tag: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  >
                    {conceptTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>公開設定</label>
                  <select
                    value={form.is_published ? "true" : "false"}
                    onChange={(e) => setForm({ ...form, is_published: e.target.value === "true" })}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="true">公開</option>
                    <option value="false">非公開（下書き）</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>仕入れ元URL</label>
                <input
                  type="url"
                  value={form.supplier_url}
                  onChange={(e) => setForm({ ...form, supplier_url: e.target.value })}
                  placeholder="https://www.aliexpress.com/item/..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* 画像タブ */}
          {activeTab === "images" && (
            <>
              <div>
                <label className={labelClass} style={labelStyle}>メイン画像</label>
                {form.image_url && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden mb-3">
                    <Image src={form.image_url} alt="" fill className="object-cover" />
                    <button
                      onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                    >
                      <X size={12} color="white" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(45,45,45,0.1)", color: "#F6A54B" }}>
                    <Upload size={14} />
                    {uploading ? "アップロード中..." : "画像をアップロード"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                  </label>
                </div>
                <div className="mt-3">
                  <label className={labelClass} style={labelStyle}>またはURLを入力</label>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://..."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(45,45,45,0.06)", paddingTop: "20px" }}>
                <label className={labelClass} style={labelStyle}>サブ画像（複数・ギャラリー表示）</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.image_urls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        onClick={() => removeSubImage(i)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                      >
                        <X size={12} color="white" />
                      </button>
                      <div className="absolute bottom-1 left-1 text-[9px] text-white bg-black/40 rounded px-1">{i + 1}</div>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors gap-1" style={{ borderColor: "rgba(45,45,45,0.15)" }}>
                    <Upload size={16} color="#F6A54B" />
                    <span className="text-[10px]" style={{ color: "#2D2D2D", opacity: 0.4 }}>追加</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleSubImageUpload} />
                  </label>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>URLで追加</label>
                  <div className="flex gap-2">
                    <input
                      id="sub-image-url"
                      type="text"
                      placeholder="https://..."
                      className={`${inputClass} flex-1`}
                      style={inputStyle}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById("sub-image-url") as HTMLInputElement;
                        if (input.value.trim()) {
                          setForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, input.value.trim()] }));
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold"
                      style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}
                    >
                      追加
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* スペックタブ */}
          {activeTab === "specs" && (
            <>
              {/* サイズ選択肢 */}
              <div className="pb-5 mb-5" style={{ borderBottom: "1px solid rgba(45,45,45,0.06)" }}>
                <p className="text-xs font-bold mb-3" style={{ color: "#2D2D2D", opacity: 0.55 }}>サイズ選択肢</p>
                <p className="text-xs mb-3" style={{ color: "#2D2D2D", opacity: 0.4 }}>設定すると商品ページにサイズ選択ボタンが表示されます</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.sizes.map((size, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-bold" style={{ borderColor: "#F6A54B", color: "#F6A54B", backgroundColor: "#FFF8F1" }}>
                      {size}
                      <button onClick={() => setForm((prev) => ({ ...prev, sizes: prev.sizes.filter((_, si) => si !== i) }))} className="hover:opacity-50">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.newSize}
                    onChange={(e) => setForm((prev) => ({ ...prev, newSize: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && form.newSize.trim()) {
                        e.preventDefault();
                        setForm((prev) => ({ ...prev, sizes: [...prev.sizes, prev.newSize.trim()], newSize: "" }));
                      }
                    }}
                    placeholder="S / M / L / XL など"
                    className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                    style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
                  />
                  <button
                    onClick={() => {
                      if (form.newSize.trim()) {
                        setForm((prev) => ({ ...prev, sizes: [...prev.sizes, prev.newSize.trim()], newSize: "" }));
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}
                  >
                    追加
                  </button>
                </div>
                <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.35 }}>Enterまたは追加ボタンで登録</p>
              </div>

              <p className="text-sm" style={{ color: "#2D2D2D", opacity: 0.5 }}>
                商品詳細ページのスペック表に表示されます（素材、サイズ、重量など）
              </p>
              <div className="space-y-2">
                {form.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <GripVertical size={14} color="#2D2D2D" className="opacity-20 flex-shrink-0" />
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => updateSpec(i, "label", e.target.value)}
                      placeholder="項目名（例：素材）"
                      className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                      style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                      placeholder="値（例：ABS樹脂）"
                      className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:border-[#F6A54B]"
                      style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
                    />
                    <button onClick={() => removeSpec(i)} className="p-1.5 hover:opacity-50 transition-opacity flex-shrink-0">
                      <Trash2 size={13} color="#e55" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSpec}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:bg-gray-50"
                style={{ borderColor: "rgba(45,45,45,0.1)", color: "#F6A54B" }}
              >
                <Plus size={14} />
                行を追加
              </button>
              <p className="text-[10px]" style={{ color: "#2D2D2D", opacity: 0.35 }}>
                例：素材 → ABS樹脂 / サイズ → 15 × 10 × 5 cm / 対象犬種 → 全犬種対応
              </p>
            </>
          )}

          {/* 詳細コンテンツタブ */}
          {activeTab === "detail" && (
            <>
              <p className="text-sm" style={{ color: "#2D2D2D", opacity: 0.5 }}>
                Markdownで記述できます。商品詳細ページのタブ内に表示されます。
              </p>
              <textarea
                value={form.detail_content}
                onChange={(e) => setForm({ ...form, detail_content: e.target.value })}
                rows={20}
                placeholder={"## 商品の特徴\n\n- ポイント1\n- ポイント2\n\n## 使い方\n\n1. ステップ1\n2. ステップ2\n\n## 注意事項\n\n> 必ずご確認ください"}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#F6A54B] resize-y font-mono"
                style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
              />
              <p className="text-[10px]" style={{ color: "#2D2D2D", opacity: 0.35 }}>
                ## 見出し2 / ### 見出し3 / - リスト / **太字** / &gt; 引用
              </p>
            </>
          )}

          {/* 価格・在庫タブ */}
          {activeTab === "pricing" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>売価（円） *</label>
                  <input
                    type="number"
                    value={form.sell_price || ""}
                    onChange={(e) => setForm({ ...form, sell_price: parseInt(e.target.value) || 0 })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>原価（円）</label>
                  <input
                    type="number"
                    value={form.cost_price || ""}
                    onChange={(e) => setForm({ ...form, cost_price: parseInt(e.target.value) || 0 })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              {form.sell_price > 0 && form.cost_price > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F6A54B08" }}>
                  <div>
                    <p className="text-[10px]" style={{ color: "#2D2D2D", opacity: 0.4 }}>粗利</p>
                    <p className="text-sm font-bold" style={{ color: "#1D9E75" }}>¥{(form.sell_price - form.cost_price).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: "#2D2D2D", opacity: 0.4 }}>利益率</p>
                    <p className="text-sm font-bold" style={{ color: "#1D9E75" }}>
                      {Math.round((form.sell_price - form.cost_price) / form.sell_price * 100)}%
                    </p>
                  </div>
                </div>
              )}

              <div style={{ borderTop: "1px solid rgba(45,45,45,0.06)", paddingTop: "20px" }}>
                <p className="text-xs font-bold mb-3" style={{ color: "#2D2D2D", opacity: 0.55 }}>在庫管理</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}>在庫状態</label>
                    <select
                      value={form.stock_status}
                      onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="in_stock">在庫あり</option>
                      <option value="out_of_stock">在庫なし</option>
                      <option value="preorder">予約受付中</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>在庫数（任意）</label>
                    <input
                      type="number"
                      min={0}
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                      placeholder="空欄=管理しない"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(45,45,45,0.06)", paddingTop: "20px" }}>
                <p className="text-xs font-bold mb-3" style={{ color: "#e53e3e" }}>期間限定割引</p>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass} style={labelStyle}>割引率（%）</label>
                    <input
                      type="number" min={0} max={99}
                      value={form.discount_percent || ""}
                      onChange={(e) => setForm({ ...form, discount_percent: parseInt(e.target.value) || 0 })}
                      placeholder="0（割引なし）"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} style={labelStyle}>開始日時</label>
                      <input type="datetime-local" value={form.discount_start} onChange={(e) => setForm({ ...form, discount_start: e.target.value })} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>終了日時</label>
                      <input type="datetime-local" value={form.discount_end} onChange={(e) => setForm({ ...form, discount_end: e.target.value })} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  {form.discount_percent > 0 && form.sell_price > 0 && (
                    <p className="text-sm font-bold" style={{ color: "#e53e3e" }}>
                      割引後: ¥{Math.round(form.sell_price * (1 - form.discount_percent / 100)).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {saveError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{saveError}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.slug || !form.sell_price}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:shadow-lg disabled:opacity-50"
            style={{ backgroundColor: saved ? "#1D9E75" : "#F6A54B" }}
          >
            <Save size={16} />
            {saving ? "保存中..." : saved ? "保存しました！" : isNew ? "商品を作成する" : "変更を保存する"}
          </button>
        </div>
      </div>
    </main>
  );
}
