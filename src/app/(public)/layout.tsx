'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { CartDrawer } from '@/components/CartDrawer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = mounted ? getTotalItems() : 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            NONOPOINT
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className={`text-xs sm:text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${
              pathname === '/'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Menu
          </Link>
          <Link
            href="/cek-pesanan"
            className={`text-xs sm:text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${
              pathname === '/cek-pesanan'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cek Pesanan
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10"
          >
            <span>🛒 Keranjang</span>
            {cartCount > 0 && (
              <span className="bg-slate-950 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Nonopoint. All rights reserved.</p>
      </footer>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
