# Impacto, métricas e resultados esperados (07/11/2026)

Tudo marcado como **medido** vem de [METRICAS.md](METRICAS.md). Tudo marcado como **hipótese** depende de um dado que ainda não temos e não deve ser apresentado como resultado.

## 1. O que está medido
| Item | Valor | Status |
|---|---|---|
| Títulos / lotes na semana | 876 / 17 (≈ 52 por lote) | medido |
| Liberados sem pessoa | 829 (94,6%) | medido |
| Exceções por lote | ~2,8 (21 retiradas + 26 acionamentos em 17 lotes); máx 6 | medido |
| Custo de IA | ~US$ 0,002 na semana | medido |
| Custo dos acionamentos | R$ 1.560 na semana (R$ 60 × 26) | medido (política) |
| Gabarito | 16/16, 0 falso positivo nos controles | medido, mas ajustado nos mesmos casos |
| Júri: nunca libera | 0 liberações de fraude em 4 críticos | medido, amostra pequena |
| Linha de base humana | 100 títulos pagos com sinal (~R$ 703 mil) | medido; sinal não é erro confirmado |

## 2. Impacto esperado, por frente
**Tempo da analista (hipótese).** Hoje não há conferência título a título. Se conferisse, o custo seria 52 × t por lote. Com o agente, ela revisa ~2,8 dossiês.
| t por título | Conferência manual por lote | Revisão das exceções (3 min cada) |
|---|---|---|
| 1 min | 52 min | ~8 min |
| 2 min | 104 min | ~8 min |

O ganho real é **cobertura**: hoje 100% do lote é assinado sem conferir. O ganho de tempo só existe se a analista já conferisse algo; não prometer redução de horas sem o cronômetro.

**Dinheiro (hipótese, não estimativa).** O valor evitado é a parcela dos ~R$ 703 mil com sinal que era erro de fato. Sem a precisão, o intervalo é aberto: 10% → ~R$ 70 mil; 30% → ~R$ 211 mil; 50% → ~R$ 352 mil. O período do histórico não está declarado, então não anualizar. "Valor retido" (R$ 461 mil na semana) **não** é perda evitada.

**Risco operacional.** Falso positivo atrasa o pagamento de um fornecedor legítimo. Nos controles medidos: 0 em 5. Em produção a taxa é desconhecida; 26 acionamentos em 876 títulos (3%) é a carga que a equipe absorveria.

**Custo.** IA é desprezível (US$ 0,002/semana). O custo relevante é humano: R$ 1.560/semana em acionamentos, a comparar com o valor evitado.

## 3. O que pode dar errado
1. Gabarito ajustado nos mesmos casos: sem taxa de detecção; novos tipos de fraude passam.
2. Amostra de críticos: 4 fraudes e 5 controles. Intervalo de confiança largo.
3. Canal de acionamento simulado: em produção, a latência da resposta humana vira o gargalo.
4. Dependência do AI Proxy: falha mantém a decisão do código (falha fechada), mas o júri deixa de rodar.
5. Dados fictícios: números reais de lote tendem a ter mais ruído.

## 4. Proposições (por prioridade)
1. **Red team sintético** (30 a 50 críticos, separado de `data/gabarito/`, com OK do mentor): dá taxa de barrados × passaram, a maior lacuna hoje.
2. **Cronometrar 10 títulos** com uma pessoa: fecha o número de tempo em 10 minutos.
3. **Medir precisão do sinal no histórico:** amostrar 20 dos 100 pagos com sinal e classificar à mão como erro ou legítimo; vira o fator de conversão do valor evitado.
4. **Agrupar acionamentos por responsável por remessa** (um resumo, não uma mensagem por título): reduz ruído e custo.
5. **Rodar o piloto em modo sombra por 1 a 2 semanas** antes de bloquear de verdade: o agente só sugere, a analista compara com o que faria.
6. **Piso de revisão humana nos retirados de nível 2:** amostrar uma fração para medir falso positivo contínuo.
