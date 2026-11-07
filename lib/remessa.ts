import { agenda } from "./dados";
import { decidir } from "./motor";
import type { Decisao } from "./tipos";

export type DecisaoLote = Decisao & { valor: number; fornecedor: string };

export type ResultadoLote = {
  lote: string;
  banco: string;
  fechamento: string;
  dataPrevista: string;
  decisoes: DecisaoLote[];
  remessa: string[]; // títulos liberados: o lote filtrado que segue ao banco
  retirados: string[];
  bloqueados: string[];
  valorTotal: number;
  valorRemessa: number;
  valorRetido: number;
  porCodigo: number;
  porIA: number;
};

export type ResumoLote = { lote: string; banco: string; fechamento: string; dataPrevista: string; titulos: number; valor: number };

export function listarLotes(): ResumoLote[] {
  const m = new Map<string, ResumoLote>();
  for (const a of agenda()) {
    const r = m.get(a.lote_remessa) ?? { lote: a.lote_remessa, banco: a.banco_pagador, fechamento: a.horario_fechamento, dataPrevista: a.data_prevista, titulos: 0, valor: 0 };
    r.titulos++;
    r.valor += Number(a.valor);
    m.set(a.lote_remessa, r);
  }
  return [...m.values()].sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista) || a.fechamento.localeCompare(b.fechamento));
}

// Saída 1: remessa filtrada. Saída 2: títulos retidos, os críticos com pedido de decisão à pessoa certa.
export async function processarLote(lote: string): Promise<ResultadoLote> {
  const titulos = agenda().filter((t) => t.lote_remessa === lote);
  const decisoes: DecisaoLote[] = [];
  for (let i = 0; i < titulos.length; i += 8) {
    const fatia = titulos.slice(i, i + 8);
    const ds = await Promise.all(fatia.map((t) => decidir(t.titulo_id)));
    ds.forEach((d, j) => decisoes.push({ ...d, valor: Number(fatia[j].valor), fornecedor: fatia[j].fornecedor_id }));
  }
  const soma = (xs: DecisaoLote[]) => xs.reduce((s, d) => s + d.valor, 0);
  const lib = decisoes.filter((d) => d.acao === "liberar");
  const ret = decisoes.filter((d) => d.acao === "retirar");
  const blq = decisoes.filter((d) => d.acao === "bloquear" || d.acao === "pedir_decisao");
  const p = titulos[0];
  return {
    lote,
    banco: p?.banco_pagador ?? "",
    fechamento: p?.horario_fechamento ?? "",
    dataPrevista: p?.data_prevista ?? "",
    decisoes,
    remessa: lib.map((d) => d.tituloId),
    retirados: ret.map((d) => d.tituloId),
    bloqueados: blq.map((d) => d.tituloId),
    valorTotal: soma(decisoes),
    valorRemessa: soma(lib),
    valorRetido: soma(ret) + soma(blq),
    porCodigo: decisoes.filter((d) => d.decididoPor === "codigo").length,
    porIA: decisoes.filter((d) => d.decididoPor === "ia").length,
  };
}
