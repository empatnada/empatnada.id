import { createClient } from "../../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
  const statusKirim = searchParams.get("kirim") || "all";
  const statusBayar = searchParams.get("bayar") || "all";

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, data: [], message: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("logistik_orders")
    .select(`*, users_extended ( phone_number )`)
    .order("created_at", { ascending: false });

  if (statusKirim !== "all") query = query.eq("status_kirim", statusKirim);
  if (statusBayar !== "all") query = query.eq("status_bayar", statusBayar);

  if (searchQuery.trim() !== "") {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchQuery);
    if (isUUID) {
      query = query.eq("id_resi", searchQuery.trim());
    }
  }

  const { data: orders, error } = await query;
  if (error) {
    return NextResponse.json({ success: false, data: [], message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: orders, message: "OK" });
}

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
