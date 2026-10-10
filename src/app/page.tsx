'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 1. Tipe Data (Interface) untuk Hasil Kalkulasi OSRM
interface OSRMResult {
  distance: string;
  duration: string;
  fleet: string;
  estimateCost: string;
  isFallback?: boolean;
}

export default function SuperAppHomepage() {
  const [muat, setMuat] = useState('');
  const [bongkar, setBongkar] = useState('');
  const [result, setResult] = useState<OSRMResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Fungsi Fetch API Real-Time (Sesuai Arahan Tech Lead)
  const handleQuickCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint ini disesuaikan dengan API dari backend nanti
      // const response = await fetch('/api/logistik/osrm', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ muat, bongkar }),
      // });
      // const data = await response.json();

      // Simulasi delay satelit sementara API Backend disiapkan
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setResult({
        distance: '45 KM',
        duration: '1 Jam 20 Menit',
        fleet: 'Fuso Wingbox',
        estimateCost: 'Rp 1.850.000',
        isFallback: false,
      });
    } catch (error) {
      console.error('Gagal menghubungkan ke OSRM:', error);
      alert('Koneksi satelit sedang sibuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0F1115] text-[#F3F4F6] min-h-screen font-sans selection:bg-[#E30613] selection:text-white pb-20 md:pb-0 scroll-smooth">
      
      {/* 1. HEADER EMPATNADA HOLDING */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-b from-black/95 to-transparent backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-widest text-lg md:text-xl text-white uppercase">
            EMPATNADA<span className="text-[#E30613]">.ID</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-slate-300">
          <a href="#ekosistem" className="hover:text-white transition-colors">Ekosistem</a>
          <a href="#logistik-kita" className="hover:text-[#E30613] transition-colors">Logistik Kita</a>
          <a href="#portofolio" className="hover:text-white transition-colors">Portofolio</a>
          <Link href="/admin/dashboard" className="text-[#E30613] hover:text-red-400">Portal Admin</Link>
        </nav>
      </header>

      {/* 2. HERO SECTION: EMPATNADA GRAND VISION */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-16 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F1115] via-black/70 to-black/90">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-[#0F1115] to-[#0F1115]"></div>
        </div>

        <div className="relative z-10 max-w-5xl space-y-4 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#E30613]">
            B2B SUPPLY CHAIN & LIFESTYLE ECOSYSTEM
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-none text-white">
            INTEGRASI BISNIS <br />TANPA BATAS.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed">
            Empatnada.id adalah super-platform korporat yang menaungi distribusi kargo kelas berat, solusi katering industri, hingga pemberdayaan UMKM lokal dalam satu ekosistem digital presisi tinggi.
          </p>
        </div>

        <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a href="#ekosistem" className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all text-center shadow-lg">
            Jelajahi Ekosistem
          </a>
        </div>
      </section>

      {/* 3. EKOSISTEM EMPATNADA */}
      <section id="ekosistem" className="py-24 px-6 md:px-16 bg-black border-y border-slate-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">Pilar Bisnis Empatnada</h2>
            <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Tiga divisi utama untuk melayani kebutuhan B2B dan B2C Nusantara.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PILAR 1: LOGISTIK KITA (ACTIVE) */}
            <div className="bg-[#1A1A1A] border border-[#E30613]/50 rounded-xl p-8 space-y-6 flex flex-col justify-between hover:border-[#E30613] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#E30613] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">Status: Live</div>
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold uppercase text-white group-hover:text-[#E30613] transition-colors">Logistik Kita</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sewa armada kargo berat (Pickup, CDD, Fuso, Wingbox) terintegrasi OSRM untuk pabrik dan manufaktur.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <a href="#logistik-kita" className="w-full block text-center py-3 bg-[#E30613] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-red-700 transition-colors">
                  Buka Panel Logistik
                </a>
              </div>
            </div>

            {/* PILAR 2: KATERING JENG AYU (MAINTENANCE) */}
            <div className="bg-[#0A0A0C] border border-slate-800/50 rounded-xl p-8 space-y-6 flex flex-col justify-between opacity-80 cursor-not-allowed relative grayscale hover:grayscale-0 transition-all duration-500">
              <div className="absolute top-0 right-0 bg-yellow-600 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg flex items-center gap-1">
                <span>🚧</span> Maintenance
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold uppercase text-slate-400">Katering Jeng Ayu</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layanan katering premium untuk industri, pabrik, dan acara korporat berskala besar.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/50">
                <button disabled className="w-full py-3 bg-slate-900 text-slate-600 text-xs font-bold uppercase tracking-widest rounded border border-slate-800 cursor-not-allowed">
                  Sistem Sedang Dibangun
                </button>
              </div>
            </div>

            {/* PILAR 3: LAPAK UMKM (COMING SOON) */}
            <div className="bg-[#0A0A0C] border border-slate-800/50 rounded-xl p-8 space-y-6 flex flex-col justify-between opacity-80 cursor-not-allowed relative grayscale hover:grayscale-0 transition-all duration-500">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg flex items-center gap-1">
                <span>🚀</span> Coming Soon
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold uppercase text-slate-400">Lapak UMKM</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Marketplace pemberdayaan produk lokal dan kebutuhan sehari-hari yang terintegrasi dengan jaringan pengiriman.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/50">
                <button disabled className="w-full py-3 bg-slate-900 text-slate-600 text-xs font-bold uppercase tracking-widest rounded border border-slate-800 cursor-not-allowed">
                  Tahap Perencanaan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODUL AKTIF: LOGISTIK KITA (OSRM CALCULATOR) */}
      <section id="logistik-kita" className="py-24 px-6 md:px-16 bg-[#0F1115]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#E30613]">MODUL: LOGISTIK KITA</p>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">Satelit Route Calculator</h2>
            <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">Kalkulasi presisi radius muat dan bongkar kargo berat.</p>
          </div>

          <div className="bg-[#1A1A1A] border border-slate-800 p-6 md:p-10 rounded-2xl shadow-2xl">
            <form onSubmit={handleQuickCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {/* 3. A11y Label Form Update */}
                <label htmlFor="muat" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">📍 Titik Muat</label>
                <input id="muat" type="text" required placeholder="Contoh: Margomulyo, Surabaya" value={muat} onChange={(e) => setMuat(e.target.value)} className="w-full h-12 px-4 bg-[#0F1115] border border-slate-700 rounded-lg text-white text-sm focus:border-[#E30613] focus:outline-none focus:ring-1 focus:ring-[#E30613] transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="bongkar" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">🏁 Titik Bongkar</label>
                <input id="bongkar" type="text" required placeholder="Contoh: JIIPE, Gresik" value={bongkar} onChange={(e) => setBongkar(e.target.value)} className="w-full h-12 px-4 bg-[#0F1115] border border-slate-700 rounded-lg text-white text-sm focus:border-[#E30613] focus:outline-none focus:ring-1 focus:ring-[#E30613] transition-colors" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="submit" disabled={loading} className="w-full h-14 bg-[#E30613] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all flex items-center justify-center disabled:bg-slate-700 disabled:cursor-not-allowed">
                  {loading ? 'Menganalisis Koordinat Satelit...' : 'Hitung Estimasi Biaya Kargo'}
                </button>
              </div>
            </form>

            {/* Hasil OSRM Render */}
            {result && (
              <div className="mt-8 p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-xl animate-fade-in space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500 uppercase">Jarak Tempuh</p>
                    <p className="text-base font-bold text-emerald-400 mt-1">{result.distance}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase">Estimasi Waktu</p>
                    <p className="text-base font-bold text-white mt-1">{result.duration}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase">Rekomendasi Armada</p>
                    <p className="text-base font-bold text-white mt-1">{result.fleet}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase">Estimasi Tarif</p>
                    <p className="text-base font-extrabold text-[#E30613] mt-1">{result.estimateCost}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. SECTION MITRA KLIEN (SOCIAL PROOF B2B) */}
      <section className="py-12 border-y border-slate-900 bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Dipercaya oleh berbagai sektor manufaktur & industri</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale">
            <span className="font-bold text-lg md:text-xl uppercase tracking-widest text-white">Krakatau Steel</span>
            <span className="font-bold text-lg md:text-xl uppercase tracking-widest text-white">Indofood</span>
            <span className="font-bold text-lg md:text-xl uppercase tracking-widest text-white">Semen Gresik</span>
            <span className="font-bold text-lg md:text-xl uppercase tracking-widest text-white">Tjiwi Kimia</span>
          </div>
        </div>
      </section>

      {/* 6. SECTION PORTOFOLIO & ARTIKEL (SEO GOOGLE) */}
      <section id="portofolio" className="py-24 px-6 md:px-16 bg-[#0F1115]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#E30613]">REKAM JEJAK (SEO)</p>
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">Portofolio Operasional</h2>
            </div>
            <a href="/artikel" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white border-b border-slate-700 pb-1 transition-colors">Lihat Semua Dokumentasi →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 4. Persiapan Ruang untuk Komponen next/image */}
            <div className="group bg-[#1A1A1A] border border-slate-800 rounded-xl overflow-hidden hover:border-[#E30613] transition-colors cursor-pointer flex flex-col">
              <div className="relative h-48 bg-slate-900 w-full overflow-hidden">
                {/* Ganti div ini dengan <Image src="..." alt="..." fill className="object-cover" /> saat foto tersedia */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-[10px] group-hover:scale-105 transition-transform duration-500">[Foto Fuso Muat Besi]</div>
              </div>
              <div className="p-6 space-y-3 flex-1">
                <span className="text-[10px] text-[#E30613] font-bold tracking-widest uppercase">Heavy Lift</span>
                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#E30613] transition-colors">Distribusi Pipa Besi 20 Ton Rute Surabaya - Cikarang</h3>
                <p className="text-xs text-slate-400 line-clamp-2">Pengiriman material konstruksi berat sukses diselesaikan menggunakan 2 unit Fuso Wingbox.</p>
              </div>
            </div>
            
            <div className="group bg-[#1A1A1A] border border-slate-800 rounded-xl overflow-hidden hover:border-[#E30613] transition-colors cursor-pointer flex flex-col">
              <div className="relative h-48 bg-slate-900 w-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-[10px] group-hover:scale-105 transition-transform duration-500">[Foto CDD Muat Dus]</div>
              </div>
              <div className="p-6 space-y-3 flex-1">
                <span className="text-[10px] text-[#E30613] font-bold tracking-widest uppercase">FMCG</span>
                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#E30613] transition-colors">Menjaga Rantai Pasok Makanan Ringan Jawa Timur</h3>
                <p className="text-xs text-slate-400 line-clamp-2">Armada CDD Bak Empatnada diandalkan untuk distribusi harian antar gudang manufaktur.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-black border-t border-slate-900 text-center text-xs text-slate-600 space-y-2">
        <p className="font-bold uppercase tracking-widest text-slate-400">EMPATNADA GROUP</p>
        <p>© {new Date().getFullYear()} PT Empatnada Logistik Nusantara. All Rights Reserved.</p>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/6285813487753" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center w-14 h-14 bg-[#E30613] text-white rounded-full shadow-[0_0_20px_rgba(227,6,19,0.4)] hover:scale-110 hover:bg-red-600 transition-all animate-bounce"
        aria-label="Hubungi Admin via WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.391.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z" />
        </svg>
      </a>
      
    </div>
  );
}
