import { julgar } from "../lib/agente/index";
import { decidir } from "../lib/motor";
import { tituloPorId } from "../lib/dados";
import { lerGabarito } from "../lib/prova";

const SOMBRA = new Set(["G04", "G05", "G16"]);

async function main() {
  const casos = lerGabarito().filter((c) => SOMBRA.has(c.tipologia));
  let fraudeLiberada = 0, legitimoRetido = 0, fraudes = 0, legitimos = 0;
  for (const c of casos) {
    const real = await decidir(c.titulo_id);
    const juri = await julgar(tituloPorId(c.titulo_id)!, { ...real, nivel: 2, acao: "retirar", rastro: [] });
    const veredito = juri.nivel === 3 ? "pessoa" : juri.acao;
    const fraude = c.acao_esperada === "bloquear";
    if (fraude) { fraudes++; if (veredito === "liberar") fraudeLiberada++; }
    else { legitimos++; if (veredito !== "pessoa") legitimoRetido++; }
    console.log(`${c.cenario_id} ${c.tipologia} esperado=${c.acao_esperada} agente=${real.acao} juri=${veredito} | ${juri.rastro.at(-1)?.texto ?? ""}`);
  }
  console.log(`Fraude liberada pelo júri: ${fraudeLiberada}/${fraudes} | Legítimo retido pelo júri sem pessoa: ${legitimoRetido}/${legitimos}`);
}
main();
