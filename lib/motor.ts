import { auditarLimpo, despachar, investigar, julgar } from "./agente";
import { tituloPorId } from "./dados";
import { classificar } from "./niveis";
import { coletarSinais } from "./sinais";
import type { Decisao } from "./tipos";

export async function decidir(tituloId: string): Promise<Decisao> {
  const titulo = tituloPorId(tituloId);
  if (!titulo) return classificar(tituloId, [], false);
  let d = classificar(tituloId, coletarSinais(titulo), true);
  d.rastro = [{ agente: "Código", origem: "codigo", texto: d.nivel === 1 ? "Sem sinais de risco: liberado." : `Sinais: ${d.evidencias.join(" · ")}` }];
  d = await investigar(titulo, d);
  d = await julgar(titulo, d);
  d = await auditarLimpo(titulo, d);
  return despachar(titulo, d);
}
