import FloatingWhatsApp from "../../components/FloatingWhatsApp";

export default function LogistikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="logistik-theme" className="min-h-screen bg-base-100 text-base-content antialiased relative">
      {children}
      <FloatingWhatsApp />
    </div>
  );
}
