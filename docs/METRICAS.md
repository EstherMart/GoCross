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

## Críticos: agente × júri × humano (`npx tsx --env-file-if-exists=.env.local scripts/sombra.ts`)
Modo sombra: o júri julga críticos (G04/G05) e controles legítimos (G16) como se pudesse decidir, sem mudar nada.

| Cenário | Tipologia | Esperado | Agente (produção) | Júri (sombra) |
|---|---|---|---|---|
| C08 | G04 | bloquear | bloqueado | pessoa (juiz inseguro, 58%) |
| C09 | G04 | bloquear | bloqueado | pessoa (juiz inseguro, 43%) |
| C10 | G04 | bloquear | bloqueado | segura (60%) |
| C11 | G05 | bloquear | bloqueado | segura (83%) |
| C12–C16 | G16 | liberar | liberado (5/5) | pessoa (acusação sem prova verificável, 5/5) |

| Métrica | Agente (produção) | Júri (sombra) | Humano (histórico) |
|---|---|---|---|
| Fraude liberada | 0/4 | 0/4 | 3 títulos G04 pagos com troca sem confirmação (R$ 14.382), 1 com aprovação explícita |
| Legítimo bloqueado | 0/5 | 0/5 retido sem pessoa (5/5 escalados) | não medido (histórico não registra bloqueios) |
| Bloqueados | 4/9 (só os críticos) | 7/9 | nenhum bloqueio registrado (tesoureiro assina o lote sem conferir) |

Leitura: o júri nunca libera, mas sozinho bloquearia os 5 controles legítimos (acusação sem prova). Por isso o crítico é bloqueado pelo código e o júri atua só nos ambíguos.
Decisão de 07/11: o agente fecha o crítico sozinho (bloqueia e registra o dossiê); nenhum passo espera uma pessoa.
Ressalvas: amostra de 4 fraudes e 5 controles, sem taxa de erro; pago com sinal no histórico não é fraude confirmada.
