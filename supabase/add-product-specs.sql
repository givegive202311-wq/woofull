-- 商品テーブルに在庫数・スペックカラムを追加
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs jsonb DEFAULT NULL;

-- Supabase Storage バケット（images）の作成
-- ※ Supabase管理画面 > Storage > New Bucket > "product-images" (Public) でも作成できます
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージポリシー：誰でも閲覧可
CREATE POLICY "product_images_read" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- ストレージポリシー：ログイン済みユーザーはアップロード可
CREATE POLICY "product_images_upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- ストレージポリシー：ログイン済みユーザーは削除可
CREATE POLICY "product_images_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- 商品ごとの売上集計を返すRPC関数
CREATE OR REPLACE FUNCTION get_product_sales_stats()
RETURNS TABLE (
  product_id text,
  sold_count bigint,
  revenue bigint
) AS $$
  SELECT
    item->>'id' AS product_id,
    SUM((item->>'quantity')::int) AS sold_count,
    SUM((item->>'price')::int * (item->>'quantity')::int) AS revenue
  FROM orders, jsonb_array_elements(items) AS item
  WHERE payment_status = 'paid'
  GROUP BY item->>'id'
$$ LANGUAGE sql SECURITY DEFINER;
