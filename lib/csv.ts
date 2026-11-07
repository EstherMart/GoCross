import type { Linha } from "./tipos";

export function parseCsv(texto: string, sep = ","): Linha[] {
  const t = texto.replace(/^﻿/, "");
  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let aspas = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (aspas) {
      if (c === '"' && t[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === sep) { linha.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      linha.push(campo); campo = "";
      if (linha.some((x) => x !== "")) linhas.push(linha);
      linha = [];
    } else campo += c;
  }
  if (campo !== "" || linha.length) { linha.push(campo); linhas.push(linha); }
  const [cab, ...resto] = linhas;
  if (!cab) return [];
  return resto.map((r) => Object.fromEntries(cab.map((h, i) => [h, r[i] ?? ""])));
}

// "1.234,56" (extrato Litoral) -> 1234.56 ; "1234.56" -> 1234.56
export function numeroBr(v: string): number {
  return v.includes(",") ? Number(v.replace(/\./g, "").replace(",", ".")) : Number(v);
}
