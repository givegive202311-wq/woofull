export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export type ProductSpec = {
  label: string
  value: string
}

type ProductRow = {
  id: string
  name: string
  slug: string
  description: string
  concept_tag: string
  cost_price: number
  sell_price: number
  image_url: string
  image_urls: string[]
  supplier_url: string
  stock_status: 'in_stock' | 'out_of_stock' | 'preorder'
  stock_quantity: number | null
  is_published: boolean
  detail_content: string
  specs: ProductSpec[] | null
  discount_percent: number
  discount_start: string | null
  discount_end: string | null
  created_at: string
  updated_at: string
}

type OrderRow = {
  id: string
  customer_email: string
  customer_name: string
  shipping_address: Record<string, string>
  items: OrderItem[]
  total_amount: number
  stripe_payment_intent_id: string
  payment_status: 'pending' | 'paid' | 'failed'
  fulfillment_status: 'not_ordered' | 'ordered_from_supplier' | 'shipped' | 'delivered'
  supplier_order_note: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProductRow, 'id' | 'created_at'>>
      }
      orders: {
        Row: OrderRow
        Insert: Omit<OrderRow, 'id' | 'created_at'>
        Update: Partial<Omit<OrderRow, 'id' | 'created_at'>>
      }
    }
  }
}

export type Product = ProductRow
export type Order = OrderRow
