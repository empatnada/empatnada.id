"use client";

import { useState } from "react";

export default function LogistikPage() {
  const [jarakKm, setJarakKm] = useState<number | "">("");
  const [isFallback, setIsFallback] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Kalkulasi jarak nyata via API Backend (Nominatim & OSRM)
  const handleCalculateDistance = async () => {
    const originInput = (document.querySelector('textarea[name="rute_muat"]') as HTMLTextAreaElement)?.value;
    const destInput = (document.querySelector('textarea[name="alamat_bongkar"]') as HTMLTextAreaElement)?.value;

    if (!originInput || !destInput) {
      alert("Mohon isi Alamat Muat dan Alamat Bongkar terlebih dahulu.");
      return;
    }

    setIsCalculating(true);
    try {
      const res = await fetch("/api/logistik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originAddress: originInput,
          destinationAddress: destInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menghitung jarak dari server.");
      }

      setJarakKm(data.data.distance_km);
      setIsFallback(data.data.is_fallback || false);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghubungi API Maps.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Kirim data pesanan ke backend (logistik_orders) dengan status pending_verification
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setSuccessMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      origin_address: formData.get("rute_muat"),
      destination_address: formData.get("alamat_bongkar"),
      distance_km: Number(formData.get("jarak_km")),
      is_fallback: isFallback,
      weight_kg: Number(formData.get("berat_kg")),
      dimension_p: Number(formData.get("dimensi_p")),
      dimension_l: Number(formData.get("dimensi_l")),
      dimension_t: Number(formData.get("dimensi_t")),
      customer_phone: formData.get("customer_phone"), // Anti-Fiktif WhatsApp
      needs_tkbm: formData.get("layanan_tkbm") === "true",
      needs_toll: formData.get("layanan_tol") === "true",
    };

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan pesanan ke server.");
      }

      setSuccessMessage("Pesanan Berhasil Dibuat! Menunggu Verifikasi Admin.");
      form.reset();
      setJarakKm("");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat mengirim pesanan.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-10">
      
      {/* Header */}
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-primary">Buat Pesanan Kargo</h1>
        <p className="text-sm text-base-content/70 mt-1">Lengkapi data muatan dan rute pengiriman real-time.</p>
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

              {/* Kalkulasi Jarak Real-Time OSRM */}
              <div className="form-control w-full pt-2">
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm btn-secondary"
                  onClick={handleCalculateDistance}
                  disabled={isCalculating}
                >
                  {isCalculating ? <span className="loading loading-dots"></span> : "📍 Hitung Jarak (Maps API)"}
                </button>
                {jarakKm !== "" && (
                  <p className="text-xs text-success font-medium mt-2">✓ Jarak terkalkulasi: {jarakKm} KM</p>
                )}
                <input type="hidden" name="jarak_km" value={jarakKm.toString()} />
              </div>
            </div>

            {/* --- SECTION 2: SPESIFIKASI BARANG & KONTAK --- */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold border-b pb-1 border-base-300">2. Spesifikasi & Kontak</h2>
              
              <div className="form-control w-full">
                <label className="label px-0 py-1"><span className="label-text font-semibold">Nomor WhatsApp (Verifikasi)</span></label>
                <input type="tel" name="customer_phone" className="input input-bordered w-full focus:input-primary" placeholder="Contoh: 081234567890" required />
              </div>

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
                disabled={isPending || jarakKm === ""}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Proses Pesanan"
                )}
              </button>
              {successMessage && (
                <p className="text-xs text-success font-semibold text-center mt-2">
                  {successMessage}
                </p>
              )}
              {jarakKm === "" && !successMessage && (
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
