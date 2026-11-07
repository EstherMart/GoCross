import { carregar } from "../lib/dados";
import { coletarSinais } from "../lib/sinais/index";
// Histórico: títulos que humanos deixaram pagar (retorno 00) e que nossos detectores sinalizariam.
const pagos = new Map(carregar("retorno_remessa.csv").filter(r => r.codigo_ocorrencia === "00").map(r => [r.titulo_id, r]));
const aprov = new Map<string, string[]>();
for (const a of carregar("aprovacoes.csv")) aprov.set(a.titulo_id, [...(aprov.get(a.titulo_id) ?? []), a.decisao]);
const tits = carregar("contas_a_pagar.csv");
const res: Record<string, { n: number; valor: number; aprovadosHumano: number }> = {};
let pagosTotal = 0;
for (const t of tits) {
  if (!pagos.has(t.titulo_id)) continue;
  pagosTotal++;
  const s = coletarSinais(t);
  for (const tip of new Set(s.map(x => x.tipologia))) {
    const r = (res[tip] ??= { n: 0, valor: 0, aprovadosHumano: 0 });
    r.n++; r.valor += Number(t.valor);
    if ((aprov.get(t.titulo_id) ?? []).includes("aprovado")) r.aprovadosHumano++;
  }
}
console.log("títulos no histórico:", tits.length, "| pagos (retorno 00):", pagosTotal);
console.log("decisões em aprovacoes.csv:", [...new Set(carregar("aprovacoes.csv").map(a => a.decisao))].join(", "));
console.log(res);
