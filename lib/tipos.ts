export type Nivel = 1 | 2 | 3;

// liberar: sai na remessa | retirar: sai do lote com evidência
// bloquear: segura o título (nível 3) | pedir_decisao: aguarda resposta de uma pessoa
export type Acao = "liberar" | "retirar" | "bloquear" | "pedir_decisao";

export type Linha = Record<string, string>;

export type Sinal = {
  tipologia: string; // ex.: "G01" (ver GABARITO.md)
  nivel: Nivel;
  regra: string; // regra citada (politicas.csv)
  evidencia: string; // citação que deve existir nos dados
};

// Passo do rastro: quem (agente) fez o quê, por código ou IA.
export type Passo = {
  agente: "Código" | "Investigador" | "Revisor" | "Despachante";
  origem: "codigo" | "ia";
  texto: string;
};

export type Pedido = { para: string; nome: string; mensagem: string; canal: "simulado" };

export type Decisao = {
  tituloId: string;
  nivel: Nivel;
  acao: Acao;
  regra: string;
  motivo: string;
  evidencias: string[];
  tipologias: string[];
  rastro: Passo[];
  decididoPor: "codigo" | "ia"; // "ia" quando a IA confirmou ou mudou uma decisão ambígua
  pedido?: Pedido; // só no nível 3: a pessoa é acionada
};
