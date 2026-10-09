export default function LogistikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Membungkus khusus modul ini dengan logistik-theme
    <div data-theme="logistik-theme" className="min-h-screen bg-base-200 text-base-content">
      {children}
    </div>
  );
}
