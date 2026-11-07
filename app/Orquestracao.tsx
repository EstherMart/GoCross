"use client";

import { useEffect, useRef, useState } from "react";
import type { Caso, Fluxo } from "@/lib/remessa";
import type { Passo } from "@/lib/tipos";

type NoId = "triagem" | "auditor" | "investigador" | "promotor" | "defensor" | "juiz" | "despachante" | "remessa" | "fora";
type No = { id: NoId; nome: string; papel: string; tipo: "ia" | "ferramenta" | "saida"; x: number; y: number };
type Linha = { chave: number; tipo: "titulo" | "passo" | "fim"; origem?: Passo["origem"]; agente?: string; texto: string };

const NOS: No[] = [
  { id: "triagem", nome: "Triagem", papel: "regra exata", tipo: "ferramenta", x: 9, y: 50 },
  { id: "auditor", nome: "Auditor", papel: "1 em 20", tipo: "ia", x: 36, y: 14 },
  { id: "investigador", nome: "Investigador", papel: "lê as evidências", tipo: "ia", x: 36, y: 50 },
  { id: "promotor", nome: "Promotor", papel: "acusa com prova", tipo: "ia", x: 56, y: 30 },
  { id: "defensor", nome: "Defensor", papel: "defende", tipo: "ia", x: 56, y: 70 },
  { id: "juiz", nome: "Juiz", papel: "veredito", tipo: "ia", x: 74, y: 50 },
  { id: "despachante", nome: "Despachante", papel: "bloqueia", tipo: "ferramenta", x: 74, y: 88 },
  { id: "remessa", nome: "Remessa", papel: "segue ao banco", tipo: "saida", x: 93, y: 14 },
  { id: "fora", nome: "Fora da remessa", papel: "retirado ou bloqueado", tipo: "saida", x: 93, y: 70 },
];

const ARESTAS: [NoId, NoId][] = [
  ["triagem", "auditor"], ["auditor", "remessa"],
  ["triagem", "investigador"], ["investigador", "promotor"], ["investigador", "defensor"],
  ["promotor", "juiz"], ["defensor", "juiz"], ["juiz", "fora"], ["juiz", "despachante"],
  ["triagem", "despachante"], ["despachante", "fora"],
];

const NO_DO_AGENTE: Record<Passo["agente"], NoId> = {
  Código: "triagem", Investigador: "investigador", Promotor: "promotor", Defensor: "defensor", Juiz: "juiz", Auditor: "auditor", Despachante: "despachante",
};

const PASSO_MS = 1100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const POS = Object.fromEntries(NOS.map((n) => [n.id, n])) as Record<NoId, No>;

function caminho(a: NoId, b: NoId) {
  const [x1, y1, x2, y2] = [POS[a].x * 10, POS[a].y * 4.2, POS[b].x * 10, POS[b].y * 4.2];
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

type Props = { fluxo: Fluxo; ids?: string[]; casos?: Caso[]; titulo: string };

export function Orquestracao({ fluxo, ids = [], casos = [], titulo }: Props) {
  const [rodando, setRodando] = useState(false);
  const [feito, setFeito] = useState(false);
  const [ativo, setAtivo] = useState<NoId | null>(null);
  const [visitados, setVisitados] = useState<NoId[]>([]);
  const [arestas, setArestas] = useState<string[]>([]);
  const [log, setLog] = useState<Linha[]>([]);
  const [progresso, setProgresso] = useState(0);
  const viva = useRef(true);
  const contador = useRef(0);

  useEffect(() => () => { viva.current = false; }, []);

  const lista = casos.length ? casos.map((c) => c.tituloId) : ids;
  const obter = (id: string): Promise<Caso> =>
    Promise.resolve(casos.find((c) => c.tituloId === id) ?? fetch(`/api/conferir?id=${id}`).then((r) => r.json()));

  const escrever = (l: Omit<Linha, "chave">) => setLog((atual) => [...atual.slice(-9), { ...l, chave: contador.current++ }]);

  async function tocar(c: Caso) {
    let vistos: NoId[] = [];
    let acesas: string[] = [];
    setVisitados([]);
    setArestas([]);
    escrever({ tipo: "titulo", texto: c.tituloId });
    const chegar = (no: NoId) => {
      acesas = [...acesas, ...ARESTAS.filter(([de, para]) => para === no && vistos.includes(de)).map(([de, para]) => `${de}-${para}`)];
      vistos = [...vistos, no];
      setAtivo(no);
      setVisitados(vistos);
      setArestas(acesas);
    };
    for (const p of c.rastro) {
      if (!viva.current) return;
      chegar(NO_DO_AGENTE[p.agente]);
      escrever({ tipo: "passo", origem: p.origem, agente: p.agente, texto: p.texto });
      await sleep(PASSO_MS);
    }
    chegar(c.acao === "liberar" ? "remessa" : "fora");
    escrever({ tipo: "fim", texto: c.acao === "liberar" ? "segue na remessa" : "fora da remessa" });
    await sleep(PASSO_MS);
  }

  async function rodar() {
    setRodando(true);
    setFeito(false);
    setLog([]);
    setProgresso(0);
    const pendentes = lista.map(obter);
    for (const [i, p] of pendentes.entries()) {
      try {
        await tocar(await p);
      } catch {
        escrever({ tipo: "fim", texto: `${lista[i]}: falha ao conferir` });
      }
      if (!viva.current) return;
      setProgresso(i + 1);
    }
    setAtivo(null);
    setVisitados([]);
    setArestas([]);
    setRodando(false);
    setFeito(true);
  }

  const contagem: Partial<Record<NoId, number>> = {
    triagem: fluxo.total, auditor: fluxo.auditados, investigador: fluxo.ambiguos, promotor: fluxo.ambiguos,
    defensor: fluxo.ambiguos, juiz: fluxo.ambiguos, remessa: fluxo.limpos, fora: fluxo.ambiguos + fluxo.criticos,
  };

  return (
    <section className="palco sec" aria-label={titulo}>
      <header className="palco-h">
        <span className="palco-t">{titulo}</span>
        <span className="palco-acoes">
          {lista.length > 0 && rodando && <span className="progresso">{progresso}/{lista.length}</span>}
          <button className="btn lima" onClick={rodar} disabled={rodando || lista.length === 0}>
            {rodando ? "Conferindo…" : feito ? "Rodar de novo" : "Rodar conferência"}
          </button>
        </span>
      </header>

      <div className="palco-corpo">
        <div className="rolagem">
          <div className="grafo">
            <svg viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden>
              {ARESTAS.map(([de, para]) => (
                <path key={`${de}-${para}`} d={caminho(de, para)} className={`aresta ${arestas.includes(`${de}-${para}`) ? "on" : ""}`} />
              ))}
            </svg>
            {NOS.map((n) => (
              <div
                key={n.id}
                className={`no ${n.tipo} ${visitados.includes(n.id) ? "visto" : ""} ${ativo === n.id ? "ativo" : ""} ${n.id === "remessa" ? "ok" : n.id === "fora" ? "crit" : ""}`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span className="no-n">{n.nome}</span>
                <span className="no-p">{n.papel}</span>
                {contagem[n.id] !== undefined && <span className="no-c">{contagem[n.id]}</span>}
                {n.tipo === "ia" && <i className="no-ia">IA</i>}
              </div>
            ))}
          </div>
        </div>

        <ol className="terminal" aria-live="polite">
          {log.length === 0 && <li className="vazio">aguardando conferência</li>}
          {log.map((l) => (
            <li key={l.chave} className={`${l.tipo} ${l.origem ?? ""}`}>
              {l.tipo === "titulo" && <>▸ {l.texto}</>}
              {l.tipo === "passo" && <><b>{l.agente}</b> {l.texto}</>}
              {l.tipo === "fim" && <>↳ {l.texto}</>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
