CREATE TABLE IF NOT EXISTS coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value integer NOT NULL,
  min_amount integer DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能（コード検証のため）
CREATE POLICY "coupons_read_all" ON coupons FOR SELECT USING (true);
-- 管理者のみ作成・更新・削除
CREATE POLICY "coupons_admin_all" ON coupons FOR ALL
  USING (auth.jwt() ->> 'email' = 'givegive202311@gmail.com');

-- テスト用クーポン（1000円OFF・期限なし）
INSERT INTO coupons (code, discount_type, discount_value, min_amount, max_uses)
VALUES ('WOOFULL500', 'fixed', 500, 2000, 100);
