import { calcularProva } from "../lib/prova";
import { usoTotal } from "../lib/ia";

// Roda o motor sobre data/gabarito/gabarito.csv (ver GABARITO.md): acerto por tipologia e por grupo
// (ajuste x validação), o que passou, placar em R$ e custo. A tela /prova usa a mesma função.
async function main() {
const p = await calcularProva();
if (p.casos.length === 0) { console.log("Sem data/gabarito/gabarito.csv."); return; }
for (const t of p.porTipologia) console.log(`${t.tipologia}: ${t.ok}/${t.total}`);
for (const g of p.porGrupo) console.log(`grupo ${g.grupo}: ${g.ok}/${g.total}`);
console.log(`Falsos positivos G16: ${p.falsosPositivos}`);
console.log(`Placar: -R$ ${Math.abs(p.placar).toFixed(2)}`);
for (const c of p.passaram) console.log(`  errou ${c.cenario} ${c.tipologia}: esperado ${c.esperado}, obtido ${c.obtido}`);
console.log(`Agenda: ${p.agenda.titulos} títulos; código ${p.agenda.porCodigo}, IA ${p.agenda.porIA}`);
console.log(p.revisor.rodado ? `Júri: derrubou ${p.revisor.derrubou}/${p.revisor.plantadas} ações plantadas` : "Júri: não rodado (sem AI_PROXY_API_KEY)");
console.log(`IA: ${usoTotal.chamadas} chamadas, ${usoTotal.tokensEntrada}+${usoTotal.tokensSaida} tok, US$ ${usoTotal.usd.toFixed(6)}, ${usoTotal.ms} ms, ${usoTotal.falhas} falhas`);
}
main();
