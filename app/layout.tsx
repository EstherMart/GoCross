import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "GoCross · conferência de pagamentos",
  description: "O GoCross confere cada título do lote antes do fechamento da remessa.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
