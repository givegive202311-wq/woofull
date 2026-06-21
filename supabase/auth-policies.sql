-- 管理者用: productsの全操作を許可（メールアドレスで判定）
CREATE POLICY "admin_products_all" ON products
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'givegive202311@gmail.com'
  );

-- 管理者用: ordersの全操作を許可
CREATE POLICY "admin_orders_all" ON orders
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'givegive202311@gmail.com'
  );

-- 一般ユーザー: ordersの自分の注文のみ閲覧可能
CREATE POLICY "user_own_orders" ON orders
  FOR SELECT USING (
    auth.jwt() ->> 'email' = customer_email
  );
