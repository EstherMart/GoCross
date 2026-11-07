import Link from "next/link";
import { listarLotes } from "@/lib/remessa";
import { brl } from "@/lib/formato";

export const dynamic = "force-dynamic";

// Tela 1: fila de remessas. Cada lote fecha num horário; o agente confere tudo antes disso.
export default function Page() {
  const lotes = listarLotes();
  return (
    <main className="container">
      <h1>Remessas</h1>
      <p className="lede">
        {lotes.length} lotes na agenda. O agente confere cada título antes do fechamento e libera, retira ou bloqueia sozinho. Pessoa só no crítico.
      </p>
      <section className="card">
        <div className="card-h">Fila de lotes</div>
        <div className="scroll">
          <table>
            <thead>
              <tr><th>Lote</th><th>Banco</th><th>Data</th><th>Fecha</th><th className="num">Títulos</th><th className="num">Valor</th><th></th></tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr key={l.lote}>
                  <td>{l.lote}</td>
                  <td>{l.banco}</td>
                  <td>{l.dataPrevista}</td>
                  <td>{l.fechamento}</td>
                  <td className="num">{l.titulos}</td>
                  <td className="num">{brl(l.valor)}</td>
                  <td><Link className="btn" href={`/lote/${l.lote}`}>Ver diagnóstico</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="foot">GoCross · GoHacks Talent 2026. Canal de decisão simulado.</p>
    </main>
  );
}
