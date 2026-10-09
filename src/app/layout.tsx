import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Revisi 1: Mengubah Judul Tab Browser & Meta SEO
export const metadata: Metadata = {
  title: "empatnada.id | Modul Logistik Kita",
  description: "Sistem Manajemen Kargo dan Logistik B2B",
};

// Revisi 2: Memperbaiki tipe data children agar tidak error TypeScript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Revisi 3: Mengubah bahasa ke Indonesia
      data-theme="corporate" // Revisi 4: INI JALAN PINTAS TEMA CORPORATE
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
