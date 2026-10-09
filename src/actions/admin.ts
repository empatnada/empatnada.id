"use server";

import { createClient } from "../utils/supabase/server";

export async function getAdminOrders(
  searchQuery?: string,
  statusKirim?: string,
  statusBayar?: string
) {
  const supabase = await createClient();

  // 1. Verifikasi Sesi (Keamanan Lapis Kedua di luar RLS)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, data: [], message: "Unauthorized. Sesi tidak valid." };
  }

  // 2. Mulai merangkai Query ke logistik_orders
  // Kita melakukan JOIN (relasi) ke tabel users_extended untuk menarik phone_number klien
  let query = supabase
    .from("logistik_orders")
    .select(`
      *,
      users_extended ( phone_number )
    `)
    .order("created_at", { ascending: false });

  // 3. Terapkan Filter Status (jika parameter dikirim dari Frontend dan bukan 'all')
  if (statusKirim && statusKirim !== "all") {
    query = query.eq("status_kirim", statusKirim);
  }
  if (statusBayar && statusBayar !== "all") {
    query = query.eq("status_bayar", statusBayar);
  }

  // 4. Terapkan Pencarian (Search Bar)
  if (searchQuery && searchQuery.trim() !== "") {
    // Catatan Backend: Karena id_resi bertipe UUID, pencarian parsial (ilike) bisa menyebabkan error di Postgres.
    // Jika format input adalah UUID valid (panjang 36 karakter), kita gunakan pencarian presisi (Exact Match).
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchQuery);
    
    if (isUUID) {
      query = query.eq("id_resi", searchQuery.trim());
    } else {
      // Jika butuh mencari nama/nomor HP klien via search bar, kita bisa memfilter berdasarkan relasi
      query = query.eq("users_extended.phone_number", searchQuery.trim());
    }
  }

  // 5. Eksekusi Query
  const { data: orders, error } = await query;

  if (error) {
    console.error("Gagal mengambil data pesanan:", error.message);
    return { success: false, data: [], message: "Gagal memuat data dari database." };
  }

  return { success: true, data: orders, message: "Data berhasil dimuat." };
}

// Fungsi untuk Admin mengubah status resi
export async function updateOrderStatus(id_resi: string, updateData: { status_kirim?: string; status_bayar?: string }) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("logistik_orders")
    .update(updateData)
    .eq("id_resi", id_resi);

  if (error) {
    return { success: false, message: "Gagal memperbarui status: " + error.message };
  }

  return { success: true, message: "Status pesanan berhasil diperbarui!" };
}
