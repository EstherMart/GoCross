"use client";

import type { DecisaoLote } from "@/lib/remessa";
import { montarCsvRemessa } from "@/lib/remessaCsv";

export function BaixarCsv({ liberados, lote }: { liberados: DecisaoLote[]; lote: string }) {
  const baixar = () => {
    const blob = new Blob([montarCsvRemessa(liberados)], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `remessa-${lote}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <button className="btn primario" onClick={baixar} disabled={liberados.length === 0}>
      Baixar remessa (CSV)
    </button>
  );
}
