"use client";

import { useEffect, useMemo, useState } from "react";
import type { DecisaoLote } from "@/lib/remessa";
import type { Passo } from "@/lib/tipos";

type Agente = Passo["agente"];
type No = { id: string; rotulo: string; agentes: Agente[]; ia?: boolean };
type Trilha = { id: "limpo" | "ambiguo" | "critico"; titulo: string; nos: No[]; saida: (d: DecisaoLote) => string };

const TRILHAS: Trilha[] = [
  {
    id: "limpo", titulo: "Sem sinal",
    nos: [{ id: "cod", rotulo: "Detectores (código)", agentes: ["Código"] }, { id: "aud", rotulo: "Auditor (amostra 1/20)", agentes: ["Auditor"], ia: true }],
    saida: () => "Remessa",
  },
  {
    id: "ambiguo", titulo: "Ambíguo (nível 2)",
    nos: [
      { id: "cod", rotulo: "Detectores (código)", agentes: ["Código"] },
      { id: "inv", rotulo: "Investigador", agentes: ["Investigador"], ia: true },
      { id: "pro", rotulo: "Promotor × Defensor", agentes: ["Promotor", "Defensor"], ia: true },
      { id: "jui", rotulo: "Juiz + travas", agentes: ["Juiz"], ia: true },
      { id: "des", rotulo: "Despachante", agentes: ["Despachante"] },
    ],
    saida: (d) => (d.pedido ? "Pessoa decide" : "Retirado"),
  },
  {
    id: "critico", titulo: "Crítico (nível 3)",
    nos: [{ id: "cod", rotulo: "Detectores (código)", agentes: ["Código"] }, { id: "des", rotulo: "Despachante", agentes: ["Despachante"] }],
    saida: () => "Pessoa decide",
  },
];

const passou = (d: DecisaoLote, n: No) => d.rastro.some((p) => n.agentes.includes(p.agente));
const trilhaDe = (d: DecisaoLote): Trilha["id"] =>
  d.rastro.some((p) => p.agente === "Investigador" || p.agente === "Juiz") ? "ambiguo" : d.nivel === 1 ? "limpo" : "critico";

export function Orquestracao({ decisoes }: { decisoes: DecisaoLote[] }) {
  const porTrilha = useMemo(() => {
    const m = { limpo: [] as DecisaoLote[], ambiguo: [] as DecisaoLote[], critico: [] as DecisaoLote[] };
    decisoes.forEach((d) => m[trilhaDe(d)].push(d));
    return m;
  }, [decisoes]);
  const destaque = decisoes.filter((d) => d.nivel > 1 || d.auditoria);
  const [sel, setSel] = useState(destaque.find((d) => trilhaDe(d) === "ambiguo")?.tituloId ?? destaque[0]?.tituloId ?? "");
  const [passo, setPasso] = useState(99);
  const atual = decisoes.find((d) => d.tituloId === sel);

  useEffect(() => {
    if (passo >= (atual?.rastro.length ?? 0)) return;
    const t = setTimeout(() => setPasso((p) => p + 1), 1100);
    return () => clearTimeout(t);
  }, [passo, atual]);

  const visiveis = atual ? atual.rastro.slice(0, passo + 1) : [];
  const aceso = (n: No) => visiveis.some((p) => n.agentes.includes(p.agente));

  return (
    <section className="card sec orq" aria-label="Orquestração dos agentes">
      <div className="card-h">Orquestração dos agentes neste lote</div>
      <div className="pad">
        {TRILHAS.map((tr) => {
          const ds = porTrilha[tr.id];
          const ativa = atual && trilhaDe(atual) === tr.id;
          const saidas = ds.reduce<Record<string, number>>((m, d) => ((m[tr.saida(d)] = (m[tr.saida(d)] ?? 0) + 1), m), {});
          return (
            <div key={tr.id} className={`trilha ${ativa ? "ativa" : ""}`}>
              <div className="trilha-t">{tr.titulo} <span className="foot">· {ds.length} títulos</span></div>
              <div className="fluxo">
                {tr.nos.map((n) => (
                  <div key={n.id} className={`no ${n.ia ? "ia" : ""} ${ativa && aceso(n) ? "on" : ""}`}>
                    <span className={`tag ${n.ia ? "ia" : "codigo"}`}>{n.ia ? "IA" : "Código"}</span>
                    <div>{n.rotulo}</div>
                    <strong>{ds.filter((d) => passou(d, n)).length}</strong>
                  </div>
                ))}
                <div className="no saida">
                  {Object.entries(saidas).map(([k, v]) => <div key={k}>{k}: <strong>{v}</strong></div>)}
                  {ds.length === 0 && <div className="foot">nenhum</div>}
                </div>
              </div>
            </div>
          );
        })}

        <div className="replay">
          <label className="foot" htmlFor="orq-sel">Ver o caminho de um título:</label>{" "}
          <select id="orq-sel" value={sel} onChange={(e) => { setSel(e.target.value); setPasso(0); }}>
            {destaque.map((d) => <option key={d.tituloId} value={d.tituloId}>{d.tituloId} · {trilhaDe(d)} · {d.acao}</option>)}
          </select>{" "}
          <button className="btn" onClick={() => setPasso(0)} disabled={!atual}>▶ Reproduzir</button>
          {atual && (
            <ol className="timeline">
              {visiveis.map((p, i) => (
                <li key={i}><span className={`tag ${p.origem}`}>{p.origem === "ia" ? "IA" : "Código"}</span><strong> {p.agente}</strong><div>{p.texto}</div></li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
