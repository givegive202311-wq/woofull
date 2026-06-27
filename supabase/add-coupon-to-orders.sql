-- ordersテーブルにクーポン情報を追加
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code text DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_discount integer DEFAULT 0;

-- クーポン使用回数をインクリメントするRPC関数
CREATE OR REPLACE FUNCTION increment_coupon_used(coupon_code text)
RETURNS void AS $$
  UPDATE coupons SET used_count = used_count + 1 WHERE code = coupon_code;
$$ LANGUAGE sql SECURITY DEFINER;
