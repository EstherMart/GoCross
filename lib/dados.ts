import { readFileSync } from "node:fs";
import path from "node:path";
import { parseCsv } from "./csv";
import type { Linha } from "./tipos";

const PASTA = path.join(process.cwd(), "data", "pagamentos");
const cache = new Map<string, Linha[]>();

export function carregar(arquivo: string): Linha[] {
  const hit = cache.get(arquivo);
  if (hit) return hit;
  const sep = arquivo === "extrato_banco_litoral.csv" ? ";" : ",";
  const linhas = parseCsv(readFileSync(path.join(PASTA, arquivo), "utf8"), sep);
  cache.set(arquivo, linhas);
  return linhas;
}

export const agenda = () => carregar("agenda_remessa.csv");
export const tituloPorId = (id: string) =>
  carregar("contas_a_pagar.csv").find((t) => t.titulo_id === id);
