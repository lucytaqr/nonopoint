'use server'

import { supabase } from '@/lib/supabase'
import { CreateOrderPayload, Order } from '@/types'

export async function submitOrder(payload: CreateOrderPayload) {
  try {
    if (!payload.customer_name || !payload.phone || payload.items.length === 0) {
      return { success: false, error: 'Nama, nomor HP, dan item pesanan wajib diisi.' }
    }

    if (payload.method === 'delivery') {
      if (!payload.address_lat || !payload.address_lng) {
        return { success: false, error: 'Lokasi GPS wajib diakses untuk metode pengiriman (delivery).' }
      }
      if (!payload.address_patokan || payload.address_patokan.trim() === '') {
        return { success: false, error: 'Patokan alamat wajib diisi untuk metode pengiriman (delivery).' }
      }
    }

    // Insert order into `orders` table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: payload.customer_name,
        phone: payload.phone,
        method: payload.method,
        address_lat: payload.address_lat || null,
        address_lng: payload.address_lng || null,
        address_patokan: payload.address_patokan || null,
        total: payload.total,
        order_no: '', // Will be populated automatically by DB BEFORE INSERT trigger `trigger_generate_order_no`
      })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error('Error inserting order:', orderError)
      return { success: false, error: orderError?.message || 'Gagal membuat pesanan.' }
    }

    // Insert items into `order_items` table
    const orderItemsToInsert = payload.items.map((item) => ({
      order_id: orderData.id,
      menu_item_id: item.menu_item_id,
      qty: item.qty,
      price_snapshot: item.price_snapshot,
      name_snapshot: item.name_snapshot,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)

    if (itemsError) {
      console.error('Error inserting order items:', itemsError)
      return { success: false, error: 'Pesanan dibuat tetapi gagal menyimpan rincian item.' }
    }

    return {
      success: true,
      order: orderData as Order,
    }
  } catch (err: any) {
    console.error('Unexpected order action error:', err)
    return { success: false, error: err?.message || 'Terjadi kesalahan tidak terduga.' }
  }
}

export async function getOrdersByPhone(phone: string) {
  try {
    if (!phone || phone.trim() === '') {
      return { success: false, error: 'Nomor HP tidak boleh kosong.' }
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('phone', phone.trim())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return { success: false, error: 'Gagal mengambil data pesanan.' }
    }

    return { success: true, orders: orders as Order[] }
  } catch (err: any) {
    console.error('Unexpected error fetching orders:', err)
    return { success: false, error: 'Terjadi kesalahan sistem saat mengambil pesanan.' }
  }
}

export async function getActiveMenuItems() {
  try {
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })

    if (error) {
      console.error('Error fetching menu items:', error)
      return { success: false, error: 'Gagal mengambil daftar menu.' }
    }

    return { success: true, menuItems }
  } catch (err: any) {
    console.error('Unexpected error fetching menu:', err)
    return { success: false, error: 'Gagal memuat menu.' }
  }
}
