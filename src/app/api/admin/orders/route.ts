import { createClient } from "../../../../utils/supabase/server";
import { NextResponse } from "next/server";

// 1. GET: Digunakan oleh Admin untuk melihat list pesanan (dengan proteksi auth)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const statusKirim = searchParams.get("kirim") || "all";
    const statusBayar = searchParams.get("bayar") || "all";
    const statusFilter = searchParams.get("status"); // Filter status workflow (pending_verification, verified, dll)

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, data: [], message: "Unauthorized: Sesi tidak valid." }, { status: 401 });
    }

    let query = supabase
      .from("logistik_orders")
      .select(`*, users_extended ( phone_number )`)
      .order("created_at", { ascending: false });

    if (statusKirim !== "all") query = query.eq("status_kirim", statusKirim);
    if (statusBayar !== "all") query = query.eq("status_bayar", statusBayar);
    if (statusFilter) query = query.eq("status", statusFilter);

    if (searchQuery.trim() !== "") {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchQuery);
      if (isUUID) {
        query = query.eq("id_resi", searchQuery.trim());
      }
    }

    const { data: orders, error } = await query;
    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ success: false, data: [], message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: orders || [], message: "OK" });
  } catch (err: any) {
    console.error("API Catch Error:", err);
    return NextResponse.json({ success: false, data: [], message: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// 2. POST: Digunakan oleh Publik untuk membuat pesanan baru (Masuk ke logistik_orders dengan status pending_verification)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      distance_km,
      is_fallback,
      weight_kg,
      dimension_p,
      dimension_l,
      dimension_t,
      customer_phone,
      needs_tkbm,
      needs_toll,
    } = body;

    if (!origin_address || !destination_address || !customer_phone || !weight_kg) {
      return NextResponse.json(
        { success: false, message: "Data rute, berat, dan nomor WhatsApp pemesan wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("logistik_orders")
      .insert([
        {
          origin_address,
          destination_address,
          distance_km,
          is_fallback: is_fallback || false,
          weight_kg,
          dimension_p: dimension_p || 0,
          dimension_l: dimension_l || 0,
          dimension_t: dimension_t || 0,
          customer_phone,
          needs_tkbm: needs_tkbm || false,
          needs_toll: needs_toll || false,
          status: 'pending_verification', // Status awal anti-fiktif
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat dan sedang menunggu verifikasi admin.",
      data: data
    });

  } catch (err: any) {
    console.error("Create Order Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Gagal memproses pesanan ke database." },
      { status: 500 }
    );
  }
}

// 3. PATCH: Digunakan oleh Admin untuk memperbarui data / status pesanan
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_resi, updateData } = body;

    const supabase = await createClient();
    const { error } = await supabase
      .from("logistik_orders")
      .update(updateData)
      .eq("id_resi", id_resi);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Berhasil diperbarui" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
