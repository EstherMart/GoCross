import { julgar } from "../lib/agente/index";
import { decidir } from "../lib/motor";
import { tituloPorId } from "../lib/dados";
import { lerGabarito } from "../lib/prova";
// Modo sombra: o júri julga os críticos como se pudesse decidir; não muda nada.
async function main() {
  for (const c of lerGabarito().filter((c) => c.tipologia === "G04" || c.tipologia === "G05")) {
    const d = await decidir(c.titulo_id);
    const r = await julgar(tituloPorId(c.titulo_id)!, { ...d, nivel: 2, acao: "retirar", rastro: [] });
    console.log(c.cenario_id, c.tipologia, "esperado:", c.acao_esperada, "| júri:", r.rastro.map((p) => `${p.agente}: ${p.texto}`).join(" | "));
  }
}
main();
