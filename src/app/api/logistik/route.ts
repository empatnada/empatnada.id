import { NextResponse } from "next/server";

// Helper untuk melakukan Geocoding alamat teks menjadi koordinat menggunakan Nominatim
async function getCoordinates(address: string) {
  try {
    // Jika input terlalu singkat (misal hanya kota), kita tambahkan "Jawa Timur, Indonesia" agar Nominatim mudah menemukannya
    let queryAddress = address.trim();
    if (queryAddress.toLowerCase() === "mojokerto") {
      queryAddress = "Mojokerto, Jawa Timur, Indonesia";
    } else if (queryAddress.toLowerCase().includes("tanjung perak")) {
      queryAddress = "Pelabuhan Tanjung Perak, Surabaya, Jawa Timur, Indonesia";
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryAddress)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "EmpatnadaLogistikApp/1.0 (admin@empatnada.id)"
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originAddress, destinationAddress } = body;

    if (!originAddress || !destinationAddress) {
      return NextResponse.json(
        { success: false, message: "Alamat muat dan alamat bongkar wajib diisi." },
        { status: 400 }
      );
    }

    const originCoord = await getCoordinates(originAddress);
    if (!originCoord) {
      return NextResponse.json(
        { success: false, message: `Titik koordinat untuk alamat muat "${originAddress}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const destinationCoord = await getCoordinates(destinationAddress);
    if (!destinationCoord) {
      return NextResponse.json(
        { success: false, message: `Titik koordinat untuk alamat bongkar "${destinationAddress}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoord.lon},${originCoord.lat};${destinationCoord.lon},${destinationCoord.lat}?overview=false`;
    
    const osrmResponse = await fetch(osrmUrl);
    const osrmData = await osrmResponse.json();

    if (!osrmData.routes || osrmData.routes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Gagal menghitung rute perjalanan dari OSRM." },
        { status: 500 }
      );
    }

    const distanceMeters = osrmData.routes[0].distance;
    const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100;
    
    const durationSeconds = osrmData.routes[0].duration;
    const durationMinutes = Math.round(durationSeconds / 60);

    return NextResponse.json({
      success: true,
      data: {
        origin: originCoord,
        destination: destinationCoord,
        distance_km: distanceKm,
        duration_minutes: durationMinutes,
      },
      message: "Berhasil menghitung rute dan jarak riil."
    });

  } catch (err: any) {
    console.error("API Logistik Route Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
