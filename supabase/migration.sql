-- productsテーブル作成
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  concept_tag text NOT NULL,
  cost_price integer NOT NULL DEFAULT 0,
  sell_price integer NOT NULL,
  image_url text NOT NULL DEFAULT '',
  image_urls text[] DEFAULT '{}',
  supplier_url text DEFAULT '',
  stock_status text NOT NULL DEFAULT 'in_stock',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ordersテーブル作成
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  shipping_address jsonb NOT NULL DEFAULT '{}',
  items jsonb NOT NULL DEFAULT '[]',
  total_amount integer NOT NULL,
  stripe_payment_intent_id text,
  payment_status text NOT NULL DEFAULT 'pending',
  fulfillment_status text NOT NULL DEFAULT 'not_ordered',
  supplier_order_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLSポリシー: productsは公開読み取り可能
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_published = true);

-- RLSポリシー: ordersはサービスロールのみ
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 初期商品データ投入
INSERT INTO products (name, slug, description, concept_tag, cost_price, sell_price, image_url, stock_status) VALUES
(
  'にんじん畑ノーズワークマット',
  'carrot-snuffle-mat',
  'にんじん型のフェルトパーツの中におやつを隠して、嗅覚を使って探すノーズワークマット。遊びながら脳を活性化し、認知症予防に効果的。食べるスピードもゆっくりになるので早食い防止にも。',
  '脳トレ',
  600,
  3480,
  '/images/concept_brain.png',
  'in_stock'
),
(
  '録音コミュニケーションボタン',
  'communication-button',
  '飼い主の声を録音して、犬がボタンを押すと再生されるコミュニケーションツール。「ごはん」「おさんぽ」「あそぼ」など、愛犬が自分の気持ちを伝えられるようになります。',
  'コミュニケーション',
  700,
  3980,
  '/images/concept_bond.png',
  'in_stock'
),
(
  '知育パズルフィーダー',
  'puzzle-feeder',
  'スライドやフタを動かしておやつを取り出す知育パズル。難易度を調整できるので、初心者から上級者まで楽しめます。食事の時間が脳トレタイムに変わります。',
  '脳トレ',
  400,
  2480,
  '/images/concept_brain.png',
  'in_stock'
),
(
  '自動ボールランチャー',
  'ball-launcher',
  'ボールを自動で発射するランチャー。犬が自分でボールをセットして遊べるので、お留守番中やひとり遊びにも最適。飛距離は3段階で調整可能。室内でも屋外でも使えます。',
  '運動',
  2200,
  7980,
  '/images/concept_exercise.png',
  'in_stock'
),
(
  'ハンズフリーキャリアバッグ',
  'carrier-bag',
  '両手が自由になるショルダー型キャリアバッグ。小型犬のお散歩や通院時に便利。通気性の良いメッシュ素材で、愛犬も快適に過ごせます。体重8kgまで対応。',
  'お散歩',
  1000,
  4980,
  '/images/concept_exercise.png',
  'in_stock'
);
