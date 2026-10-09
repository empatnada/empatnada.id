import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Biarkan kosong dulu, nanti ini jadi tugas Tim Backend (Tahap 2)
  return NextResponse.next();
}

// Konfigurasi route mana saja yang akan dicek proxy
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
