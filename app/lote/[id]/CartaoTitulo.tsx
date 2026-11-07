"use client";

import { useState } from "react";
import { ACAO, NIVEL, brl, rotuloRegra } from "@/lib/formato";
import type { DecisaoLote } from "@/lib/remessa";

type Resposta = "ok" | "segura" | null;

const RESPOSTA_ROTULO = {
  ok: "Pessoa respondeu “ok”: título liberado (simulado)",
  segura: "Pessoa respondeu “segura”: título mantido bloqueado (simulado)",
} as const;

function LinhaDoTempo({ rastro }: { rastro: DecisaoLote["rastro"] }) {
  return (
    <ol className="timeline">
      {rastro.map((p, i) => (
        <li key={i}>
          <span className={`tag ${p.origem}`}>{p.origem === "ia" ? "IA" : "Código"}</span>
          <strong> {p.agente}</strong>
          <div>{p.texto}</div>
        </li>
      ))}
    </ol>
  );
}

function PedidoDecisao({ pedido }: { pedido: NonNullable<DecisaoLote["pedido"]> }) {
  const [resposta, setResposta] = useState<Resposta>(null);
  return (
    <div className="msg">
      <div className="foot">
        Pedido enviado a {pedido.nome} <span className="chip">canal simulado</span>
      </div>
      <div>{pedido.mensagem}</div>
      {resposta ? (
        <p className="resposta">{RESPOSTA_ROTULO[resposta]}</p>
      ) : (
        <>
          <p className="foot">Sem resposta até o fechamento, o título fica fora da remessa. Simular resposta:</p>
          <div className="acoes">
            <button className="btn" onClick={() => setResposta("ok")}>Ok, liberar</button>
            <button className="btn" onClick={() => setResposta("segura")}>Segura</button>
          </div>
        </>
      )}
    </div>
  );
}

export function CartaoTitulo({ d }: { d: DecisaoLote }) {
  return (
    <article className={`titulo n${d.nivel}`}>
      <header className="titulo-h">
        <div>
          <strong>{d.tituloId}</strong>
          <div className="foot">{d.fornecedor}</div>
        </div>
        <div className="titulo-meta">
          <span className="valor">{brl(d.valor)}</span>
          <span className={`pill n${d.nivel}`}>{NIVEL[d.nivel]}</span>
          <span className="acao">{ACAO[d.acao]}</span>
        </div>
      </header>

      <p className="porque"><strong>Por quê:</strong> {d.motivo}</p>
      <p className="foot">
        Regra <span className="chip regra" title={d.regra}>{rotuloRegra(d.regra)}</span>
      </p>

      {d.evidencias.length > 0 && (
        <ul className="evidencias">
          {d.evidencias.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <details>
        <summary>Rastro dos agentes ({d.rastro.length} passos)</summary>
        <LinhaDoTempo rastro={d.rastro} />
      </details>

      {d.pedido && <PedidoDecisao pedido={d.pedido} />}
    </article>
  );
}
