import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1A1A] flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGASI (Kiri) */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-slate-100 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="h-16 px-6 flex items-center border-b border-slate-800">
            <span className="font-extrabold tracking-wider text-lg text-white">
              EMPATNADA <span className="text-[#E30613]">ADMIN</span>
            </span>
          </div>

          {/* Menu Navigasi */}
          <nav className="p-4 space-y-1">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-[#4338CA] text-white transition-colors"
            >
              📦 Manajemen Resi
            </Link>
            <Link 
              href="/admin/articles" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              📝 CMS Artikel
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/api/auth/logout" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            🚪 Keluar Sesi
          </Link>
        </div>
      </aside>

      {/* KANVAS UTAMA (Kanan) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Operasional Logistik</span>
          </div>

          {/* Profil Admin / Sinyal Sesi */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">Super Admin</p>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                Sesi Aktif (Supabase)
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
              SA
            </div>
          </div>
        </header>

        {/* KONTEN UTAMA HALAMAN ADMIN */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}
