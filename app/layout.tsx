import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "GoCross · conferência de pagamentos",
  description: "O GoCross confere cada título do lote antes do fechamento da remessa.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="topbar">
          <Link href="/" className="logo" role="img" aria-label="GoCross" />
          <nav className="nav">
            <Link href="/">Remessas</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
