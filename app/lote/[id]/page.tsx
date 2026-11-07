import Link from "next/link";
import { processarLote, type ResultadoLote } from "@/lib/remessa";
import { brl } from "@/lib/formato";
import { iaDisponivel } from "@/lib/ia";
import { FilaTitulos } from "./FilaTitulos";

export const dynamic = "force-dynamic";

function Resumo({ r }: { r: ResultadoLote }) {
  const retidos = r.retirados.length + r.bloqueados.length;
  return (
    <section className="card sec resumo">
      <div className="pad">
        <p>
          Antes do fechamento às <strong>{r.fechamento}</strong>, <strong>{retidos}</strong> de {r.decisoes.length} títulos foram retidos
          ({brl(r.valorRetido)}). <strong>{r.bloqueados.length}</strong> aguardam decisão de uma pessoa.
        </p>
        <p className="foot">
          {r.porCodigo} decididos por código e {r.porIA} com apoio da IA. Canal de acionamento simulado.
          {!iaDisponivel() && " IA desligada nesta execução (sem AI_PROXY_API_KEY): os ambíguos seguem retirados, nunca liberados."}
        </p>
      </div>
    </section>
  );
}

function Kpis({ r }: { r: ResultadoLote }) {
  return (
    <section className="kpis" aria-label="Diagnóstico do lote">
      <div className="kpi"><div className="n">{r.decisoes.length}</div><div className="l">Títulos conferidos ({brl(r.valorTotal)})</div></div>
      <div className="kpi ok"><div className="n">{r.remessa.length}</div><div className="l">Seguem na remessa ({brl(r.valorRemessa)})</div></div>
      <div className="kpi warn"><div className="n">{r.retirados.length}</div><div className="l">Retirados com evidência</div></div>
      <div className="kpi crit"><div className="n">{r.bloqueados.length}</div><div className="l">Bloqueados, pessoa acionada</div></div>
    </section>
  );
}

// Tela 2: diagnóstico do lote. Bloqueados primeiro (pedem decisão), depois retirados; liberados na remessa final.
export default async function Page({ params }: { params: { id: string } }) {
  const r = await processarLote(params.id);
  return (
    <main className="container">
      <p className="foot"><Link href="/">← Remessas</Link></p>
      <h1>Lote {r.lote}</h1>
      <p className="lede">{r.banco} · data {r.dataPrevista} · fecha às {r.fechamento}</p>
      <Resumo r={r} />
      <Kpis r={r} />
      <FilaTitulos decisoes={r.decisoes} />
    </main>
  );
}
