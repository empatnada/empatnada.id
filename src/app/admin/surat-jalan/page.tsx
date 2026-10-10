'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuratJalanContent() {
  const searchParams = useSearchParams();
  const resiId = searchParams.get('id') || 'ORD-2026-001';

  // Data tiruan berdasarkan ID Resi (Nantinya di-fetch langsung dari Supabase)
  const shipmentData = {
    code: `#${resiId}`,
    date: '11 Oktober 2026',
    // Titik Muat
    senderCompany: 'PT. Pabrik Kertas Nusantara',
    senderAddress: 'Jl. Margomulyo Indah No. 45, Surabaya',
    senderPic: 'Bpk. Budi',
    senderPhone: '0812-3456-7890',
    // Titik Bongkar
    receiverCompany: 'Gudang Distributor Pusat',
    receiverAddress: 'Kawasan Industri JIIPE, Gresik',
    receiverPic: 'Ibu Ani',
    receiverPhone: '0856-7890-1234',
    // Armada & Pengawasan
    fleet: 'Fuso Wingbox',
    licensePlate: 'B 1234 XYZ',
    driverName: 'Bpk. Slamet',
    driverPhone: '0811-9999-8888',
    specialNote: '[!] MUATAN BERAT & RENTAN BASAH. WAJIB GUNAKAN TERPAL EKSTRA!',
    // Daftar Barang
    items: [
      { id: '01', desc: 'Roll Kertas Industri Grade A', qty: '12 Ton', notes: 'Segel Pabrik Utuh' },
      { id: '02', desc: 'Palet Kayu Pendukung Kargo', qty: '4 Pcs', notes: 'Layak Jalan' },
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      
      {/* TOMBOL AKSI CETAK (Hanya muncul di layar web, otomatis hilang saat diprint via CSS print:hidden) */}
      <div className="max-w-[210mm] w-full mb-4 flex justify-between items-center print:hidden">
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors"
        >
          ← Kembali ke Dashboard
        </button>
        <button 
          onClick={handlePrint}
          className="px-6 py-2.5 bg-[#E30613] text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center gap-2"
        >
          🖨️ Cetak Dokumen (A4)
        </button>
      </div>

      {/* LEMBAR KERTAS A4 (Ukuran presisi 210mm x 297mm) */}
      <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[15mm] shadow-xl rounded-sm flex flex-col justify-between print:shadow-none print:p-0 print:w-full">
        
        {/* BAGIAN ATAS: KOP SURAT */}
        <div>
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold tracking-wide text-slate-900">EMPATNADA.ID</h1>
              <p className="text-xs text-slate-600 font-medium">Logistics & Operational Hub — Jawa Timur & Nasional</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">SURAT JALAN</h2>
              <p className="text-xs font-mono font-bold text-[#E30613]">No. Resi: {shipmentData.code}</p>
              <p className="text-xs text-slate-600 mt-0.5">Tanggal: {shipmentData.date}</p>
            </div>
          </div>

          {/* INFORMASI TITIK MUAT & BONGKAR */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-slate-50 p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-bold text-slate-900 uppercase mb-1 border-b pb-1">📍 Titik Muat (Pengirim)</p>
              <p className="font-semibold text-slate-800">{shipmentData.senderCompany}</p>
              <p className="text-slate-600">{shipmentData.senderAddress}</p>
              <p className="text-slate-700 mt-1">PIC: <span className="font-medium">{shipmentData.senderPic}</span> ({shipmentData.senderPhone})</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 uppercase mb-1 border-b pb-1">🏁 Titik Bongkar (Penerima)</p>
              <p className="font-semibold text-slate-800">{shipmentData.receiverCompany}</p>
              <p className="text-slate-600">{shipmentData.receiverAddress}</p>
              <p className="text-slate-700 mt-1">PIC: <span className="font-medium">{shipmentData.receiverPic}</span> ({shipmentData.receiverPhone})</p>
            </div>
          </div>

          {/* INFORMASI ARMADA & PENGAWASAN */}
          <div className="mb-6 text-xs border border-slate-300 rounded-lg p-4 space-y-2">
            <p className="font-bold text-slate-900 uppercase border-b pb-1">🚚 Informasi Armada & Pengamanan Kargo</p>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-semibold text-slate-600">Jenis Armada:</span> {shipmentData.fleet}</p>
              <p><span className="font-semibold text-slate-600">Nomor Polisi:</span> <span className="font-mono font-bold">{shipmentData.licensePlate}</span></p>
              <p><span className="font-semibold text-slate-600">Nama Supir:</span> {shipmentData.driverName}</p>
              <p><span className="font-semibold text-slate-600">No. HP Supir:</span> {shipmentData.driverPhone}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-dashed border-red-300 bg-red-50 p-2 rounded text-red-800 font-semibold text-[11px]">
              {shipmentData.specialNote}
            </div>
          </div>

          {/* TABEL RINCIAN MUATAN */}
          <div className="mb-8">
            <p className="font-bold text-slate-900 uppercase text-xs mb-2">📦 Rincian Muatan Kargo</p>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-200 text-slate-900 border-b border-slate-400">
                  <th className="p-2.5 w-12 text-center">NO</th>
                  <th className="p-2.5">DESKRIPSI ITEM / MATERIAL</th>
                  <th className="p-2.5 w-24 text-center">QTY</th>
                  <th className="p-2.5">KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 border-b border-slate-300">
                {shipmentData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 text-center font-mono">{item.id}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{item.desc}</td>
                    <td className="p-2.5 text-center font-bold">{item.qty}</td>
                    <td className="p-2.5 text-slate-600">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BAGIAN BAWAH: PERNYATAAN & TANDA TANGAN */}
        <div className="text-xs space-y-6">
          <p className="text-[11px] text-slate-600 italic">
            * Pernyataan: Barang telah dimuat, diperiksa, dan diserahkan sesuai dengan spesifikasi di atas dalam kondisi baik dan lengkap di bawah pengawasan pihak terkait.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center pt-4">
            <div>
              <p className="font-semibold text-slate-800 mb-12">Pihak Pengirim</p>
              <p className="border-b border-slate-400 pb-1 font-bold text-slate-900">( Admin Logistik )</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-12">Pengemudi / Kurir</p>
              <p className="border-b border-slate-400 pb-1 font-bold text-slate-900">( {shipmentData.driverName} )</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-12">Penerima / Gudang</p>
              <p className="border-b border-slate-400 pb-1 font-bold text-slate-900">( Nama, Cap & Stempel )</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SuratJalanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-600">Memuat Surat Jalan...</div>}>
      <SuratJalanContent />
    </Suspense>
  );
}
