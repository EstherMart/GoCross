import { processarLote } from "@/lib/remessa";

export const dynamic = "force-dynamic";

const NIVEL = { 1: "Baixo", 2: "Médio", 3: "Crítico" } as const;
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Page({ searchParams }: { searchParams: { lote?: string } }) {
  const r = processarLote(searchParams.lote ?? "RM20261103-MER");
  return (
    <>
      <header className="topbar">
        <span className="logo">GoCross</span>
        <span className="sub">Conferência de pagamentos antes da remessa</span>
      </header>
      <main className="container">
        <h1>Lote {r.lote}</h1>
        <p className="lede">Cada título é conferido antes do fechamento. A pessoa só entra no nível crítico.</p>

        <section className="kpis" aria-label="Resumo do lote">
          <div className="kpi"><div className="n">{r.decisoes.length}</div><div className="l">Títulos conferidos</div></div>
          <div className="kpi ok"><div className="n">{r.remessa.length}</div><div className="l">Liberados</div></div>
          <div className="kpi warn"><div className="n">{r.retirados.length}</div><div className="l">Retirados</div></div>
          <div className="kpi crit"><div className="n">{r.aguardandoDecisao.length}</div><div className="l">Aguardando decisão</div></div>
        </section>

        <section className="card">
          <div className="card-h">Títulos do lote</div>
          {r.decisoes.length === 0 ? (
            <div className="empty">Nenhum título encontrado para este lote.</div>
          ) : (
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th className="num">Valor</th>
                    <th>Nível</th>
                    <th>Ação</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {r.decisoes.map((d) => (
                    <tr key={d.tituloId}>
                      <td>{d.tituloId}</td>
                      <td className="num">{brl(d.valor)}</td>
                      <td><span className={`pill n${d.nivel}`}>{NIVEL[d.nivel]}</span></td>
                      <td>{d.acao}</td>
                      <td>{d.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <p className="foot">GoCross · GoHacks Talent 2026. Canal de decisão simulado.</p>
      </main>
    </>
  );
}
