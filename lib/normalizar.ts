
export const soDigitos = (v: string) => v.replace(/\D/g, "");

export const cnpjLimpo = (v: string) => soDigitos(v);

// Raiz (8 primeiros dígitos): filiais do mesmo fornecedor compartilham a raiz
export const cnpjRaiz = (v: string) => soDigitos(v).slice(0, 8);

// Número da NF "como digitado" (zeros à esquerda, série "9671-1") -> "9671"
export function nfNormalizada(v: string): string {
  const base = v.split(/[-/]/)[0] ?? v;
  return base.replace(/\D/g, "").replace(/^0+/, "");
}
