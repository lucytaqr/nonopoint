'use client'

import { useEffect, useState } from 'react'
import { getActiveMenuItems } from '@/actions/order'
import { MenuItem } from '@/types'
import { useCartStore } from '@/store/useCartStore'

export default function PublicMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set())

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function loadMenu() {
      setLoading(true)
      const res = await getActiveMenuItems()
      setLoading(false)

      if (res.success && res.menuItems) {
        setMenuItems(res.menuItems as MenuItem[])
      } else {
        setErrorMsg(res.error || 'Gagal memuat daftar menu.')
      }
    }

    loadMenu()
  }, [])

  const handleAddToCart = (item: MenuItem) => {
    addItem(item)
    setAddedItemIds((prev) => new Set(prev).add(item.id))
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }, 1000)
  }

  // Group menu items by category
  const categories = Array.from(new Set(menuItems.map((item) => item.category || 'Lainnya')))

  return (
    <div className="space-y-8">
      {/* Banner Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          Katalog Menu
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pesan Makanan & Minuman Favoritmu
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Pilih menu kesukaanmu, tambahkan ke keranjang, dan tentukan apakah ingin diantar (Delivery) atau diambil sendiri (Pickup).
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 h-44 animate-pulse space-y-3"
            >
              <div className="h-5 bg-slate-800 rounded w-2/3"></div>
              <div className="h-4 bg-slate-800/60 rounded w-full"></div>
              <div className="h-4 bg-slate-800/60 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-center text-sm">
          {errorMsg}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-slate-900/30 border border-slate-800/60 rounded-3xl space-y-3">
          <div className="text-5xl">🍽️</div>
          <h3 className="text-lg font-bold text-slate-300">Belum Ada Menu Tersedia</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Daftar menu sedang disiapkan oleh admin. Silakan kembali lagi nanti.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => {
            const itemsInCat = menuItems.filter((i) => (i.category || 'Lainnya') === cat)
            return (
              <div key={cat} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  {cat}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {itemsInCat.map((item) => {
                    const isJustAdded = addedItemIds.has(item.id)
                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-amber-500/5 transition-all group"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg whitespace-nowrap">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                          {item.desc && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {item.desc}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                              : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200'
                          }`}
                        >
                          {isJustAdded ? (
                            <>✓ Ditambahkan!</>
                          ) : (
                            <>+ Tambah ke Keranjang</>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
