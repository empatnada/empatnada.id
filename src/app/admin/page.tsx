"use client";

import { useState, useEffect, useCallback } from "react";

// Tipe data disesuaikan dengan workflow anti-fiktif & status operasional
type Order = {
  id_resi: string;
  id_user: string;
  rute_muat: string;
  rute_bongkar: string;
  jarak_km: number;
  total_harga: number;
  status_bayar: string; // 'unpaid' | 'dp_paid' | 'paid'
  status_kirim: string; // 'pending_verification' | 'verified' | 'shipped' | 'delivered' | 'rejected'
  created_at: string;
  customer_phone?: string;
  users_extended?: {
    phone_number?: string;
  };
};

export default function AdminDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [shippingFilter, setShippingFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Efek Debounce (300ms) untuk Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // 2. Fetcher Data menggunakan API Routes standar
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: debouncedSearch,
        kirim: shippingFilter,
        bayar: paymentFilter,
      });

      const response = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      const res = await response.json();

      if (res.success && res.data) {
        setOrders(res.data as Order[] | any[]);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data resi via API:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, shippingFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 3. Handler Update Status (Anti-Fiktif & Operasional)
  const handleUpdate = async (id_resi: string, jenis: "kirim" | "bayar", value: string) => {
    try {
      const updateData = jenis === "kirim" 
        ? { status_kirim: value } 
        : { status_bayar: value };

      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_resi, updateData }),
      });

      const res = await response.json();

      if (res.success) {
        fetchOrders(); // Refresh data setelah sukses update
      } else {
        alert(res.message || "Gagal memperbarui status.");
      }
    } catch (error) {
      console.error(`Gagal update status resi ${id_resi}:`, error);
      alert("Gagal memperbarui status. Cek koneksi server.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-20">
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-primary">Dashboard Operasional</h1>
        <p className="text-sm text-base-content/70">Kelola verifikasi pesanan, pengiriman, dan status tagihan.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 space-y-4 mb-6">
        <div className="form-control w-full relative">
          <input 
            type="text" 
            placeholder="🔍 Cari Resi / No HP..." 
            className="input input-bordered w-full focus:input-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {isLoading && <span className="loading loading-spinner loading-sm absolute right-3 top-3 text-primary"></span>}
        </div>
        
        <div className="flex gap-2">
          <select 
            className="select select-bordered select-sm flex-1 text-xs md:text-sm"
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value)}
          >
            <option value="all">Status: Semua</option>
            <option value="pending_verification">⏳ Pending Verifikasi</option>
            <option value="verified">🛡️ Verified (Disetujui)</option>
            <option value="shipped">🚚 Shipped (OTW)</option>
            <option value="delivered">✅ Delivered (Selesai)</option>
            <option value="rejected">❌ Ditolak (Fiktif)</option>
          </select>

          <select 
            className="select select-bordered select-sm flex-1 text-xs md:text-sm"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">Bayar: Semua</option>
            <option value="unpaid">❌ Unpaid</option>
            <option value="dp_paid">🪙 DP Paid</option>
            <option value="paid">💰 Paid</option>
          </select>
        </div>
      </div>

      {/* List Card Data (Mobile Optimized) */}
      <div className="space-y-4">
        <h2 className="font-semibold px-1">
          {orders.length > 0 ? `Menampilkan ${orders.length} Resi` : "Tidak ada data"}
        </h2>
        
        {orders.map((item) => (
          <div key={item.id_resi} className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-sm truncate max-w-[200px]" title={item.id_resi}>
                    Resi: #{item.id_resi.slice(0, 8)}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-1">
                    📍 {item.rute_muat} ➔ {item.rute_bongkar}
                  </p>
                  {item.customer_phone && (
                    <p className="text-xs text-success font-medium mt-1">
                      📱 WA: {item.customer_phone}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-primary mt-1">
                    Rp {item.total_harga?.toLocaleString('id-ID')} ({item.jarak_km} KM)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-base-content/50">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`badge badge-sm font-semibold ${
                  item.status_kirim === 'delivered' ? 'badge-success' : 
                  item.status_kirim === 'verified' || item.status_kirim === 'shipped' ? 'badge-info' : 
                  item.status_kirim === 'rejected' ? 'badge-error' : 'badge-warning'
                }`}>
                  Status: {item.status_kirim}
                </span>
                <span className={`badge badge-sm font-semibold ${
                  item.status_bayar === 'paid' ? 'badge-success' : item.status_bayar === 'dp_paid' ? 'badge-primary' : 'badge-error'
                }`}>
                  Bayar: {item.status_bayar}
                </span>
              </div>
              
              {/* Action Buttons (Anti-Fiktif & Pengiriman) */}
              <div className="card-actions justify-end mt-4 border-t border-base-200 pt-3 flex-wrap gap-2">
                {item.status_kirim === 'pending_verification' && (
                  <>
                    <button 
                      onClick={() => handleUpdate(item.id_resi, 'kirim', 'verified')}
                      className="btn btn-success btn-xs text-white"
                    >
                      ✓ Setujui (Verify)
                    </button>
                    <button 
                      onClick={() => handleUpdate(item.id_resi, 'kirim', 'rejected')}
                      className="btn btn-error btn-xs text-white"
                    >
                      ✕ Tolak (Fiktif)
                    </button>
                  </>
                )}

                {item.status_kirim === 'verified' && (
                  <button 
                    onClick={() => handleUpdate(item.id_resi, 'kirim', 'shipped')}
                    className="btn btn-outline btn-info btn-xs"
                  >
                    🚚 Berangkatkan (Shipped)
                  </button>
                )}

                {item.status_kirim === 'shipped' && (
                  <button 
                    onClick={() => handleUpdate(item.id_resi, 'kirim', 'delivered')}
                    className="btn btn-outline btn-success btn-xs"
                  >
                    ✅ Tandai Selesai (Delivered)
                  </button>
                )}

                {item.status_bayar !== 'paid' && (
                  <button 
                    onClick={() => handleUpdate(item.id_resi, 'bayar', 'paid')}
                    className="btn btn-primary btn-xs"
                  >
                    💰 Tandai Lunas
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
