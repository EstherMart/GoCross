import { listarLotes, processarLote } from "../lib/remessa";
import { usoTotal } from "../lib/ia";

async function main() {
  const t0 = Date.now();
  let tit = 0, lib = 0, ret = 0, blq = 0, valorRet = 0;
  const porLote: string[] = [];
  for (const l of listarLotes()) {
    const t = Date.now();
    const r = await processarLote(l.lote);
    const nRet = r.excecoes.filter((d) => d.acao === "retirar").length;
    const nBlq = r.excecoes.length - nRet;
    tit += r.liberados.length + r.excecoes.length; lib += r.liberados.length; ret += nRet; blq += nBlq; valorRet += r.valorRetido;
    porLote.push(`${l.lote} ${l.banco}: ${l.fluxo.total} tít, ${r.liberados.length} lib, ${nRet} ret, ${nBlq} bloq, ${Date.now() - t} ms`);
  }
  console.log(porLote.join("\n"));
  console.log(`TOTAL ${tit} títulos em ${porLote.length} lotes: ${lib} liberados, ${ret} retirados, ${blq} bloqueados`);
  console.log(`Média por lote: ${(tit / porLote.length).toFixed(0)} títulos, ${(blq / porLote.length).toFixed(1)} bloqueados`);
  console.log(`Retido: R$ ${valorRet.toFixed(2)} | tempo total ${(Date.now() - t0) / 1000}s | IA ${usoTotal.chamadas} chamadas US$ ${usoTotal.usd.toFixed(6)}, ${usoTotal.falhas} falhas`);
}
main();
