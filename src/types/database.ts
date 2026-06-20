export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
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
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

export type OrderItem = {
  product_id: string
  name: string
  price: number
  quantity: number
}
