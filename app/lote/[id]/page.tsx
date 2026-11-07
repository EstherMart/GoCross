import Link from "next/link";
import { processarLote, type ResultadoLote } from "@/lib/remessa";
import { brl } from "@/lib/formato";
import { iaDisponivel } from "@/lib/ia";
import { AbasLote } from "./AbasLote";

export const dynamic = "force-dynamic";

function Faixa({ r }: { r: ResultadoLote }) {
  return (
    <section className="sec" aria-label="Diagnóstico do lote">
      <div className="kpis">
        <div className="kpi"><div className="n">{r.decisoes.length}</div><div className="l">Conferidos ({brl(r.valorTotal)})</div></div>
        <div className="kpi ok"><div className="n">{r.remessa.length}</div><div className="l">Seguem na remessa ({brl(r.valorRemessa)})</div></div>
        <div className="kpi warn"><div className="n">{r.retirados.length}</div><div className="l">Retirados com evidência</div></div>
        <div className="kpi crit"><div className="n">{r.bloqueados.length}</div><div className="l">Pessoa acionada</div></div>
      </div>
      <p className="foot">
        {r.porCodigo} decididos por código e {r.porIA} com apoio da IA · {brl(r.valorRetido)} retidos antes do fechamento · canal de acionamento simulado.
        {!iaDisponivel() && " IA desligada (sem AI_PROXY_API_KEY): os ambíguos seguem retirados, nunca liberados."}
      </p>
    </section>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const r = await processarLote(params.id);
  return (
    <main className="container">
      <p className="foot"><Link href="/">← Remessas</Link></p>
      <h1>Lote {r.lote}</h1>
      <p className="lede">{r.banco} · data {r.dataPrevista} · fecha às {r.fechamento}</p>
      <Faixa r={r} />
      <AbasLote decisoes={r.decisoes} />
    </main>
  );
}
