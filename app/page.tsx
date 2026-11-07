import { listarLotes, somarFluxos } from "@/lib/remessa";
import { brl } from "@/lib/formato";
import { Lotes } from "./Lotes";

export const dynamic = "force-dynamic";

export default function Page() {
  const lotes = listarLotes();
  const semana = somarFluxos(lotes.map((l) => l.fluxo));

  return (
    <main className="container">
      <h1>Remessas da semana</h1>
      <p className="lede">{lotes.length} lotes · {semana.total} títulos · {brl(lotes.reduce((s, l) => s + l.valor, 0))}</p>
      <Lotes lotes={lotes} />
    </main>
  );
}
