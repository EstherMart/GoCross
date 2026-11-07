# Métricas medidas (07/11/2026, execução real com IA)

Fonte: `npx tsx --env-file-if-exists=.env.local scripts/medir.ts` e `scripts/avaliar.ts`.

| Métrica | Valor |
|---|---|
| Títulos / lotes | 876 / 17 |
| Liberados sem pessoa | 829 (94,6%) |
| Retirados com evidência | 21 |
| Acionam pessoa | 26 (3%); média 1,5 por lote; máx 6 (RM20261112-MER) |
| Custo dos acionamentos (R$ 60 cada, politicas.csv) | R$ 1.560 na semana |
| Valor retido | R$ 461.391,78 (retido ≠ perda evitada) |
| Decididos por código / com IA | 855 / 21 (2,4%) |
| Gabarito | 16/16 (ajuste 8/8, validação 8/8), 0 falso positivo G16 |
| Revisor adversário | derrubou 3/3 ações plantadas |
| Custo de IA | US$ 0,0013 a 0,0017 por semana inteira (~107 a 118 chamadas) |
| Tempo do agente | 113 s nos 17 lotes; < 0,5 s sem ambíguos; até 24 s com IA |

Ressalva: o gabarito foi ajustado nos mesmos casos; não é taxa de detecção.

## Falta medir
- Tempo da analista: cronometrar a conferência manual de 10 títulos (t). Antes: 52 × t por lote. Depois: ~2,8 exceções por lote × tempo de revisar o dossiê.

## Linha de base humana (histórico, `npx tsx scripts/historico.ts`)
Detectores atuais aplicados aos 7.120 títulos do histórico; 4.502 foram pagos (retorno código 00).

| Tipologia | Pagos com sinal | Valor | Com aprovação humana explícita |
|---|---|---|---|
| G01 duplicidade | 51 | R$ 381.691 | 19 |
| G03 valor ≠ duplicata | 46 | R$ 307.274 | 15 |
| G04 troca sem confirmação | 3 | R$ 14.382 | 1 |
| **Total** | **100** | **~R$ 703 mil** | **35** |

Ressalvas: sinal não é erro confirmado (precisão no histórico não medida). politicas.csv: sem aprovador, o tesoureiro assina o lote sem conferir.

## Com júri (promotor × defensor × juiz), mesma base
| Métrica | Antes (revisor) | Depois (júri) |
|---|---|---|
| Gabarito | 16/16, 0 FP | 16/16, 0 FP |
| Ações plantadas derrubadas | 3/3 | 3/3 (acusação sem prova verificável → pessoa) |
| Liberados / retirados / pessoa | 829 / 21 / 26 | 829 / 21 / 26 (júri manteve todas as retiradas) |
| Custo de IA na semana (medir.ts) | US$ 0,0013 | US$ 0,0023 |
| Chamadas (medir.ts) | 107 | 149 |
| Tempo dos 17 lotes | 113 s | 156 s; lote mais lento 45 s (RM20261103-MER) |
| Falhas do proxy | não medido | 5 em 190 na avaliação (uma nova tentativa; falha mantém a decisão do código); 0 no medir |

## Modo sombra: júri nos críticos (`npx tsx --env-file-if-exists=.env.local scripts/sombra.ts`)
O júri julgou os 4 críticos do gabarito como se pudesse decidir, sem mudar nada.

| Cenário | Tipologia | Esperado | Júri |
|---|---|---|---|
| C08 | G04 | bloquear | pessoa (juiz inseguro, 56%) |
| C09 | G04 | bloquear | pessoa (juiz inseguro, 58%) |
| C10 | G04 | bloquear | segura (66%) |
| C11 | G05 | bloquear | segura (79%) |

Nenhuma fraude liberada (0/4); todas as provas citadas eram evidências reais. Amostra de 4: não sustenta taxa de erro.
Comparação humana (histórico): 3 títulos G04 pagos com troca sem confirmação, 1 com aprovação humana explícita.
