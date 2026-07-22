'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { CheckoutModal } from './CheckoutModal'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQty, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex justify-end">
        <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col p-6 text-slate-100 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🛒 Keranjang Belanja
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                {items.length} item
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <div className="text-4xl">🛍️</div>
                <p className="text-sm">Keranjang Anda masih kosong.</p>
              </div>
            ) : (
              items.map(({ menuItem, qty }) => (
                <div
                  key={menuItem.id}
                  className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-white truncate">
                      {menuItem.name}
                    </h4>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      Rp {menuItem.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg">
                      <button
                        onClick={() => updateQty(menuItem.id, qty - 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(menuItem.id, qty + 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(menuItem.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 text-xs"
                      title="Hapus item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Harga:</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Kosongkan
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10"
                >
                  Lanjut ke Checkout ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false)
          onClose()
        }}
      />
    </>
  )
}
