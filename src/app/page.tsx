'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PublicHomepage() {
  // State untuk Simulasi Kalkulator Cepat di Hero Section
  const [muat, setMuat] = useState('');
  const [bongkar, setBongkar] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleQuickCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult({
        distance: '45 KM',
        duration: '1 Jam 20 Menit',
        fleet: 'Fuso Wingbox',
        estimateCost: 'Rp 1.850.000',
        isFallback: false,
      });
    }, 800);
  };

  return (
    <div className="bg-[#0F1115] text-[#F3F4F6] min-h-screen font-sans selection:bg-[#E30613] selection:text-white">
      
      {/* 1. HEADER / NAVBAR MINIMALIS SPACE-STYLE */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-widest text-lg md:text-xl text-white uppercase">
            EMPATNADA<span className="text-[#E30613]">.ID</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-slate-300">
          <a href="#armada" className="hover:text-white transition-colors">Armada Kargo</a>
          <a href="#kalkulator" className="hover:text-white transition-colors">Kalkulator Rute</a>
          <a href="#industri" className="hover:text-white transition-colors">Solusi Pabrik</a>
          <Link href="/admin/dashboard" className="text-[#E30613] hover:text-red-400">Portal Admin</Link>
        </nav>
        <div>
          <a 
            href="https://wa.me/6285813487753" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white hover:text-black transition-all"
          >
            Hubungi Sales
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION: FULL-BLEED IMAGERY & INDUSTRIAL IMPACT */}
      <section className="relative h-screen flex flex-col justify-end px-6 md:px-16 pb-20 overflow-hidden">
        {/* Background Overlay & Simulated Heavy Cargo Truck Image effect */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F1115] via-black/40 to-black/70">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0F1115] to-[#0F1115] opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#E30613]">
            SEWA ARMADA KARGO BERAT — JAWA TIMUR & NASIONAL
          </p>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase leading-none text-white">
            MAKING LOGISTICS <br />MULTIPLANETARY.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl font-normal leading-relaxed">
            Menghadirkan presisi satelit OSRM dan armada Tronton, Fuso, hingga Wingbox khusus korporat pabrik dengan kecepatan kalkulasi milidetik.
          </p>
        </div>

        <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a 
            href="#kalkulator" 
            className="px-8 py-4 bg-[#E30613] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all text-center shadow-lg shadow-red-900/30"
          >
            Cek Tarif & Rute Instant
          </a>
          <a 
            href="#armada" 
            className="px-8 py-4 border border-white/40 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all text-center"
          >
            Eksplorasi Armada
          </a>
        </div>
      </section>

      {/* 3. INTERACTIVE SECTION: KALKULATOR RUTE HIBRIDA (SPACE-PANEL STYLE) */}
      <section id="kalkulator" className="py-24 px-6 md:px-16 bg-[#0F1115] border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">
              Satelit Route Calculator
            </h2>
            <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">
              Masukkan titik muat pabrik dan tujuan bongkar untuk estimasi instan.
            </p>
          </div>

          {/* Panel Form Kartu Gelap */}
          <div className="bg-[#1A1A1A] border border-slate-800 p-6 md:p-10 rounded-2xl shadow-2xl space-y-6">
            <form onSubmit={handleQuickCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">📍 Titik Muat (Pabrik/Gudang)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Margomulyo, Surabaya" 
                  value={muat}
                  onChange={(e) => setMuat(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F1115] border border-slate-700 rounded-lg text-white text-sm focus:border-white focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">🏁 Titik Bongkar (Tujuan)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Kawasan Industri JIIPE, Gresik" 
                  value={bongkar}
                  onChange={(e) => setBongkar(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F1115] border border-slate-700 rounded-lg text-white text-sm focus:border-white focus:outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#E30613] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? 'Menghubungkan Satelit OSRM...' : 'Hitung Jarak & Tarif Kargo'}
                </button>
              </div>
            </form>

            {/* Hasil Kalkulasi Real-Time State */}
            {result && (
              <div className="mt-8 p-6 bg-[#0F1115] border border-emerald-500/40 rounded-xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✅ Kalkulasi Berhasil (Presisi Satelit)</span>
                  <span className="text-xs font-mono text-slate-400">ID Sesi: #OSRM-9821</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500 uppercase">Jarak Tempuh</p>
                    <p className="text-base font-bold text-white mt-1">{result.distance}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase">Estimasi Waktu</p>
                    <p className="text-base font-bold text-white mt-1">{result.duration}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase">Rekomendasi</p>
                    <p className="text-base font-bold text-white mt-1">🚚 {result.fleet}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase">Estimasi Tarif</p>
                    <p className="text-base font-extrabold text-[#E30613] mt-1">{result.estimateCost}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <a 
                    href="https://wa.me/6285813487753?text=Halo%20Admin%20Logistik%20Kita,%20saya%20ingin%20memesan%20armada%20berdasarkan%20hasil%20kalkulator." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-white text-black font-bold text-xs text-center uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Pesan Armada Ini via WhatsApp Sekarang
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SECTION ARMADA KARGO BERAT (SPACEX FULL-BLEED CARD STYLE) */}
      <section id="armada" className="py-24 px-6 md:px-16 bg-black border-t border-slate-800 space-y-16">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#E30613]">HEAVY CARGO FLEET</p>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
            Armada Tangguh Kelas Industri
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Dirancang khusus untuk muatan tonase besar, pabrik manufaktur, dan distribusi lintas provinsi.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-8 space-y-6 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="space-y-4">
              <span className="text-[10px] font-mono px-3 py-1 bg-red-950 text-red-400 rounded-full border border-red-800">KAPASITAS 4 TON</span>
              <h3 className="text-xl font-bold uppercase text-white">Pickup & CDD Bak</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solusi gesit untuk pengiriman logistik dalam kota, gang industri sempit, dan muatan material sedang.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <a href="#kalkulator" className="text-xs font-bold text-white uppercase tracking-wider hover:text-[#E30613] transition-colors inline-flex items-center gap-2">
                Cek Tarif Rute →
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-8 space-y-6 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="space-y-4">
              <span className="text-[10px] font-mono px-3 py-1 bg-red-950 text-red-400 rounded-full border border-red-800">KAPASITAS 15-20 TON</span>
              <h3 className="text-xl font-bold uppercase text-white">Fuso Bak & Wingbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                Andalan pabrik kertas, baja, dan consumer goods untuk distribusi lintas kota dan rute utama Jawa Timur.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <a href="#kalkulator" className="text-xs font-bold text-white uppercase tracking-wider hover:text-[#E30613] transition-colors inline-flex items-center gap-2">
                Cek Tarif Rute →
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-8 space-y-6 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="space-y-4">
              <span className="text-[10px] font-mono px-3 py-1 bg-red-950 text-red-400 rounded-full border border-red-800">KAPASITAS 25-35 TON</span>
              <h3 className="text-xl font-bold uppercase text-white">Tronton & Kontainer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Armada raksasa untuk muatan berat maksimal, ekspor-impor pelabuhan, dan proyek konstruksi skala nasional.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <a href="#kalkulator" className="text-xs font-bold text-white uppercase tracking-wider hover:text-[#E30613] transition-colors inline-flex items-center gap-2">
                Cek Tarif Rute →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER INDUSTRIAL */}
      <footer className="py-12 px-6 md:px-16 bg-black border-t border-slate-900 text-center text-xs text-slate-500 space-y-4">
        <p className="font-bold uppercase tracking-widest text-white">EMPATNADA.ID</p>
        <p>© 2026 PT Empatnada . All rights reserved. Designed by Phiphodz.</p>
      </footer>

    </div>
  );
}
