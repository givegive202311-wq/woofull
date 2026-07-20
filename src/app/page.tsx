import { supabase } from "@/lib/supabase";
import { HomeClient } from "./HomeClient";
import type { Product } from "@/types/database";

// 管理画面での商品追加・編集が最短1分でサイトに反映されるようにする
// （完全な静的化だと再デプロイまで反映されないため）
export const revalidate = 60;

export default async function Home() {
  const [{ data: productsData }, { data: statsData }] = await Promise.all([
    supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false }),
    supabase.rpc("get_product_sales_stats"),
  ]);

  const products: Product[] = productsData || [];

  // 販売数でソートしてランキング作成
  const statsMap: Record<string, number> = {};
  (statsData || []).forEach((s: { product_id: string; sold_count: number }) => {
    statsMap[s.product_id] = s.sold_count;
  });
  const rankedProducts = [...products].sort((a, b) => (statsMap[b.id] || 0) - (statsMap[a.id] || 0));

  // おすすめ商品：管理画面でON設定した商品を優先。
  // まだ何もONにしていない場合は、コンセプトタグごとに1点ずつ選び
  // 「どんなジャンルを扱っているか」が一目で伝わるようにする
  const manuallyRecommended = products.filter((p) => p.is_recommended);
  let recommendedProducts: Product[];
  if (manuallyRecommended.length > 0) {
    recommendedProducts = manuallyRecommended;
  } else {
    const seenTags = new Set<string>();
    const oneEach: Product[] = [];
    for (const p of products) {
      if (!seenTags.has(p.concept_tag)) {
        seenTags.add(p.concept_tag);
        oneEach.push(p);
      }
    }
    recommendedProducts = oneEach;
  }

  return (
    <HomeClient products={products} rankedProducts={rankedProducts} recommendedProducts={recommendedProducts} />
  );
}
