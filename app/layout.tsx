import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KWC Contract Generator",
  description:
    "Professionele contractgenerator voor Kunst-Waardecheques (KWC)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full">
      <body className="min-h-full bg-zinc-100 font-sans text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
