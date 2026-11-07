"use client";

import Link from "next/link";
import { useState } from "react";
import type { ResumoLote } from "@/lib/remessa";
import { brl } from "@/lib/formato";

function Status({ l }: { l: ResumoLote }) {
  const excecoes = l.fluxo.ambiguos + l.fluxo.criticos;
  if (excecoes === 0) return <span className="pill n1">Pronto</span>;
  return (
    <span className={`pill ${l.fluxo.criticos ? "n3" : "n2"}`}>
      {excecoes} {excecoes === 1 ? "exceção" : "exceções"}
    </span>
  );
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Lotes({ lotes }: { lotes: ResumoLote[] }) {
  const [q, setQ] = useState("");
  const termo = norm(q.trim());
  const vistos = termo
    ? lotes.filter((l) => norm(`${l.lote} ${l.banco} ${l.dataPrevista} ${l.fechamento}`).includes(termo))
    : lotes;

  return (
    <section className="card">
      <div className="card-h busca-h">
        <span>Lotes por horário de fechamento</span>
        <input
          type="search"
          className="busca"
          placeholder="Buscar remessa, banco ou data"
          aria-label="Buscar remessa"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="scroll">
        <table>
          <thead>
            <tr><th>Lote</th><th>Banco</th><th>Fecha</th><th className="num">Títulos</th><th className="num">Valor</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {vistos.map((l) => (
              <tr key={l.lote}>
                <td>{l.lote}</td>
                <td>{l.banco}</td>
                <td>{l.dataPrevista} · {l.fechamento}</td>
                <td className="num">{l.fluxo.total}</td>
                <td className="num">{brl(l.valor)}</td>
                <td><Status l={l} /></td>
                <td><Link className="btn" href={`/lote/${l.lote}`}>Conferir lote</Link></td>
              </tr>
            ))}
            {vistos.length === 0 && (
              <tr><td colSpan={7} className="empty">Nenhuma remessa encontrada para “{q}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
