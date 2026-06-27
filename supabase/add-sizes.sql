-- 商品テーブルにサイズ選択肢を追加
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT NULL;
