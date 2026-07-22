'use client'

import { useState } from 'react'
import { getOrdersByPhone } from '@/actions/order'
import { Order } from '@/types'

export default function CheckOrderPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!phone.trim()) {
      setErrorMsg('Masukkan nomor HP Anda.')
      return
    }

    setLoading(true)
    setHasSearched(true)
    const res = await getOrdersByPhone(phone.trim())
    setLoading(false)

    if (res.success && res.orders) {
      setOrders(res.orders)
    } else {
      setErrorMsg(res.error || 'Gagal mencari pesanan.')
      setOrders([])
    }
  }

  const getStatusBadge = (status: string, cancelled: boolean) => {
    if (cancelled) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
          Dibatalkan
        </span>
      )
    }

    switch (status.toLowerCase()) {
      case 'new':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Pesanan Baru
          </span>
        )
      case 'processing':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
            Sedang Diproses
          </span>
        )
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            Selesai
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-full">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Lacak Status Pesanan</h1>
        <p className="text-slate-400 text-sm">
          Masukkan nomor HP yang Anda gunakan saat checkout untuk melihat riwayat pesanan.
        </p>
      </div>

      {/* Form Search */}
      <form
        onSubmit={handleSearch}
        className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3"
      >
        <input
          type="tel"
          required
          placeholder="Masukkan Nomor HP (Contoh: 08123456789)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 whitespace-nowrap"
        >
          {loading ? 'Mencari...' : 'Cari Pesanan 🔍'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm text-center">
          {errorMsg}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !loading && (
        <div className="space-y-6">
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 border border-slate-800/60 rounded-2xl text-slate-400 space-y-2">
              <div className="text-4xl">📋</div>
              <p className="text-sm">Tidak ada pesanan ditemukan untuk nomor HP tersebut.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs text-slate-400">Nomor Pesanan:</span>
                    <h3 className="font-mono text-lg font-bold text-amber-400">
                      {ord.order_no}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(ord.status, ord.cancelled)}
                    <span className="text-xs text-slate-500">
                      {new Date(ord.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-800/40 p-4 rounded-xl">
                  <div>
                    <span className="text-slate-500 block">Pelanggan:</span>
                    <span className="font-semibold text-white">{ord.customer_name}</span> ({ord.phone})
                  </div>
                  <div>
                    <span className="text-slate-500 block">Metode Pengiriman:</span>
                    <span className="font-semibold uppercase text-amber-300">{ord.method}</span>
                  </div>

                  {ord.method === 'delivery' && (
                    <div className="sm:col-span-2 space-y-1">
                      <span className="text-slate-500 block">Patokan Alamat:</span>
                      <p className="text-slate-200">{ord.address_patokan || '-'}</p>
                      {ord.address_lat && ord.address_lng && (
                        <p className="text-[11px] font-mono text-emerald-400">
                          GPS: {ord.address_lat.toFixed(6)}, {ord.address_lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Rincian Item:
                  </h4>
                  <div className="space-y-2">
                    {ord.order_items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800/50 last:border-none"
                      >
                        <span className="text-slate-200">
                          {item.name_snapshot} <span className="text-slate-500">x{item.qty}</span>
                        </span>
                        <span className="text-slate-400 font-mono">
                          Rp {(item.price_snapshot * item.qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Biaya:</span>
                  <span className="text-xl font-bold text-emerald-400">
                    Rp {ord.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
