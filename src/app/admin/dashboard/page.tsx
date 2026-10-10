'use client';

import React, { useState, useEffect } from 'react';

interface ResiItem {
  id: string;
  code: string;
  customer: string;
  whatsapp: string;
  routeFrom: string;
  routeTo: string;
  fleet: string;
  totalCost: string;
  status: 'Pending' | 'Proses' | 'Selesai' | 'Dibatalkan';
}

export default function AdminDashboardPage() {
  const [resiList, setResiList] = useState<ResiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchResiData();
  }, []);

  const fetchResiData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/resi');
      if (res.ok) {
        const data = await res.json();
        setResiList(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data resi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ResiItem['status']) => {
    try {
      const res = await fetch(`/api/admin/resi/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setResiList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        setToastMessage(`Status resi berhasil diperbarui ke: ${newStatus}`);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert('Gagal memperbarui status di database.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const renderBadge = (status: ResiItem['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending</span>;
      case 'Proses':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Sedang Dikirim</span>;
      case 'Selesai':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Selesai</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Dibatalkan</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Melayang */}
      {toastMessage && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <span>✅</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Manajemen Resi Kargo Berat</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola pesanan armada pabrik dan pantau status pengiriman dari Supabase.</p>
        </div>
      </div>

      {/* Kontainer Utama */}
      <div>
        {loading ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-slate-500 text-xs shadow-xs">
            Memuat data resi dari database Supabase...
          </div>
        ) : resiList.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-slate-500 text-xs shadow-xs">
            Belum ada data resi tersimpan di database.
          </div>
        ) : (
          /* TAMPILAN RESPONSIF: Card Vertikal untuk Mobile, Tabel untuk Desktop */
          <div className="space-y-4">
            {resiList.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-xs hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Baris Atas: ID, Pelanggan, & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-[#4338CA] text-base">{item.code}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{item.customer}</h3>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    {renderBadge(item.status)}
                    <a 
                      href={`https://wa.me/${item.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>

                {/* Baris Tengah: Rute, Armada, dan Tarif */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="space-y-1.5 sm:col-span-2">
                    <p className="text-slate-700 flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5"></span>
                      <span><strong className="text-slate-900">Muat:</strong> {item.routeFrom}</span>
                    </p>
                    <p className="text-slate-700 flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 mt-0.5"></span>
                      <span><strong className="text-slate-900">Bongkar:</strong> {item.routeTo}</span>
                    </p>
                  </div>
                  <div className="flex sm:flex-col justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Armada</p>
                      <span className="font-bold text-slate-800 text-xs">🚚 {item.fleet}</span>
                    </div>
                    <div className="mt-1 sm:mt-2">
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Tarif</p>
                      <span className="font-extrabold text-slate-900 text-sm">{item.totalCost}</span>
                    </div>
                  </div>
                </div>

                {/* Baris Bawah: Tombol Aksi Cepat Fat-Finger Friendly (Min Tinggi 48px) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
                  {item.status === 'Pending' && (
                    <button 
                      onClick={() => handleUpdateStatus(item.id, 'Proses')}
                      className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5 min-h-[48px]"
                    >
                      🚀 Setujui & Berangkatkan
                    </button>
                  )}
                  {item.status === 'Proses' && (
                    <button 
                      onClick={() => handleUpdateStatus(item.id, 'Selesai')}
                      className="w-full sm:w-auto px-4 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5 min-h-[48px]"
                    >
                      ✅ Tandai Selesai
                    </button>
                  )}
                  <a
                    href={`/admin/surat-jalan?id=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-xs flex items-center justify-center gap-1.5 min-h-[48px]"
                  >
                    🖨️ Cetak Surat Jalan (A4)
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
