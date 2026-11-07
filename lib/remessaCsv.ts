import type { DecisaoLote } from "./remessa";

export function montarCsvRemessa(liberados: DecisaoLote[]): string {
  const linhas = liberados.map((d) => `${d.tituloId};${d.fornecedor};${d.valor.toFixed(2)}`);
  return ["titulo_id;fornecedor_id;valor", ...linhas].join("\n");
}
