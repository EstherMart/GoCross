import { carregar, agenda } from "./dados";
import { cnpjRaiz, nfNormalizada } from "./normalizar";
import type { Linha } from "./tipos";

type Indices = {
  fornecedor: Map<string, Linha>;
  alteracoes: Map<string, Linha[]>;
  chaveTitulo: Map<string, Linha[]>; // fornecedor|nf normalizada|parcela
  nfPorEmitenteNumero: Map<string, Linha>; // raiz do CNPJ|nf normalizada
  duplicatas: Map<string, Linha[]>; // chave_acesso
  dataPrevista: Map<string, string>; // titulo_id -> data da remessa
};
let cache: Indices | null = null;

export const chaveTitulo = (t: Linha) => `${t.fornecedor_id}|${nfNormalizada(t.numero_nf_digitado)}|${t.parcela}`;

function agrupar<T extends Linha>(linhas: T[], chave: (l: T) => string) {
  const m = new Map<string, T[]>();
  for (const l of linhas) m.set(chave(l), [...(m.get(chave(l)) ?? []), l]);
  return m;
}

export function indices(): Indices {
  if (cache) return cache;
  const fornecedor = new Map(carregar("fornecedores.csv").map((f) => [f.fornecedor_id, f]));
  const nfPorEmitenteNumero = new Map(carregar("notas_fiscais.csv").map((n) => [`${cnpjRaiz(n.cnpj_emitente)}|${nfNormalizada(n.numero_nf)}`, n]));
  cache = {
    fornecedor,
    alteracoes: agrupar(carregar("alteracoes_cadastro.csv"), (a) => a.fornecedor_id),
    chaveTitulo: agrupar(carregar("contas_a_pagar.csv"), chaveTitulo),
    nfPorEmitenteNumero,
    duplicatas: agrupar(carregar("nf_duplicatas.csv"), (d) => d.chave_acesso),
    dataPrevista: new Map(agenda().map((a) => [a.titulo_id, a.data_prevista])),
  };
  return cache;
}
