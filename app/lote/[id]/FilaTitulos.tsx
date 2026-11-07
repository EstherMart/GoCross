"use client";

import { useMemo, useState } from "react";
import { GRUPO_ROTULO, brl, grupoDe, type Grupo } from "@/lib/formato";
import type { DecisaoLote } from "@/lib/remessa";
import { montarCsvRemessa } from "@/lib/remessaCsv";
import { CartaoTitulo } from "./CartaoTitulo";

type Filtro = Grupo | "todos";

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "bloqueado", rotulo: "Bloqueados" },
  { id: "retirado", rotulo: "Retirados" },
];

const GRUPOS_EXIBIDOS: Grupo[] = ["bloqueado", "retirado"];

const casaBusca = (d: DecisaoLote, termo: string) =>
  `${d.tituloId} ${d.fornecedor}`.toLowerCase().includes(termo);

export function FilaTitulos({ decisoes }: { decisoes: DecisaoLote[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLowerCase();

  const visiveis = useMemo(() => decisoes.filter((d) => casaBusca(d, termo)), [decisoes, termo]);
  const liberados = visiveis.filter((d) => grupoDe(d.acao) === "liberado");

  return (
    <>
      <div className="filtros">
        {FILTROS.map((f) => (
          <button key={f.id} className={`filtro ${filtro === f.id ? "ativo" : ""}`} onClick={() => setFiltro(f.id)}>
            {f.rotulo}
          </button>
        ))}
        <input
          type="search"
          placeholder="Buscar título ou fornecedor"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar título ou fornecedor"
        />
      </div>

      {GRUPOS_EXIBIDOS.filter((g) => filtro === "todos" || filtro === g).map((g) => {
        const itens = visiveis.filter((d) => grupoDe(d.acao) === g);
        const total = itens.reduce((s, d) => s + d.valor, 0);
        return (
          <section key={g} className="sec">
            <h2 className="grupo-h">
              {GRUPO_ROTULO[g]} ({itens.length}) <span className="foot">{brl(total)}</span>
            </h2>
            {itens.length === 0 ? <div className="empty">Nenhum título neste grupo.</div> : itens.map((d) => <CartaoTitulo key={d.tituloId} d={d} />)}
          </section>
        );
      })}

      <RemessaFinal liberados={liberados} />
    </>
  );
}

function baixarCsv(liberados: DecisaoLote[]) {
  const blob = new Blob([montarCsvRemessa(liberados)], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "remessa-final.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function RemessaFinal({ liberados }: { liberados: DecisaoLote[] }) {
  const total = liberados.reduce((s, d) => s + d.valor, 0);
  return (
    <section className="card sec">
      <div className="card-h remessa-h">
        <span>Remessa final · {liberados.length} títulos · {brl(total)}</span>
        <button className="btn" onClick={() => baixarCsv(liberados)} disabled={liberados.length === 0}>Baixar CSV</button>
      </div>
      <div className="scroll remessa-lista">
        <table>
          <thead><tr><th>Título</th><th>Fornecedor</th><th className="num">Valor</th></tr></thead>
          <tbody>
            {liberados.map((d) => (
              <tr key={d.tituloId}><td>{d.tituloId}</td><td>{d.fornecedor}</td><td className="num">{brl(d.valor)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
