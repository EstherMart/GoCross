import Link from "next/link";
import { casoDe, processarLote } from "@/lib/remessa";
import { brl } from "@/lib/formato";
import { iaDisponivel } from "@/lib/ia";
import { Orquestracao } from "../../Orquestracao";
import { BaixarCsv } from "./BaixarCsv";
import { Excecao } from "./Excecao";
import { Abas } from "./Abas";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const r = await processarLote(params.id);
  const base = [...r.excecoes.slice(0, 6), ...r.liberados.filter((d) => d.auditoria).slice(0, 1)];
  // Lote sem exceção também precisa tocar: completa com alguns liberados.
  const extras = r.liberados.filter((d) => !base.includes(d)).slice(0, Math.max(0, 3 - base.length));
  const casosDoLote = [...base, ...extras].map(casoDe);

  return (
    <main className="container">
      <p className="foot voltar"><Link href="/">← Remessas da semana</Link></p>
      <h1>Lote {r.lote}</h1>
      <p className="lede">{r.banco} · {r.dataPrevista} · fecha às {r.fechamento}</p>
      {!iaDisponivel() && <p className="msg">IA desligada (sem AI_PROXY_API_KEY): os ambíguos seguem retirados, nunca liberados.</p>}

      <Abas abas={[
        { id: "agentes", rotulo: "Agentes", conteudo: <Orquestracao fluxo={r.fluxo} casos={casosDoLote} titulo="Agentes · lote" /> },
        { id: "fora", rotulo: `Fora da remessa · ${r.excecoes.length}`, conteudo: (
      <section className="card sec">
        <div className="card-h">Fora da remessa · {r.excecoes.length} títulos · {brl(r.valorRetido)}</div>
        {r.excecoes.length === 0 ? (
          <div className="empty">Nenhuma exceção: o lote segue inteiro.</div>
        ) : (
          r.excecoes.map((d) => <Excecao key={d.tituloId} d={d} />)
        )}
      </section>
        ) },
        { id: "remessa", rotulo: `Remessa final · ${r.liberados.length}`, conteudo: (
      <section className="card sec">
        <div className="card-h remessa-h">
          <span>Remessa final · {r.liberados.length} títulos · {brl(r.valorRemessa)}</span>
          <BaixarCsv liberados={r.liberados} lote={r.lote} />
        </div>
        <details className="lista">
          <summary className="pad">Ver os {r.liberados.length} títulos</summary>
          <div className="scroll remessa-lista">
            <table>
              <thead><tr><th>Título</th><th>Fornecedor</th><th className="num">Valor</th></tr></thead>
              <tbody>
                {r.liberados.map((d) => (
                  <tr key={d.tituloId}><td>{d.tituloId}</td><td>{d.fornecedor}</td><td className="num">{brl(d.valor)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
        ) },
      ]} />
    </main>
  );
}
