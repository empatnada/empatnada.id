"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [shippingFilter, setShippingFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Efek Debounce (300ms) untuk mengurangi beban server
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      // Backend action bisa dipanggil di sini menggunakan variabel `debouncedSearch`
      console.log("Mencari data ke server:", searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Data Dummy untuk tes UI Card-based di Layar HP
  const dummyData = [
    { id: "RS-1001", pt: "PT. Maju Mundur", kirim: "pending", bayar: "unpaid", tanggal: "10 Okt 2026" },
    { id: "RS-1002", pt: "CV. Sukses Selalu", kirim: "shipped", bayar: "dp_paid", tanggal: "09 Okt 2026" },
    { id: "RS-1003", pt: "PT. Angin Ribut", kirim: "delivered", bayar: "paid", tanggal: "08 Okt 2026" },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-20">
      {/* Header Admin */}
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-primary">Dashboard Operasional</h1>
        <p className="text-sm text-base-content/70">Kelola resi, pengiriman, dan status tagihan.</p>
      </div>

      {/* Area Pencarian & Filter */}
      <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 space-y-4 mb-6">
        <div className="form-control w-full">
          <input 
            type="text" 
            placeholder="🔍 Cari Resi / Nama PT..." 
            className="input input-bordered w-full focus:input-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
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
        <h2 className="font-semibold px-1">Hasil Pencarian ({debouncedSearch ? "Filter Aktif" : "Semua Data"})</h2>
        
        {dummyData.map((item) => (
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
              
              {/* Badges Status Presisi */}
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
              
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Detail</button>
                <button className="btn btn-primary btn-sm">Update</button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
