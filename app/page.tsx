import Link from "next/link";
import { listarLotes, somarFluxos, type ResumoLote } from "@/lib/remessa";
import { brl } from "@/lib/formato";

export const dynamic = "force-dynamic";

function Status({ l }: { l: ResumoLote }) {
  const excecoes = l.fluxo.ambiguos + l.fluxo.criticos;
  if (excecoes === 0) return <span className="pill n1">Pronto</span>;
  return (
    <span className={`pill ${l.fluxo.criticos ? "n3" : "n2"}`}>
      {excecoes} {excecoes === 1 ? "exceção" : "exceções"}
    </span>
  );
}

export default function Page() {
  const lotes = listarLotes();
  const semana = somarFluxos(lotes.map((l) => l.fluxo));

  return (
    <main className="container">
      <h1>Remessas da semana</h1>
      <p className="lede">{lotes.length} lotes · {semana.total} títulos · {brl(lotes.reduce((s, l) => s + l.valor, 0))}</p>
      <section className="card">
        <div className="card-h">Lotes por horário de fechamento</div>
        <div className="scroll">
          <table>
            <thead>
              <tr><th>Lote</th><th>Banco</th><th>Fecha</th><th className="num">Títulos</th><th className="num">Valor</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr key={l.lote}>
                  <td>{l.lote}</td>
                  <td>{l.banco}</td>
                  <td>{l.dataPrevista} · {l.fechamento}</td>
                  <td className="num">{l.fluxo.total}</td>
                  <td className="num">{brl(l.valor)}</td>
                  <td><Status l={l} /></td>
                  <td><Link className="btn" href={`/lote/${l.lote}`}>Abrir e conferir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
