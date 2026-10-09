"use client";

import { useState, useEffect, useCallback } from "react";
// Import Server Actions dari Tim Backend
import { getAdminOrders, updateOrderStatus } from "@/actions/admin";

// Tipe data disesuaikan dengan struktur kolom database Supabase
type Order = {
  id_resi: string;
  id_user: string;
  rute_muat: string;
  rute_bongkar: string;
  jarak_km: number;
  total_harga: number;
  status_bayar: string; // 'unpaid' | 'dp_paid' | 'paid'
  status_kirim: string; // 'pending' | 'shipped' | 'delivered'
  created_at: string;
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

  // 2. Fetcher Data dari Database (Termicu saat filter / debounce berubah)
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // Memanggil fungsi dari Backend yang mengembalikan objek { success, data, message }
      const res = await getAdminOrders(debouncedSearch, shippingFilter, paymentFilter);
      if (res.success && res.data) {
        setOrders(res.data as Order[]);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data resi:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, shippingFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 3. Handler Update Status (Disesuaikan dengan signature objek backend)
  const handleUpdate = async (id_resi: string, jenis: "kirim" | "bayar", value: string) => {
    try {
      const payload = jenis === "kirim" 
        ? { status_kirim: value } 
        : { status_bayar: value };

      const res = await updateOrderStatus(id_resi, payload);
      if (res.success) {
        fetchOrders(); // Refresh data setelah sukses update
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(`Gagal update status resi ${id_resi}:`, error);
      alert("Gagal memperbarui status. Cek koneksi database.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-20">
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-primary">Dashboard Operasional</h1>
        <p className="text-sm text-base-content/70">Kelola resi, pengiriman, dan status tagihan (Live Data).</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 space-y-4 mb-6">
        <div className="form-control w-full relative">
          <input 
            type="text" 
            placeholder="🔍 Cari Resi (UUID)..." 
            className="input input-bordered w-full focus:input-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {isLoading && <span className="loading loading-spinner loading-sm absolute right-3 top-3 text-primary"></span>}
        </div>
        
        <div className="flex gap-2">
          <select 
            className="select select-bordered select-sm flex-1"
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value)}
          >
            <option value="all">Kirim: Semua</option>
            <option value="pending">⏳ Pending</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="delivered">✅ Delivered</option>
          </select>

          <select 
            className="select select-bordered select-sm flex-1"
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
                    Resi: {item.id_resi}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-1">
                    📍 {item.rute_muat} ➔ {item.rute_bongkar}
                  </p>
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
              
              <div className="flex gap-2 mt-2">
                <span className={`badge badge-sm ${
                  item.status_kirim === 'delivered' ? 'badge-success' : item.status_kirim === 'shipped' ? 'badge-info' : 'badge-warning'
                }`}>
                  Kirim: {item.status_kirim}
                </span>
                <span className={`badge badge-sm ${
                  item.status_bayar === 'paid' ? 'badge-success' : item.status_bayar === 'dp_paid' ? 'badge-primary' : 'badge-error'
                }`}>
                  Bayar: {item.status_bayar}
                </span>
              </div>
              
              {/* Action Buttons terhubung ke Backend */}
              <div className="card-actions justify-end mt-4 border-t border-base-200 pt-3">
                {item.status_kirim !== 'delivered' && (
                  <button 
                    onClick={() => handleUpdate(item.id_resi, 'kirim', 'delivered')}
                    className="btn btn-outline btn-info btn-xs"
                  >
                    Tandai Dikirim
                  </button>
                )}
                {item.status_bayar !== 'paid' && (
                  <button 
                    onClick={() => handleUpdate(item.id_resi, 'bayar', 'paid')}
                    className="btn btn-primary btn-xs"
                  >
                    Tandai Lunas
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
