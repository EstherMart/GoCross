import { listarLotes, processarLote } from "../lib/remessa";
import { usoTotal } from "../lib/ia";

// Mede por lote: quantos títulos acionam uma pessoa, quantos vão à fila de humano e quanto tempo o agente leva.
async function main() {
  const t0 = Date.now();
  let tit = 0, lib = 0, ret = 0, blq = 0, valorRet = 0;
  const porLote: string[] = [];
  for (const l of listarLotes()) {
    const t = Date.now();
    const r = await processarLote(l.lote);
    tit += r.decisoes.length; lib += r.remessa.length; ret += r.retirados.length; blq += r.bloqueados.length; valorRet += r.valorRetido;
    porLote.push(`${l.lote} ${l.banco}: ${r.decisoes.length} tít, ${r.remessa.length} lib, ${r.retirados.length} ret, ${r.bloqueados.length} humano, ${Date.now() - t} ms`);
  }
  console.log(porLote.join("\n"));
  console.log(`TOTAL ${tit} títulos em ${porLote.length} lotes: ${lib} liberados, ${ret} retirados, ${blq} acionam pessoa`);
  console.log(`Média por lote: ${(tit / porLote.length).toFixed(0)} títulos, ${(blq / porLote.length).toFixed(1)} acionamentos`);
  console.log(`Retido: R$ ${valorRet.toFixed(2)} | tempo total ${(Date.now() - t0) / 1000}s | IA ${usoTotal.chamadas} chamadas US$ ${usoTotal.usd.toFixed(6)}`);
}
main();
