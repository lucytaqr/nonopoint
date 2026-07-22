export interface MenuItem {
  id: string
  name: string
  desc: string | null
  price: number
  category: string | null
  is_active: boolean
  created_at: string
}

export interface CartItem {
  menuItem: MenuItem
  qty: number
}

export interface OrderItem {
  id?: string
  order_id?: string
  menu_item_id: string | null
  qty: number
  price_snapshot: number
  name_snapshot: string
}

export interface Order {
  id: string
  order_no: string
  customer_name: string
  phone: string
  method: 'pickup' | 'delivery' | string
  address_lat: number | null
  address_lng: number | null
  address_patokan: string | null
  payment_method: string | null
  payment_status: string
  payment_proof_url: string | null
  status: string
  cancelled: boolean
  late_notified: boolean
  total: number
  created_at: string
  completed_at: string | null
  order_items?: OrderItem[]
}

export interface CreateOrderPayload {
  customer_name: string
  phone: string
  method: 'pickup' | 'delivery'
  address_lat?: number | null
  address_lng?: number | null
  address_patokan?: string | null
  items: {
    menu_item_id: string
    qty: number
    price_snapshot: number
    name_snapshot: string
  }[]
  total: number
}
