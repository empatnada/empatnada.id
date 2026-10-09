"use client";

import { useState, useEffect, useCallback } from "react";
// Import Server Actions dari Tim Backend
import { getAdminOrders, updateOrderStatus } from "@/actions/admin";

// Tipe data berdasarkan instruksi backend
type Order = {
  id: string;
  pt: string;
  kirim: string; // 'pending' | 'shipped' | 'delivered'
  bayar: string; // 'unpaid' | 'dp_paid' | 'paid'
  tanggal: string;
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

  // 2. Fetcher Data dari Database (Temicu saat filter / debounce berubah)
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // Memanggil fungsi dari Backend
      const data = await getAdminOrders(debouncedSearch, shippingFilter, paymentFilter);
      setOrders(data || []);
    } catch (error) {
      console.error("Gagal mengambil data resi:", error);
      // Fallback dummy data jika action backend gagal saat testing
      setOrders([
        { id: "RS-1001", pt: "PT. Maju Mundur", kirim: "pending", bayar: "unpaid", tanggal: "10 Okt 2026" }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, shippingFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 3. Handler Update Status (Terkoneksi ke tombol Card)
  const handleUpdate = async (id: string, jenis: "kirim" | "bayar", value: string) => {
    try {
      if (jenis === "kirim") {
        await updateOrderStatus(id, value, ""); // Parameter bayar dikosongkan jika hanya update kirim
      } else {
        await updateOrderStatus(id, "", value); // Parameter kirim dikosongkan jika hanya update bayar
      }
      fetchOrders(); // Refresh data setelah sukses update
    } catch (error) {
      console.error(`Gagal update status resi ${id}:`, error);
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
            placeholder="🔍 Cari Resi / Nama PT..." 
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
          <div key={item.id} className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{item.id}</h3>
                  <p className="text-sm text-base-content/70">{item.pt}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-base-content/50">{item.tanggal}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <span className={`badge badge-sm ${
                  item.kirim === 'delivered' ? 'badge-success' : item.kirim === 'shipped' ? 'badge-info' : 'badge-warning'
                }`}>
                  Kirim: {item.kirim}
                </span>
                <span className={`badge badge-sm ${
                  item.bayar === 'paid' ? 'badge-success' : item.bayar === 'dp_paid' ? 'badge-primary' : 'badge-error'
                }`}>
                  Bayar: {item.bayar}
                </span>
              </div>
              
              {/* Action Buttons terhubung ke Backend */}
              <div className="card-actions justify-end mt-4 border-t border-base-200 pt-3">
                {item.kirim !== 'delivered' && (
                  <button 
                    onClick={() => handleUpdate(item.id, 'kirim', 'delivered')}
                    className="btn btn-outline btn-info btn-xs"
                  >
                    Tandai Dikirim
                  </button>
                )}
                {item.bayar !== 'paid' && (
                  <button 
                    onClick={() => handleUpdate(item.id, 'bayar', 'paid')}
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
