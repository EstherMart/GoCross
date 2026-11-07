import Link from "next/link";
import { processarLote } from "@/lib/remessa";
import { ACAO, NIVEL, brl } from "@/lib/formato";
import { iaDisponivel } from "@/lib/ia";

export const dynamic = "force-dynamic";

// Tela 2: diagnóstico final do lote. Remessa filtrada, retidos com motivo e pedidos às pessoas (nível 3).
export default async function Page({ params }: { params: { id: string } }) {
  const r = await processarLote(params.id);
  const retidos = r.decisoes.filter((d) => d.acao !== "liberar");
  const pedidos = r.decisoes.filter((d) => d.pedido);
  return (
    <main className="container">
      <p className="foot"><Link href="/">← Remessas</Link></p>
      <h1>Lote {r.lote}</h1>
      <p className="lede">{r.banco} · data {r.dataPrevista} · fecha às {r.fechamento}</p>

      <section className="kpis" aria-label="Diagnóstico final">
        <div className="kpi"><div className="n">{r.decisoes.length}</div><div className="l">Títulos conferidos</div></div>
        <div className="kpi ok"><div className="n">{r.remessa.length}</div><div className="l">Seguem na remessa ({brl(r.valorRemessa)})</div></div>
        <div className="kpi warn"><div className="n">{r.retirados.length}</div><div className="l">Retirados com evidência</div></div>
        <div className="kpi crit"><div className="n">{r.bloqueados.length}</div><div className="l">Bloqueados, pessoa acionada</div></div>
      </section>

      <section className="card sec">
        <div className="card-h">Diagnóstico final</div>
        <div className="pad">
          <p>
            Remessa filtrada com <strong>{r.remessa.length}</strong> títulos ({brl(r.valorRemessa)}). Retidos antes do fechamento: <strong>{brl(r.valorRetido)}</strong>.
            Decisão por código em {r.porCodigo} títulos e com apoio da IA em {r.porIA}.
            {!iaDisponivel() && " IA desligada nesta execução (sem AI_PROXY_API_KEY): os ambíguos seguem retirados, nunca liberados."}
          </p>
          <p className="foot">Pessoa acionada em {pedidos.length} de {r.decisoes.length} títulos. Canal simulado.</p>
        </div>
      </section>

      <section className="card sec">
        <div className="card-h">Retidos e bloqueados ({retidos.length})</div>
        {retidos.length === 0 ? (
          <div className="empty">Nada retido neste lote.</div>
        ) : (
          <div className="scroll">
            <table>
              <thead><tr><th>Título</th><th className="num">Valor</th><th>Nível</th><th>Ação</th><th>Rastro dos agentes</th></tr></thead>
              <tbody>
                {retidos.map((d) => (
                  <tr key={d.tituloId}>
                    <td>{d.tituloId}<div className="foot">{d.fornecedor}</div></td>
                    <td className="num">{brl(d.valor)}</td>
                    <td><span className={`pill n${d.nivel}`}>{NIVEL[d.nivel]}</span></td>
                    <td>{ACAO[d.acao]}<div className="foot">{d.motivo}</div></td>
                    <td>
                      {d.rastro.map((p, i) => (
                        <div key={i} className="passo"><span className={`tag ${p.origem}`}>{p.origem === "ia" ? "IA" : "Código"}</span> <strong>{p.agente}:</strong> {p.texto}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pedidos.length > 0 && (
        <section className="card sec">
          <div className="card-h">Pedidos de decisão <span className="chip">canal simulado</span></div>
          <div className="pad">
            {pedidos.map((d) => (
              <div key={d.tituloId} className="msg">
                <div className="foot">Para {d.pedido!.nome}</div>
                <div>{d.pedido!.mensagem}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <details className="card sec">
        <summary className="card-h">Remessa final: {r.remessa.length} títulos liberados</summary>
        <div className="pad mono">{r.remessa.join(", ")}</div>
      </details>
    </main>
  );
}
