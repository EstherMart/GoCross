import type { Acao } from "./tipos";

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const NIVEL = { 1: "Baixo", 2: "Médio", 3: "Crítico" } as const;
export const ACAO = { liberar: "Liberado", retirar: "Retirado", bloquear: "Bloqueado", pedir_decisao: "Bloqueado" } as const;

const SECAO_ROTULO: Record<string, string> = {
  tres_vias: "Três vias",
  dados_bancarios: "Dados bancários",
  alcadas: "Alçadas",
  acionamento_humano: "Acionamento humano",
  seguranca: "Segurança",
  atraso: "Atraso",
  remessa: "Remessa",
};

const humanizar = (s: string) => {
  const t = s.replace(/_/g, " ").replace(/\./g, " · ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

// "tres_vias.titulo_x_duplicata" → "Três vias › Titulo x duplicata" (a chave bruta fica no title do elemento)
export const rotuloRegra = (regra: string) => {
  const [secao, ...resto] = regra.split(".");
  const nome = resto.join(".");
  return nome ? `${SECAO_ROTULO[secao] ?? humanizar(secao)} › ${humanizar(nome)}` : humanizar(regra);
};

export type Grupo = "bloqueado" | "retirado" | "liberado";

export const GRUPO_ROTULO: Record<Grupo, string> = {
  bloqueado: "Bloqueados · aguardam decisão",
  retirado: "Retirados do lote",
  liberado: "Liberados",
};

export const grupoDe = (acao: Acao): Grupo =>
  acao === "liberar" ? "liberado" : acao === "retirar" ? "retirado" : "bloqueado";
