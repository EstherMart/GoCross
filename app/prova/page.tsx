import { calcularProva } from "@/lib/prova";
import { usoTotal } from "@/lib/ia";
import { brl } from "@/lib/formato";

export const dynamic = "force-dynamic";

// Tela 3: prova. Tudo calculado da execução real; o que não foi medido aparece como "não medido".
export default async function Page() {
  const p = await calcularProva();
  const g05 = p.porTipologia.find((t) => t.tipologia === "G05");
  return (
    <main className="container">
      <h1>Prova</h1>
      <p className="lede">O que o agente acertou, o que deixou passar e o que ainda não foi medido.</p>

      <section className="card sec">
        <div className="card-h">Amostra <span className="chip real">{p.origens.join(", ") || "sem casos"}</span></div>
        <div className="pad">
          <p>
            <strong>{p.casos.length} casos</strong> escolhidos por nós em títulos reais (nenhum injetado). Por tipologia: {p.porTipologia.map((t) => `${t.tipologia} ${t.ok}/${t.total}`).join(" · ")}.
            Por grupo: {p.porGrupo.map((g) => `${g.grupo} ${g.ok}/${g.total}`).join(" · ")}.
          </p>
          <p className="foot">
            Amostra pequena (G05 tem {g05?.total ?? 0} caso, G04 é um fornecedor só): é prova de conceito, não taxa de detecção. O gabarito foi rotulado por evidência nos dados, não por rótulo oficial.
          </p>
        </div>
      </section>

      <section className="kpis">
        <div className="kpi ok"><div className="n">{p.casos.filter((c) => c.ok).length}/{p.casos.length}</div><div className="l">Acertos no gabarito</div></div>
        <div className="kpi"><div className="n">{p.falsosPositivos}</div><div className="l">Falsos positivos nos controles G16</div></div>
        <div className="kpi"><div className="n">{brl(Math.abs(p.placar))}</div><div className="l">Placar (R$ passou + R$ 60 por acionamento à toa)</div></div>
      </section>

      <section className="card sec">
        <div className="card-h">O que o agente deixou passar ou errou</div>
        <div className="pad">
          {p.passaram.length === 0 ? (
            <p>Nenhum erro nos {p.casos.length} casos. Isso mede o ajuste nos nossos próprios casos, não a agenda inteira.</p>
          ) : (
            p.passaram.map((c) => <div key={c.cenario}>{c.cenario} · {c.tipologia} · esperado {c.esperado}, obtido {c.obtido}</div>)
          )}
        </div>
      </section>

      <section className="card sec">
        <div className="card-h">Código ou IA?</div>
        <div className="pad">
          <p>
            Na agenda inteira ({p.agenda.titulos} títulos): {p.agenda.liberados} liberados, {p.agenda.retirados} retirados, {p.agenda.bloqueados} bloqueados.
            Decididos só por código: <strong>{p.agenda.porCodigo}</strong>. Com a IA: <strong>{p.agenda.porIA}</strong>.
            {p.iaAtiva ? "" : " IA desligada nesta execução (sem AI_PROXY_API_KEY): zero chamadas."}
          </p>
          <p className="foot">Detectores de duplicidade, valor × duplicata, troca bancária e boleto são código. A IA lê só os ambíguos (nível 2) e o revisor questiona cada ação.</p>
        </div>
      </section>

      <section className="card sec">
        <div className="card-h">Revisor adversário</div>
        <div className="pad">
          {p.revisor.rodado
            ? <p>Derrubou <strong>{p.revisor.derrubou} de {p.revisor.plantadas}</strong> ações erradas plantadas (retirar controle legítimo).</p>
            : <p>Não medido: precisa de AI_PROXY_API_KEY para rodar as 3 ações plantadas.</p>}
        </div>
      </section>

      <section className="card sec">
        <div className="card-h">Custo e tempo da IA nesta execução</div>
        <div className="pad">
          {usoTotal.chamadas === 0
            ? <p>Sem chamadas de IA. Custo por título: não medido.</p>
            : <p>{usoTotal.chamadas} chamadas · {usoTotal.tokensEntrada} tok de entrada · {usoTotal.tokensSaida} de saída · US$ {usoTotal.usd.toFixed(6)} (só o Jev informa preço; o chat informa só tokens) · {usoTotal.ms} ms.</p>}
        </div>
      </section>

      <section className="card sec">
        <div className="card-h">O que é medido, inferido ou pendente</div>
        <div className="pad">
          <p><span className="chip real">medido</span> mediana de 28 dias entre lançamento e pagamento; 48 de 876 títulos de fornecedores que trocaram dados bancários depois do lançamento; 25 títulos na agenda com troca sem confirmação.</p>
          <p><span className="chip inf">inferido</span> Larissa confere "uns poucos" por amostra.</p>
          <p><span className="chip pend">pendente</span> fronteira nível 2 × 3 (comprador e aprovador acima de R$ 5 mil) e casos injetados: aguardam o mentor. Ação e canal da pessoa são simulados.</p>
        </div>
      </section>
    </main>
  );
}
