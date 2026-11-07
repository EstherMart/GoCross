export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const NIVEL = { 1: "Baixo", 2: "Médio", 3: "Crítico" } as const;
export const ACAO = { liberar: "Liberado", retirar: "Retirado", bloquear: "Bloqueado", pedir_decisao: "Bloqueado" } as const;
