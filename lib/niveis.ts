import type { Acao, Decisao, Nivel, Sinal } from "./tipos";

const ACAO_POR_NIVEL: Record<Nivel, Acao> = { 1: "liberar", 2: "retirar", 3: "bloquear" };

// O crítico vence: um sinal de nível 3 nunca é liberado por um nível menor.
// Título não reconhecido (sem NF/cadastro) não é liberado.
export function classificar(tituloId: string, sinais: Sinal[], reconhecido: boolean): Decisao {
  const base = { tituloId, tipologias: [] as string[], rastro: [], decididoPor: "codigo" as const };
  if (!reconhecido) {
    return { ...base, nivel: 3, acao: "bloquear", regra: "nao_reconhecido", motivo: "Título não reconhecido nos dados", evidencias: [] };
  }
  if (sinais.length === 0) {
    return { ...base, nivel: 1, acao: "liberar", regra: "sem_sinais", motivo: "Nenhum sinal de risco", evidencias: [] };
  }
  const nivel = Math.max(...sinais.map((s) => s.nivel)) as Nivel;
  const dominantes = sinais.filter((s) => s.nivel === nivel);
  return {
    ...base,
    nivel,
    acao: ACAO_POR_NIVEL[nivel],
    regra: dominantes.map((s) => s.regra).join("; "),
    motivo: dominantes.map((s) => s.tipologia).join(", "),
    evidencias: sinais.map((s) => s.evidencia),
    tipologias: sinais.map((s) => s.tipologia),
  };
}
