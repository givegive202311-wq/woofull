"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/PawIcon";
import { Plus, Trash2, X, Save, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

type Coupon = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_amount: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

type CouponForm = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_amount: number;
  max_uses: string;
  expires_at: string;
};

const emptyForm: CouponForm = {
  code: "",
  discount_type: "fixed",
  discount_value: 0,
  min_amount: 0,
  max_uses: "",
  expires_at: "",
};

const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#F6A54B] transition-colors";
const inputStyle = { borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" };
const labelClass = "text-xs font-bold mb-1 block";
const labelStyle = { color: "#2D2D2D", opacity: 0.6 };

// サービスロールクライアント（クーポン書き込み用）
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminCouponsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    const { data } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!form.code.trim() || !form.discount_value) return;
    setSaving(true);
    setSaveError(null);

    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_amount: form.min_amount || 0,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
    };

    const { error } = await supabaseAdmin.from("coupons").insert(payload);
    if (error) {
      setSaveError(error.message.includes("unique") ? "このコードはすでに使われています" : error.message);
    } else {
      setShowForm(false);
      setForm(emptyForm);
      fetchCoupons();
    }
    setSaving(false);
  }

  async function toggleActive(coupon: Coupon) {
    await supabaseAdmin
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);
    fetchCoupons();
  }

  async function handleDelete(id: string) {
    if (!confirm("このクーポンを削除しますか？")) return;
    await supabaseAdmin.from("coupons").delete().eq("id", id);
    fetchCoupons();
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
      <div className="max-w-4xl mx-auto">
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
            className="px-5 py-2.5 rounded-full text-sm font-bold border transition-all hover:bg-gray-50"
            style={{ borderColor: "rgba(45,45,45,0.1)", color: "#2D2D2D" }}
          >
            注文管理
          </Link>
          <Link
            href="/admin/coupons"
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#F6A54B" }}
          >
            クーポン管理
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#2D2D2D" }}>クーポン管理</h1>
          <button
            onClick={() => { setShowForm(true); setForm(emptyForm); setSaveError(null); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: "#F6A54B" }}
          >
            <Plus size={16} />
            クーポンを作成
          </button>
        </div>

        {/* クーポン一覧 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Tag size={32} color="#F6A54B" className="opacity-30" />
              <p className="text-sm" style={{ color: "#2D2D2D", opacity: 0.4 }}>クーポンがありません</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(246,165,75,0.04)", borderBottom: "1px solid rgba(45,45,45,0.06)" }}>
                  <th className="text-left px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>コード</th>
                  <th className="text-left px-5 py-3 font-bold hidden md:table-cell" style={{ color: "#2D2D2D" }}>割引</th>
                  <th className="text-left px-5 py-3 font-bold hidden md:table-cell" style={{ color: "#2D2D2D" }}>最低購入</th>
                  <th className="text-center px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>使用数</th>
                  <th className="text-left px-5 py-3 font-bold hidden lg:table-cell" style={{ color: "#2D2D2D" }}>期限</th>
                  <th className="text-center px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>状態</th>
                  <th className="text-right px-5 py-3 font-bold" style={{ color: "#2D2D2D" }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                  const isMaxed = coupon.max_uses !== null && coupon.used_count >= coupon.max_uses;
                  return (
                    <tr
                      key={coupon.id}
                      style={{ borderBottom: "1px solid rgba(45,45,45,0.04)", opacity: (!coupon.is_active || isExpired || isMaxed) ? 0.5 : 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="font-mono font-bold text-sm px-2 py-1 rounded-lg" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell font-bold" style={{ color: "#2D2D2D" }}>
                        {coupon.discount_type === "percent"
                          ? `${coupon.discount_value}% OFF`
                          : `¥${coupon.discount_value.toLocaleString()} OFF`}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                        {coupon.min_amount > 0 ? `¥${coupon.min_amount.toLocaleString()}以上` : "なし"}
                      </td>
                      <td className="px-5 py-3 text-center" style={{ color: "#2D2D2D" }}>
                        <span className="font-bold">{coupon.used_count}</span>
                        {coupon.max_uses !== null && (
                          <span style={{ opacity: 0.4 }}> / {coupon.max_uses}</span>
                        )}
                        {isMaxed && (
                          <span className="ml-1 text-xs font-bold text-red-500">上限</span>
                        )}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-xs" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                        {coupon.expires_at
                          ? new Date(coupon.expires_at).toLocaleDateString("ja-JP")
                          : "無期限"}
                        {isExpired && <span className="ml-1 text-red-500 font-bold">期限切れ</span>}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => toggleActive(coupon)} className="flex items-center gap-1 mx-auto transition-opacity hover:opacity-70">
                          {coupon.is_active ? (
                            <>
                              <ToggleRight size={20} color="#1D9E75" />
                              <span className="text-xs font-bold" style={{ color: "#1D9E75" }}>有効</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={20} color="#a0a0a0" />
                              <span className="text-xs font-bold" style={{ color: "#a0a0a0" }}>無効</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => handleDelete(coupon.id)} className="p-2 hover:opacity-50 transition-opacity">
                          <Trash2 size={14} color="#e55" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 新規作成モーダル */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <motion.div
              className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-heading" style={{ color: "#2D2D2D" }}>クーポンを作成</h2>
                <button onClick={() => setShowForm(false)} className="p-1">
                  <X size={20} color="#2D2D2D" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass} style={labelStyle}>クーポンコード *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2024"
                    className={`${inputClass} font-mono font-bold`}
                    style={{ ...inputStyle, color: "#F6A54B" }}
                  />
                  <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>英数字で入力してください（自動で大文字化）</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} style={labelStyle}>割引タイプ *</label>
                    <select
                      value={form.discount_type}
                      onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percent" | "fixed" })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="fixed">固定額（円）</option>
                      <option value="percent">割合（%）</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>
                      {form.discount_type === "percent" ? "割引率（%）" : "割引額（円）"} *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={form.discount_type === "percent" ? 99 : undefined}
                      value={form.discount_value || ""}
                      onChange={(e) => setForm({ ...form, discount_value: parseInt(e.target.value) || 0 })}
                      placeholder={form.discount_type === "percent" ? "10" : "500"}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} style={labelStyle}>最低購入金額（円）</label>
                    <input
                      type="number"
                      min={0}
                      value={form.min_amount || ""}
                      onChange={(e) => setForm({ ...form, min_amount: parseInt(e.target.value) || 0 })}
                      placeholder="2000"
                      className={inputClass}
                      style={inputStyle}
                    />
                    <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>0=制限なし</p>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>最大使用回数</label>
                    <input
                      type="number"
                      min={1}
                      value={form.max_uses}
                      onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                      placeholder="100"
                      className={inputClass}
                      style={inputStyle}
                    />
                    <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>空欄=無制限</p>
                  </div>
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>有効期限</label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <p className="text-[10px] mt-1" style={{ color: "#2D2D2D", opacity: 0.4 }}>空欄=無期限</p>
                </div>

                {saveError && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{saveError}</p>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving || !form.code.trim() || !form.discount_value}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: "#F6A54B" }}
                >
                  <Save size={16} />
                  {saving ? "作成中..." : "作成する"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
