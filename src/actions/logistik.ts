"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLogistikOrder(formData: FormData) {
  const supabase = await createClient();

  // 1. Autentikasi: Pastikan user sudah login & ambil id_user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: "Anda harus login untuk membuat pesanan." };
  }

  // 2. Ekstrak data dari Frontend (FormData)
  const rute_muat = formData.get("rute_muat") as string;
  const rute_bongkar = formData.get("rute_bongkar") as string;
  
  // Asumsi jarak didapat dari perhitungan Google Maps API di sisi Frontend sebelum submit
  const jarak_km = parseFloat(formData.get("jarak_km") as string) || 0; 
  
  // Data Fisik Barang
  const berat_aktual = parseFloat(formData.get("berat_kg") as string) || 0;
  const panjang = parseFloat(formData.get("dimensi_p") as string) || 0;
  const lebar = parseFloat(formData.get("dimensi_l") as string) || 0;
  const tinggi = parseFloat(formData.get("dimensi_t") as string) || 0;

  // 3. MESIN KALKULATOR LOGISTIK
  // Rumus Volumetrik Kargo Darat/Laut (PxLxT / 4000). Sesuaikan pembagi jika pakai standar udara (6000)
  const berat_volumetrik = (panjang * lebar * tinggi) / 4000;
  
  // Tentukan berat yang ditagihkan (Chargeable Weight) - Ambil nilai terbesar
  const chargeable_weight = Math.max(berat_aktual, berat_volumetrik);

  // Simulasi Tarif (Nanti bisa di-query dinamis dari tabel logistik_armada berdasarkan pilihan user)
  const tarif_per_kg = 5000; // Contoh: Rp 5.000 / Kg
  const tarif_per_km = 2000; // Contoh: Rp 2.000 / Km

  // Kalkulasi Dasar
  let total_harga = (chargeable_weight * tarif_per_kg) + (jarak_km * tarif_per_km);

  // Cek Layanan Tambahan (Add-ons)
  const isPackingKayu = formData.get("addon_packing") === "true";
  const isAsuransi = formData.get("addon_asuransi") === "true";

  if (isPackingKayu) total_harga += 150000; // Flat rate packing kayu (contoh)
  if (isAsuransi) total_harga += (total_harga * 0.02); // Asuransi 2% dari nilai (contoh)

  // 4. Simpan ke Database (Tabel logistik_orders)
  const { data: orderData, error: insertError } = await supabase
    .from("logistik_orders")
    .insert({
      id_user: user.id,
      rute_muat: rute_muat,
      rute_bongkar: rute_bongkar,
      jarak_km: jarak_km,
      total_harga: Math.round(total_harga),
      status_bayar: "unpaid", // Status awal sesuai skenario manual
      status_kirim: "pending"
    })
    .select()
    .single();

  if (insertError) {
    console.error("Gagal membuat order:", insertError);
    return { success: false, message: "Terjadi kesalahan pada server saat membuat pesanan." };
  }

  // 5. Revalidasi cache halaman logistik agar data terbaru langsung muncul di UI
  revalidatePath("/logistik");

  // Jika sukses, kembalikan response. Frontend bisa menggunakan ini untuk me-redirect user ke halaman detail resi
  return { 
    success: true, 
    message: "Pesanan berhasil dibuat!", 
    id_resi: orderData.id_resi 
  };
}
