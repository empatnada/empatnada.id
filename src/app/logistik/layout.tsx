export default function LogistikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Membungkus khusus modul ini dengan logistik-theme dan memaksa background base-100/200
    <div data-theme="logistik-theme" className="min-h-screen bg-base-100 text-base-content antialiased">
      {children}
    </div>
  );
}
