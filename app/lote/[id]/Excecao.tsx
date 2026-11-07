import { ACAO, brl, rotuloRegra } from "@/lib/formato";
import type { DecisaoLote } from "@/lib/remessa";

export function Excecao({ d }: { d: DecisaoLote }) {
  return (
    <details className={`exc n${d.nivel}`}>
      <summary>
        <span className="exc-id"><strong>{d.tituloId}</strong><span className="foot">{d.fornecedor}</span></span>
        <span className="exc-motivo">{d.motivo}{d.decididoPor === "ia" && <span className="tag ia">IA</span>}</span>
        <span className="num">{brl(d.valor)}</span>
        <span className={`pill n${d.nivel}`}>{ACAO[d.acao]}</span>
      </summary>
      <div className="dossie">
        <p className="foot">Regra <span className="chip regra" title={d.regra}>{rotuloRegra(d.regra)}</span></p>
        {d.evidencias.length > 0 && (
          <ul className="evidencias">{d.evidencias.map((e, i) => <li key={i}>{e}</li>)}</ul>
        )}
        <ol className="timeline">
          {d.rastro.map((p, i) => (
            <li key={i}>
              <span className={`tag ${p.origem}`}>{p.origem === "ia" ? "IA" : "Código"}</span> <strong>{p.agente}</strong>
              <div>{p.texto}</div>
            </li>
          ))}
        </ol>
        {d.pedido && <p className="msg">Dossiê enviado a {d.pedido.nome} para registro (canal simulado).</p>}
      </div>
    </details>
  );
}
