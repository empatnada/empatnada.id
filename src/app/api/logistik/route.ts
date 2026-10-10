import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
// Pastikan variabel environment ini sudah ada di file .env.local Anda
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi Cerdas: Caching & Fetching
async function getCoordinates(address: string) {
  const cleanAddress = address.toLowerCase().trim();

  // 1. CEK DATABASE (SUPABASE) TERLEBIH DAHULU (Super Cepat & Gratis)
  const { data: cachedData, error: cacheError } = await supabase
    .from('location_cache')
    .select('*')
    .eq('query_text', cleanAddress)
    .single();

  if (cachedData) {
    console.log(`[CACHE HIT] Menggunakan data lokal untuk: ${cleanAddress}`);
    return {
      lat: parseFloat(cachedData.latitude),
      lon: parseFloat(cachedData.longitude),
      display_name: cachedData.display_name
    };
  }

  // 2. JIKA KOSONG, CARI KE INTERNET (NOMINATIM API)
  console.log(`[CACHE MISS] Mengambil data dari internet untuk: ${cleanAddress}`);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(url, { headers: { "User-Agent": "EmpatnadaLogistikApp/1.0" } });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.length > 0) {
      const result = { 
        lat: parseFloat(data[0].lat), 
        lon: parseFloat(data[0].lon), 
        display_name: data[0].display_name 
      };

      // 3. SIMPAN HASIL KE DATABASE (Crowdsourcing Otomatis)
      // Orang berikutnya yang mencari alamat ini akan mengambil dari database kita!
      await supabase.from('location_cache').insert([
        {
          query_text: cleanAddress,
          latitude: result.lat,
          longitude: result.lon,
          display_name: result.display_name,
          data_source: 'nominatim' // Provider Agnostic, siap untuk Google Maps
        }
      ]);

      return result;
    }
    return null;
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    // Fallback darurat jika koneksi API Codespaces terputus
    return { lat: -7.2575, lon: 112.7521, display_name: `${address} (Estimasi Koordinat)` };
  }
}

export async function POST(request: Request) {
  try {
    const { originAddress, destinationAddress } = await request.json();

    if (!originAddress || !destinationAddress) {
      return NextResponse.json({ success: false, message: "Alamat muat dan bongkar wajib diisi." }, { status: 400 });
    }

    const originCoord = await getCoordinates(originAddress);
    const destinationCoord = await getCoordinates(destinationAddress);

    if (!originCoord || !destinationCoord) {
      return NextResponse.json({ 
        success: false, 
        message: "Sistem kami kesulitan menemukan titik tersebut. Coba gunakan nama kota yang lebih umum." 
      }, { status: 404 });
    }

    let distanceKm = 45;
    let durationMinutes = 60;
    let isFallback = false;

    // Hitung rute jarak (OSRM)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoord.lon},${originCoord.lat};${destinationCoord.lon},${destinationCoord.lat}?overview=false`;
      const osrmResponse = await fetch(osrmUrl);
      if (osrmResponse.ok) {
        const osrmData = await osrmResponse.json();
        if (osrmData.routes && osrmData.routes.length > 0) {
          distanceKm = Math.round((osrmData.routes[0].distance / 1000) * 100) / 100;
          durationMinutes = Math.round(osrmData.routes[0].duration / 60);
        }
      } else {
        throw new Error("OSRM Network Error");
      }
    } catch (osrmErr) {
      isFallback = true;
      const dLat = Math.abs(originCoord.lat - destinationCoord.lat);
      const dLon = Math.abs(originCoord.lon - destinationCoord.lon);
      distanceKm = Math.round((Math.sqrt(dLat * dLat + dLon * dLon) * 111) * 100) / 100;
    }

    return NextResponse.json({
      success: true,
      data: {
        origin: originCoord,
        destination: destinationCoord,
        distance_km: distanceKm > 0 ? distanceKm : 15,
        duration_minutes: durationMinutes,
        is_fallback: isFallback 
      }
    });

  } catch (err: any) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server internal." }, { status: 500 });
  }
}
