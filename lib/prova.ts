import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseCsv } from "./csv";
import { tituloPorId, agenda } from "./dados";
import { revisar } from "./agente";
import { iaDisponivel } from "./ia";
import { decidir } from "./motor";
import type { Decisao, Linha } from "./tipos";

// Tudo que a aba "Prova" mostra é calculado aqui, da execução real. Nada digitado à mão.
export type CasoProva = { cenario: string; titulo: string; tipologia: string; grupo: string; origem: string; esperado: string; obtido: string; ok: boolean; valorRisco: number };

export type Prova = {
  casos: CasoProva[];
  porTipologia: { tipologia: string; ok: number; total: number }[];
  porGrupo: { grupo: string; ok: number; total: number }[];
  passaram: CasoProva[]; // o que o agente deixou passar ou errou
  placar: number; // -R$: indevido que passaria + R$ 60 por acionamento desnecessário
  falsosPositivos: number; // controles G16 retidos ou bloqueados
  origens: string[];
  agenda: { titulos: number; liberados: number; retirados: number; bloqueados: number; porCodigo: number; porIA: number };
  auditoria: { amostrados: number; questionados: number; limiar: number }; // amostra dos limpos revisada pela IA
  revisor: { rodado: boolean; plantadas: number; derrubou: number };
  iaAtiva: boolean;
};

const LIMIAR_AUDITORIA = 0.5; // risco da auditoria a partir do qual o título conta como "questionado"

const arq = () => path.join(process.cwd(), "data", "gabarito", "gabarito.csv");

export function lerGabarito(): Linha[] {
  return existsSync(arq()) ? parseCsv(readFileSync(arq(), "utf8")) : [];
}

// Revisor adversário: planta 3 ações erradas (retirar um controle G16 legítimo) e conta quantas ele derruba.
async function testarRevisor(controles: Linha[]) {
  if (!iaDisponivel()) return { rodado: false, plantadas: 0, derrubou: 0 };
  const alvos = controles.slice(0, 3);
  let derrubou = 0;
  for (const c of alvos) {
    const t = tituloPorId(c.titulo_id);
    if (!t) continue;
    const errada: Decisao = {
      tituloId: c.titulo_id, nivel: 2, acao: "retirar", regra: "plantada", motivo: "G01", tipologias: ["G01"], decididoPor: "codigo", rastro: [],
      evidencias: [`Ação plantada: retirar o título ${c.titulo_id}, sem evidência real de erro`],
    };
    const r = await revisar(t, errada);
    if (r.nivel === 3) derrubou++;
  }
  return { rodado: true, plantadas: alvos.length, derrubou };
}

export async function calcularProva(): Promise<Prova> {
  const gab = lerGabarito();
  const casos: CasoProva[] = [];
  for (const c of gab) {
    const d = await decidir(c.titulo_id);
    const obtido = d.acao === "pedir_decisao" ? "bloquear" : d.acao;
    casos.push({ cenario: c.cenario_id, titulo: c.titulo_id, tipologia: c.tipologia, grupo: c.grupo, origem: c.origem, esperado: c.acao_esperada, obtido, ok: obtido === c.acao_esperada, valorRisco: Number(c.valor_em_risco || 0) });
  }
  const agrupa = (chave: (c: CasoProva) => string) => {
    const m = new Map<string, { ok: number; total: number }>();
    for (const c of casos) {
      const x = m.get(chave(c)) ?? { ok: 0, total: 0 };
      x.total++;
      if (c.ok) x.ok++;
      m.set(chave(c), x);
    }
    return [...m].sort(([a], [b]) => a.localeCompare(b));
  };
  const passou = casos.filter((c) => !c.ok && c.obtido === "liberar").reduce((s, c) => s + c.valorRisco, 0);
  const fp = casos.filter((c) => !c.ok && c.esperado === "liberar");
  const ds = await Promise.all(agenda().map((a) => decidir(a.titulo_id)));
  return {
    casos,
    porTipologia: agrupa((c) => c.tipologia).map(([tipologia, v]) => ({ tipologia, ...v })),
    porGrupo: agrupa((c) => c.grupo).map(([grupo, v]) => ({ grupo, ...v })),
    passaram: casos.filter((c) => !c.ok),
    placar: -(passou + fp.length * 60),
    falsosPositivos: fp.length,
    origens: [...new Set(casos.map((c) => c.origem))],
    agenda: {
      titulos: ds.length,
      liberados: ds.filter((d) => d.acao === "liberar").length,
      retirados: ds.filter((d) => d.acao === "retirar").length,
      bloqueados: ds.filter((d) => d.acao === "bloquear" || d.acao === "pedir_decisao").length,
      porCodigo: ds.filter((d) => d.decididoPor === "codigo").length,
      porIA: ds.filter((d) => d.decididoPor === "ia").length,
    },
    auditoria: {
      amostrados: ds.filter((d) => d.auditoria).length,
      questionados: ds.filter((d) => (d.auditoria?.risco ?? 0) >= LIMIAR_AUDITORIA).length,
      limiar: LIMIAR_AUDITORIA,
    },
    revisor: await testarRevisor(gab.filter((c) => c.tipologia === "G16")),
    iaAtiva: iaDisponivel(),
  };
}
