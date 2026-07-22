import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, MenuItem } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (menuItemId: string) => void
  updateQty: (menuItemId: string, qty: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menuItem) => {
        const currentItems = get().items
        const existing = currentItems.find((i) => i.menuItem.id === menuItem.id)
        if (existing) {
          set({
            items: currentItems.map((i) =>
              i.menuItem.id === menuItem.id ? { ...i, qty: i.qty + 1 } : i
            ),
          })
        } else {
          set({ items: [...currentItems, { menuItem, qty: 1 }] })
        }
      },
      removeItem: (menuItemId) => {
        set({ items: get().items.filter((i) => i.menuItem.id !== menuItemId) })
      },
      updateQty: (menuItemId, qty) => {
        if (qty <= 0) {
          get().removeItem(menuItemId)
        } else {
          set({
            items: get().items.map((i) =>
              i.menuItem.id === menuItemId ? { ...i, qty } : i
            ),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.menuItem.price * item.qty,
          0
        )
      },
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0)
      },
    }),
    {
      name: 'nonopoint-cart-storage',
    }
  )
)
