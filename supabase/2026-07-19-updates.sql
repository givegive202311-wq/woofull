-- 2026-07-19 まとめて実行してください（Supabaseダッシュボード → SQL Editor に貼り付けて実行）

-- 1. 商品に「おすすめ表示」フラグを追加（トップページのおすすめカルーセル用）
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_recommended boolean NOT NULL DEFAULT false;

-- 2. 購入履歴（orders）を誤操作や不正で消せないようにする
-- 従来の "admin_orders_all" は FOR ALL（SELECT/INSERT/UPDATE/DELETEすべて許可）だったため、
-- 管理画面のバグや誤操作でも注文が削除できる状態だった。
-- 参照・発送状況の更新のみ許可し、削除はSupabaseダッシュボード（サービスロール）からしかできないようにする。
DROP POLICY IF EXISTS "admin_orders_all" ON orders;
DROP POLICY IF EXISTS "admin_orders_select" ON orders;
DROP POLICY IF EXISTS "admin_orders_update" ON orders;

CREATE POLICY "admin_orders_select" ON orders
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'givegive202311@gmail.com'
  );

CREATE POLICY "admin_orders_update" ON orders
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'givegive202311@gmail.com'
  );

-- INSERTは/api/confirm-orderと/api/webhook（サービスロールキー・RLSを迂回）からのみ行うため、
-- 一般クライアント向けのINSERTポリシーは意図的に用意していません
-- DELETEポリシーも意図的に用意していません（アプリからは誰も削除できません）
