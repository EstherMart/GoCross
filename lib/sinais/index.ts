import { chaveTitulo, indices } from "../indices";
import { cnpjRaiz, nfNormalizada } from "../normalizar";
import type { Linha, Sinal } from "../tipos";

export type Detector = (titulo: Linha) => Sinal[];

const DIA = 86_400_000;
const dias = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / DIA);

// G01 · duplicidade: mesmo fornecedor + NF normalizada + parcela. Retira o lançado depois.
// politicas.csv não tem regra explícita de duplicidade: cita-se tres_vias.regra (OC x NF x título, um título por duplicata).
const g01: Detector = (t) => {
  if (!nfNormalizada(t.numero_nf_digitado)) return []; // aluguel e utilidades não têm NF: a chave colidiria entre meses
  const outros = (indices().chaveTitulo.get(chaveTitulo(t)) ?? []).filter(
    (o) => o.titulo_id !== t.titulo_id && o.data_lancamento < t.data_lancamento && o.status !== "cancelado",
  );
  if (outros.length === 0) return [];
  return [{ tipologia: "G01", nivel: 2, regra: "tres_vias.regra", evidencia: `Mesma NF e parcela já lançadas em ${outros.map((o) => o.titulo_id).join(", ")}` }];
};

// G03 · valor ≠ duplicata (a maioria dos casos reais é dígito a menos). Aceita ±R$ 0,10 e multa 2% + juros 1%/mês.
const g03: Detector = (t) => {
  const { fornecedor, nfPorEmitenteNumero, duplicatas } = indices();
  const f = fornecedor.get(t.fornecedor_id);
  if (!f || !t.numero_nf_digitado) return [];
  const nf = nfPorEmitenteNumero.get(`${cnpjRaiz(f.cnpj)}|${nfNormalizada(t.numero_nf_digitado)}`);
  const parcela = Number(t.parcela.split("/")[0]);
  const dup = nf && (duplicatas.get(nf.chave_acesso) ?? []).find((d) => Number(d.n_dup) === parcela);
  if (!dup) return [];
  const valor = Number(t.valor);
  const esperado = Number(dup.valor);
  const atraso = Math.max(0, dias(indices().dataPrevista.get(t.titulo_id) ?? t.vencimento, dup.vencimento));
  const teto = esperado * (1.02 + 0.01 * Math.ceil(atraso / 30)) + 0.1;
  if (valor >= esperado - 0.1 && (atraso === 0 ? valor <= esperado + 0.1 : valor <= teto)) return [];
  const sentido = valor < esperado ? "a menor" : "a maior";
  return [{ tipologia: "G03", nivel: 2, regra: "tres_vias.titulo_x_duplicata", evidencia: `Título R$ ${valor.toFixed(2)} ≠ duplicata ${dup.n_dup} R$ ${esperado.toFixed(2)} (valor ${sentido})` }];
};

// G04 · troca bancária (banco, agência, conta, pix) sem confirmação registrada há menos de 30 dias.
const g04: Detector = (t) => {
  const campos = ["banco", "agencia", "conta", "chave_pix"];
  const remessa = indices().dataPrevista.get(t.titulo_id) ?? t.vencimento;
  const trocas = (indices().alteracoes.get(t.fornecedor_id) ?? []).filter(
    (a) => campos.includes(a.campo) && a.confirmacao_registrada === "não" && a.data_hora.slice(0, 10) <= remessa && dias(remessa, a.data_hora.slice(0, 10)) < 30,
  );
  if (trocas.length === 0) return [];
  return [{ tipologia: "G04", nivel: 3, regra: "dados_bancarios.troca_de_conta", evidencia: `Troca de ${[...new Set(trocas.map((a) => a.campo))].join("/")} em ${trocas[0].data_hora.slice(0, 10)} sem confirmação (${trocas.map((a) => a.alteracao_id).join(", ")})` }];
};

// G05 · boleto cujo beneficiário tem raiz de CNPJ diferente da do fornecedor.
const g05: Detector = (t) => {
  const f = indices().fornecedor.get(t.fornecedor_id);
  if (!f || !t.cnpj_beneficiario_boleto || cnpjRaiz(t.cnpj_beneficiario_boleto) === cnpjRaiz(f.cnpj)) return [];
  return [{ tipologia: "G05", nivel: 3, regra: "dados_bancarios.boleto", evidencia: `Beneficiário do boleto ${t.cnpj_beneficiario_boleto} ≠ fornecedor ${f.cnpj}` }];
};

// G16 (controles) não tem detector: título limpo sem sinais é liberado.
export const nivel1: Detector[] = [];
export const nivel2: Detector[] = [g01, g03];
export const nivel3: Detector[] = [g04, g05];

export function coletarSinais(titulo: Linha): Sinal[] {
  return [...nivel3, ...nivel2, ...nivel1].flatMap((d) => d(titulo));
}
