import { naAmostraDoLimpo } from "./agente";
import { agenda, tituloPorId } from "./dados";
import { decidir } from "./motor";
import { classificar } from "./niveis";
import { coletarSinais } from "./sinais";
import type { Decisao, Nivel } from "./tipos";

export type DecisaoLote = Decisao & { valor: number; fornecedor: string };

export type Fluxo = {
  total: number;
  limpos: number;
  auditados: number;
  ambiguos: number;
  criticos: number;
};

export type ResultadoLote = {
  lote: string;
  banco: string;
  fechamento: string;
  dataPrevista: string;
  liberados: DecisaoLote[];
  excecoes: DecisaoLote[];
  valorRemessa: number;
  valorRetido: number;
  fluxo: Fluxo;
};

export type ResumoLote = {
  lote: string;
  banco: string;
  fechamento: string;
  dataPrevista: string;
  valor: number;
  fluxo: Fluxo;
};

export const fluxoVazio = (): Fluxo => ({ total: 0, limpos: 0, auditados: 0, ambiguos: 0, criticos: 0 });

export const somarFluxos = (fs: Fluxo[]): Fluxo =>
  fs.reduce((a, f) => ({
    total: a.total + f.total,
    limpos: a.limpos + f.limpos,
    auditados: a.auditados + f.auditados,
    ambiguos: a.ambiguos + f.ambiguos,
    criticos: a.criticos + f.criticos,
  }), fluxoVazio());

const nivelDe = (tituloId: string): Nivel => {
  const t = tituloPorId(tituloId);
  return classificar(tituloId, t ? coletarSinais(t) : [], Boolean(t)).nivel;
};

function rotearPorCodigo(f: Fluxo, tituloId: string) {
  const nivel = nivelDe(tituloId);
  f.total++;
  if (nivel === 1) {
    f.limpos++;
    if (naAmostraDoLimpo(tituloId)) f.auditados++;
  } else if (nivel === 2) f.ambiguos++;
  else f.criticos++;
}

const passouPeloJuri = (d: Decisao) => d.rastro.some((p) => p.agente === "Investigador" || p.agente === "Juiz");

const soma = (xs: DecisaoLote[]) => xs.reduce((s, d) => s + d.valor, 0);

export function listarLotes(): ResumoLote[] {
  const m = new Map<string, ResumoLote>();
  for (const a of agenda()) {
    const r = m.get(a.lote_remessa) ?? {
      lote: a.lote_remessa,
      banco: a.banco_pagador,
      fechamento: a.horario_fechamento,
      dataPrevista: a.data_prevista,
      valor: 0,
      fluxo: fluxoVazio(),
    };
    r.valor += Number(a.valor);
    rotearPorCodigo(r.fluxo, a.titulo_id);
    m.set(a.lote_remessa, r);
  }
  return [...m.values()].sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista) || a.fechamento.localeCompare(b.fechamento));
}

export async function processarLote(lote: string): Promise<ResultadoLote> {
  const titulos = agenda().filter((t) => t.lote_remessa === lote);
  const decisoes: DecisaoLote[] = [];
  for (let i = 0; i < titulos.length; i += 24) {
    const fatia = titulos.slice(i, i + 24);
    const ds = await Promise.all(fatia.map((t) => decidir(t.titulo_id)));
    ds.forEach((d, j) => decisoes.push({ ...d, valor: Number(fatia[j].valor), fornecedor: fatia[j].fornecedor_id }));
  }
  const liberados = decisoes.filter((d) => d.acao === "liberar");
  const excecoes = decisoes.filter((d) => d.acao !== "liberar").sort((a, b) => b.nivel - a.nivel || b.valor - a.valor);
  const ambiguos = decisoes.filter(passouPeloJuri);
  const p = titulos[0];
  return {
    lote,
    banco: p?.banco_pagador ?? "",
    fechamento: p?.horario_fechamento ?? "",
    dataPrevista: p?.data_prevista ?? "",
    liberados,
    excecoes,
    valorRemessa: soma(liberados),
    valorRetido: soma(excecoes),
    fluxo: {
      total: decisoes.length,
      limpos: liberados.length,
      auditados: decisoes.filter((d) => d.auditoria).length,
      ambiguos: ambiguos.length,
      criticos: decisoes.length - liberados.length - ambiguos.length,
    },
  };
}

export type Caso = Pick<Decisao, "tituloId" | "acao" | "rastro">;

export const casoDe = (d: Decisao): Caso => ({ tituloId: d.tituloId, acao: d.acao, rastro: d.rastro });

export function amostraDemo(): string[] {
  const porNivel: Record<Nivel, string[]> = { 1: [], 2: [], 3: [] };
  for (const a of agenda()) porNivel[nivelDe(a.titulo_id)].push(a.titulo_id);
  const auditado = porNivel[1].find(naAmostraDoLimpo);
  return [...(auditado ? [auditado] : []), ...porNivel[2].slice(0, 4), ...porNivel[3].slice(0, 2)];
}
