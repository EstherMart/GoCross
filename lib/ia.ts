// Cliente do AI Proxy. Chave só em AI_PROXY_API_KEY (nunca versionada). Sem chave: devolve null e o motor falha fechado.
const BASE = "https://ai-proxy.gogroupbr.com/v1";

export type Uso = { chamadas: number; tokensEntrada: number; tokensSaida: number; usd: number; ms: number; falhas: number };
export const usoTotal: Uso = { chamadas: 0, tokensEntrada: 0, tokensSaida: 0, usd: 0, ms: 0, falhas: 0 };

export const iaDisponivel = () => Boolean(process.env.AI_PROXY_API_KEY);

async function post(rota: string, corpo: unknown): Promise<any | null> {
  const r = (await tentar(rota, corpo)) ?? (await tentar(rota, corpo));
  if (!r) usoTotal.falhas++;
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
      signal: AbortSignal.timeout(20_000),
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
