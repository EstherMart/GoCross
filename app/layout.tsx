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
      <body>
        <header className="topbar">
          <span className="logo">GoCross</span>
          <span className="sub">Conferência de pagamentos antes da remessa</span>
          <nav className="nav">
            <Link href="/">Remessas</Link>
            <Link href="/prova">Prova</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
