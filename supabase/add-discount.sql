ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_start timestamptz;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_end timestamptz;
