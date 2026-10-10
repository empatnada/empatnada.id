'use client';

import React, { useState } from 'react';

// Data Mockup Contoh Resi (Nantinya diganti dengan fetch data dari Supabase)
interface ResiItem {
  id: string;
  code: string;
  date: string;
  customer: string;
  whatsapp: string;
  routeFrom: string;
  routeTo: string;
  fleet: string;
  totalCost: string;
  status: 'Pending' | 'Proses' | 'Selesai' | 'Dibatalkan';
}

const initialResiData: ResiItem[] = [
  {
    id: '1',
    code: '#ORD-2026-001',
    date: '11 Okt 2026',
    customer: 'PT Nusantara Sentosa',
    whatsapp: '628123456789',
    routeFrom: 'Margomulyo, Surabaya',
    routeTo: 'Kawasan Industri JIIPE, Gresik',
    fleet: 'Fuso Wingbox',
    totalCost: 'Rp 8.500.000',
    status: 'Pending',
  },
  {
    id: '2',
    code: '#ORD-2026-002',
    date: '11 Okt 2026',
    customer: 'CV Nada Harmony',
    whatsapp: '628987654321',
    routeFrom: 'Rungkut, Surabaya',
    routeTo: 'Kawasan Industri Jababeka, Cikarang',
    fleet: 'Tronton Bak',
    totalCost: 'Rp 14.200.000',
    status: 'Proses',
  },
];

export default function AdminDashboardPage() {
  const [resiList, setResiList] = useState<ResiItem[]>(initialResiData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fungsi Simulasi Ubah Status (PATCH ke Database)
  const handleUpdateStatus = (id: string, newStatus: ResiItem['status']) => {
    setResiList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setToastMessage(`Status resi berhasil diperbarui ke: ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper Badge Warna Status
  const renderBadge = (status: ResiItem['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending</span>;
      case 'Proses':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Sedang Dikirim</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Selesai</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Dibatalkan</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Melayang */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span>✅</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manajemen Resi Kargo Berat</h1>
          <p className="text-xs text-slate-500">Kelola pesanan armada pabrik dan pantau status pengiriman real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 bg-[#4338CA] text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            + Buat Pesanan Manual
          </button>
        </div>
      </div>

      {/* Kontainer Tabel Utama */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">ID Resi & Pelanggan</th>
                <th className="p-4">Rute (Muat ➔ Bongkar)</th>
                <th className="p-4">Jenis Armada</th>
                <th className="p-4">Total Tarif</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-sm text-slate-800">
              {resiList.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  {/* Kolom 1: ID & Pemesan */}
                  <td className="p-4 align-top">
                    <span className="font-bold text-[#4338CA] block">{item.code}</span>
                    <span className="text-xs text-slate-900 font-semibold block mt-0.5">{item.customer}</span>
                    <a 
                      href={`https://wa.me/${item.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] text-emerald-600 font-medium hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      💬 WhatsApp Pemesan
                    </a>
                  </td>

                  {/* Kolom 2: Rute */}
                  <td className="p-4 align-top">
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        <span className="font-medium">Muat:</span> {item.routeFrom}
                      </p>
                      <p className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                        <span className="font-medium">Bongkar:</span> {item.routeTo}
                      </p>
                    </div>
                  </td>

                  {/* Kolom 3: Jenis Armada */}
                  <td className="p-4 align-top">
                    <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                      🚚 {item.fleet}
                    </span>
                  </td>

                  {/* Kolom 4: Tarif */}
                  <td className="p-4 align-top font-bold text-slate-900">
                    {item.totalCost}
                  </td>

                  {/* Kolom 5: Status */}
                  <td className="p-4 align-top text-center">
                    {renderBadge(item.status)}
                  </td>

                  {/* Kolom 6: Aksi Cepat (Fat-Finger Friendly) */}
                  <td className="p-4 align-top text-right space-y-2">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {item.status === 'Pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'Proses')}
                          className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          Setujui / Berangkatkan
                        </button>
                      )}
                      {item.status === 'Proses' && (
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'Selesai')}
                          className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          Tandai Selesai
                        </button>
                      )}
                      {/* Tombol Cetak Surat Jalan */}
                      <a
                        href={`/admin/surat-jalan?id=${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        🖨️ Cetak SJ
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
