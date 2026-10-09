"use client";

import { useState } from "react";
// TODO: Uncomment import di bawah ini jika file action dari Backend sudah siap ditarik
// import { useActionState } from "react"; 
// import { createLogistikOrder } from "@/actions/logistik";

export default function LogistikPage() {
  // State dummy untuk simulasi Google Maps API (Jarak)
  const [jarakKm, setJarakKm] = useState<number | "">("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Simulasi kalkulasi jarak dari Client-Side
  const handleCalculateDistance = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setJarakKm(42.5); // Dummy jarak 42.5 KM
      setIsCalculating(false);
    }, 1200);
  };

  /* 
   * NOTE UNTUK TECH LEAD / BACKEND:
   * Saat ini menggunakan handleSubmit dummy agar UI bisa dites tanpa error di HP.
   * Jika backend sudah siap, hapus fungsi handleSubmit ini dan gunakan hook useActionState:
   * const [state, formAction, isPending] = useActionState(createLogistikOrder, null);
   * Lalu di tag <form>, ganti onSubmit={handleSubmit} menjadi action={formAction}
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    // Console log ini untuk membuktikan ke Tim Backend bahwa "name" atribut sudah sesuai
    console.log("Data siap kirim ke Server Action:", Object.fromEntries(formData));

    setTimeout(() => {
      setIsPending(false);
      alert("Pesanan Kargo Berhasil Dibuat! (Dummy Server Action)");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-10">
      
      {/* Header */}
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-primary">Buat Pesanan Kargo</h1>
        <p className="text-sm text-base-content/70 mt-1">Lengkapi data muatan dan rute pengiriman.</p>
      </div>

      {/* Main Form Card */}
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-300 mx-auto">
        <div className="card-body p-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECTION 1: RUTE & LOKASI --- */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold border-b pb-1 border-base-300">1. Rute Pengiriman</h2>
              
              <div className="form-control w-full">
                <label className="label px-0 py-1"><span className="label-text font-semibold">Alamat Muat (Origin)</span></label>
                <textarea 
                  name="rute_muat" 
                  className="textarea textarea-bordered h-20 focus:textarea-primary" 
                  placeholder="Contoh: Gudang Pabrik Cikarang, Jl. Industri No.1"
                  required
                ></textarea>
              </div>

              <div className="form-control w-full">
                <label className="label px-0 py-1"><span className="label-text font-semibold">Alamat Bongkar (Destination)</span></label>
                <textarea 
                  name="alamat_bongkar" 
                  className="textarea textarea-bordered h-20 focus:textarea-primary" 
                  placeholder="Contoh: Pelabuhan Tanjung Perak, Surabaya"
                  required
                ></textarea>
              </div>

              {/* Kalkulasi Jarak Client-Side */}
              <div className="form-control w-full pt-2">
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm btn-secondary"
                  onClick={handleCalculateDistance}
                  disabled={isCalculating}
                >
                  {isCalculating ? <span className="loading loading-dots"></span> : "📍 Hitung Jarak (Maps API)"}
                </button>
                {jarakKm && (
                  <p className="text-xs text-success font-medium mt-2">✓ Jarak terkalkulasi: {jarakKm} KM</p>
                )}
                {/* Input tersembunyi untuk dikirim ke Backend */}
                <input type="hidden" name="jarak_km" value={jarakKm} />
              </div>
            </div>

            {/* --- SECTION 2: SPESIFIKASI BARANG --- */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold border-b pb-1 border-base-300">2. Spesifikasi Muatan</h2>
              
              <div className="form-control w-full">
                <label className="label px-0 py-1"><span className="label-text font-semibold">Berat Total (Kg)</span></label>
                <input type="number" name="berat_kg" className="input input-bordered w-full focus:input-primary" placeholder="Misal: 1500" required />
              </div>

              <div className="form-control w-full">
                <label className="label px-0 py-1"><span className="label-text font-semibold">Dimensi (P x L x T) cm</span></label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" name="dimensi_p" className="input input-bordered w-full focus:input-primary text-center px-1" placeholder="P" required />
                  <input type="number" name="dimensi_l" className="input input-bordered w-full focus:input-primary text-center px-1" placeholder="L" required />
                  <input type="number" name="dimensi_t" className="input input-bordered w-full focus:input-primary text-center px-1" placeholder="T" required />
                </div>
              </div>
            </div>

            {/* --- SECTION 3: LAYANAN TAMBAHAN --- */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold border-b pb-1 border-base-300">3. Layanan Tambahan</h2>
              
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3 px-0 py-1">
                  <input type="checkbox" name="layanan_tkbm" className="checkbox checkbox-primary checkbox-sm" value="true" />
                  <span className="label-text font-medium">Butuh Tenaga Bongkar Muat (TKBM)</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3 px-0 py-1">
                  <input type="checkbox" name="layanan_tol" className="checkbox checkbox-primary checkbox-sm" value="true" />
                  <span className="label-text font-medium">Lewat Jalur Tol (Biaya Ekstra)</span>
                </label>
              </div>
            </div>

            {/* --- SUBMIT --- */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="btn btn-primary w-full text-base"
                disabled={isPending || !jarakKm}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Proses Pesanan"
                )}
              </button>
              {!jarakKm && (
                <p className="text-xs text-error text-center mt-2">
                  *Silakan hitung jarak terlebih dahulu sebelum memproses
                </p>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
