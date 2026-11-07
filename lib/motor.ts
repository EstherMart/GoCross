import { auditarLimpo, despachar, investigar, revisar } from "./agente";
import { tituloPorId } from "./dados";
import { classificar } from "./niveis";
import { coletarSinais } from "./sinais";
import type { Decisao } from "./tipos";

// Código decide o que é exato; a IA entra só nos ambíguos (nível 2) e no revisor. Nunca por título limpo.
export async function decidir(tituloId: string): Promise<Decisao> {
  const titulo = tituloPorId(tituloId);
  if (!titulo) return classificar(tituloId, [], false);
  let d = classificar(tituloId, coletarSinais(titulo), true);
  d.rastro = [{ agente: "Código", origem: "codigo", texto: d.nivel === 1 ? "Sem sinais de risco: liberado." : `Sinais: ${d.evidencias.join(" · ")}` }];
  d = await investigar(titulo, d);
  d = await revisar(titulo, d);
  d = await auditarLimpo(titulo, d);
  return despachar(titulo, d);
}
