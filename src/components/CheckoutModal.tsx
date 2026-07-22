'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { submitOrder } from '@/actions/order'
import { Order } from '@/types'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup')
  
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [patokan, setPatokan] = useState('')
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  if (!isOpen) return null

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser Anda tidak mendukung Geolocation GPS.')
      return
    }
    setIsLocating(true)
    setGpsError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setIsLocating(false)
      },
      (err) => {
        setIsLocating(false)
        setGpsError(`Gagal mengambil koordinat lokasi: ${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg('Nama lengkap dan Nomor HP wajib diisi.')
      return
    }

    if (method === 'delivery') {
      if (!lat || !lng) {
        setErrorMsg('Lokasi GPS wajib diambil untuk metode Delivery. Klik tombol "Ambil Lokasi GPS".')
        return
      }
      if (!patokan.trim()) {
        setErrorMsg('Patokan alamat wajib diisi untuk memudahkan kurir.')
        return
      }
    }

    setLoading(true)

    const payload = {
      customer_name: customerName.trim(),
      phone: phone.trim(),
      method,
      address_lat: method === 'delivery' ? lat : null,
      address_lng: method === 'delivery' ? lng : null,
      address_patokan: method === 'delivery' ? patokan.trim() : null,
      items: items.map((i) => ({
        menu_item_id: i.menuItem.id,
        qty: i.qty,
        price_snapshot: i.menuItem.price,
        name_snapshot: i.menuItem.name,
      })),
      total: getTotalPrice(),
    }

    const res = await submitOrder(payload)
    setLoading(false)

    if (res.success && res.order) {
      setCompletedOrder(res.order)
      clearCart()
    } else {
      setErrorMsg(res.error || 'Gagal mengirim pesanan.')
    }
  }

  const handleFinish = () => {
    setCompletedOrder(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl overflow-y-auto max-h-[90vh]">
        {completedOrder ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white">Pesanan Berhasil Dibuat!</h2>
            <p className="text-sm text-slate-400">
              Simpan Nomor Pesanan Anda untuk melacak status pesanan:
            </p>
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl font-mono text-2xl font-bold text-amber-400 tracking-wider">
              {completedOrder.order_no}
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Nama: <span className="text-slate-200">{completedOrder.customer_name}</span></p>
              <p>Metode: <span className="text-slate-200 uppercase">{completedOrder.method}</span></p>
              <p>Total Pembayaran: <span className="text-emerald-400 font-semibold">Rp {completedOrder.total.toLocaleString('id-ID')}</span></p>
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
            >
              Tutup & Kembali
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h2 className="text-xl font-bold">Checkout Pesanan</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nomor HP (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Metode Pesanan *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod('pickup')}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all ${
                      method === 'pickup'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Takeaway / Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('delivery')
                      if (!lat || !lng) handleGetLocation()
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all ${
                      method === 'delivery'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Antar / Delivery
                  </button>
                </div>
              </div>

              {method === 'delivery' && (
                <div className="p-4 bg-slate-800/60 border border-amber-500/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400">
                      Lokasi Delivery (GPS WAJIB) *
                    </span>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                    >
                      {isLocating ? 'Mencari GPS...' : lat ? '✓ GPS Diperbarui' : 'Ambil Lokasi GPS'}
                    </button>
                  </div>

                  {lat && lng ? (
                    <div className="text-xs text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      Koordinat GPS: {lat.toFixed(6)}, {lng.toFixed(6)}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Silakan izinkan lokasi di browser agar koordinat pengantaran akurat.
                    </p>
                  )}

                  {gpsError && (
                    <p className="text-xs text-rose-400">{gpsError}</p>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Patokan Alamat *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Contoh: Rumah cat hijau samping toko sembako Bu Ani"
                      value={patokan}
                      onChange={(e) => setPatokan(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white"
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm text-slate-400">Total Tagihan:</span>
                <span className="text-xl font-bold text-emerald-400">
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10"
            >
              {loading ? 'Memproses Pesanan...' : 'Konfirmasi & Kirim Pesanan'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
