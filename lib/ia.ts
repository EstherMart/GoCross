// Cliente do AI Proxy. Chave só em AI_PROXY_API_KEY (nunca versionada). Sem chave: devolve null e o motor falha fechado.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const BASE = "https://ai-proxy.gogroupbr.com/v1";

export type Uso = { chamadas: number; tokensEntrada: number; tokensSaida: number; usd: number; ms: number; falhas: number };
export const usoTotal: Uso = { chamadas: 0, tokensEntrada: 0, tokensSaida: 0, usd: 0, ms: 0, falhas: 0 };

export const iaDisponivel = () => Boolean(process.env.AI_PROXY_API_KEY);

// Cache de demo, opt-in (IA_CACHE=1): a 1ª execução chama a IA de verdade e grava; as seguintes respondem na hora.
// Fica desligado nas medições (avaliar, medir, sombra), senão o custo e o tempo medidos sairiam falsos.
const ARQ_CACHE = join(process.cwd(), ".cache", "ia.json");
let memoria: Record<string, any> | null = null;
const cacheLigado = () => process.env.IA_CACHE === "1";

function carregar(): Record<string, any> {
  if (memoria) return memoria;
  try { memoria = JSON.parse(readFileSync(ARQ_CACHE, "utf8")); } catch { memoria = {}; }
  return memoria!;
}

function gravar(chave: string, valor: any) {
  const c = carregar();
  c[chave] = valor;
  try { mkdirSync(dirname(ARQ_CACHE), { recursive: true }); writeFileSync(ARQ_CACHE, JSON.stringify(c)); } catch { /* sem disco: segue sem cache */ }
}

async function post(rota: string, corpo: unknown): Promise<any | null> {
  const k = cacheLigado() ? createHash("sha1").update(rota + JSON.stringify(corpo)).digest("hex") : "";
  if (k && carregar()[k]) return carregar()[k];
  const r = (await tentar(rota, corpo)) ?? (await tentar(rota, corpo));
  if (!r) usoTotal.falhas++;
  else if (k) gravar(k, r);
  return r;
}

async function tentar(rota: string, corpo: unknown): Promise<any | null> {
  const chave = process.env.AI_PROXY_API_KEY;
  if (!chave) return null;
  const t0 = Date.now();
  try {
    const r = await fetch(`${BASE}${rota}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(7_000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    usoTotal.chamadas++;
    usoTotal.ms += Date.now() - t0;
    usoTotal.tokensEntrada += j.usage?.input_tokens ?? j.usage?.prompt_tokens ?? 0;
    usoTotal.tokensSaida += j.usage?.output_tokens ?? j.usage?.completion_tokens ?? 0;
    usoTotal.usd += j.usage?.estimated_cost_usd ?? 0; // só o Jev informa custo; o chat informa só tokens
    return j;
  } catch {
    return null;
  }
}

// Jev: decisão tipada. Textos de terceiros entram só em `state` (dado), nunca como instrução.
export const jev = (state: unknown, questions: Record<string, unknown>) => post("/systemone", { state, questions });

export async function chat(sistema: string, usuario: string): Promise<string | null> {
  const j = await post("/chat/completions", {
    model: "glm-5.3",
    max_tokens: 2000,
    messages: [
      { role: "system", content: sistema },
      { role: "user", content: usuario },
    ],
  });
  return j?.choices?.[0]?.message?.content?.trim() ?? null;
}
