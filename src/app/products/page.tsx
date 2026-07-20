import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ProductsClient } from "./ProductsClient";

// 管理画面での商品追加・編集が最短1分でサイトに反映されるようにする
export const revalidate = 60;

export const metadata: Metadata = {
  title: "商品一覧",
  description: "愛犬の健康寿命を伸ばすグッズ。脳トレ・運動・コミュニケーション・お散歩まわりのアイテムをWoofullが厳選してお届けします。",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return <ProductsClient products={products || []} />;
}
