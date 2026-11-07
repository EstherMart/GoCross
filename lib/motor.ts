import { auditarLimpo, despachar, investigar, julgar } from "./agente";
import { tituloPorId } from "./dados";
import { classificar } from "./niveis";
import { coletarSinais } from "./sinais";
import type { Decisao } from "./tipos";

// Memória do processo: cada título passa pela IA uma vez por sessão do servidor (reiniciar limpa).
const memo = new Map<string, Promise<Decisao>>();

export function decidir(tituloId: string): Promise<Decisao> {
  let p = memo.get(tituloId);
  if (!p) {
    p = decidirSemMemo(tituloId);
    memo.set(tituloId, p);
    p.catch(() => memo.delete(tituloId));
  }
  return p;
}

async function decidirSemMemo(tituloId: string): Promise<Decisao> {
  const titulo = tituloPorId(tituloId);
  if (!titulo) return classificar(tituloId, [], false);
  let d = classificar(tituloId, coletarSinais(titulo), true);
  d.rastro = [{ agente: "Código", origem: "codigo", texto: d.nivel === 1 ? "Sem sinais de risco: liberado." : `Sinais: ${d.evidencias.join(" · ")}` }];
  d = await investigar(titulo, d);
  d = await julgar(titulo, d);
  d = await auditarLimpo(titulo, d);
  return despachar(titulo, d);
}
