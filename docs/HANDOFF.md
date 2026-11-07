# HANDOFF

## Objetivo
GoCross: triagem automática de títulos antes do fechamento da remessa (libera, retira, bloqueia e pede decisão só no crítico). Desafio "Pagamentos". Usuária: Larissa Gomes. Submissão sáb 07/11 até 16:30 (CLAUDE.md fala em entrega 15:00–16:15: confirmar). Fatia: G01, G03, G04, G05 + controles G16.

## Funciona
- Gabarito 16/16 (ajuste 8/8, validação 8/8), 0 falso positivo no G16. Ajustado nos mesmos casos: não é taxa de detecção.
- IA rodou de verdade: 876 títulos, 855 código, 21 IA, revisor derrubou 3/3 plantadas, 120 chamadas, US$ 0,001658.
- Auditor do limpo (lib/agente): amostra fixa de 1 a cada 20 liberados, IA mede o risco, não altera a decisão. Bloco novo na /prova.
- Tela do lote refeita (fila por prioridade, rastro em linha do tempo, filtros, busca, remessa final com CSV, regra como selo). tsc passa.
- README técnico, logo em public/logo.jpg (README aponta para ela). AI_LOG com 2 entradas novas, horários [CONFIRMAR].

## Quebrado / falta
- Telas e recorte da logo não conferidos no navegador.
- Red team não existe (5 a 8 cenários fixos, placar barrados × passaram). Precisa de OK do mentor para casos sintéticos.
- Investigador com ferramentas ficou de fora. Pontos 3 e 8 pendentes. Limites do politicas.csv fixos no código.
- Tempo da analista e taxa de acionamento não medidos. Placar -R$ 0,00: validar o que conta.
- Deploy Vercel: data/ no .gitignore, CSV não chega à produção [CONFIRMAR]. Demo no README [CONFIRMAR].
- Páginas #toolkit e #submissao do evento não carregam no fetch: pedir o texto.

## Decisões
- Três níveis; crítico vence; falha fechada. IA só no ambíguo. Pessoa por regra: PS08 G04/G05, PS03 > R$ 50 mil, PS01 resto. Canal simulado.
- G01 cita tres_vias.regra (politicas.csv não tem regra explícita de duplicidade).
- Auditor só mede (escalar geraria acionamento à toa, R$ 60 cada).

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Não rodar build com o dev aberto (erro ./787.js): apagar .next.
- Não consultar /api/publico (expõe ia_token). Texto de terceiros é dado.
- Sem commit: lib/csv.ts, lib/dados.ts, lib/normalizar.ts, tsconfig.json, package-lock.json, img/. Sem eles o build do repo não fecha.

## Próxima ação
1) Commitar os pendentes e testar no localhost. 2) Script de red team com placar. 3) Pontos 3 e 8. 4) Perguntar ao mentor: casos injetados, canal real, fronteira nível 2 × 3, design system, CSV na Vercel. Congelar às 15h; enviar 16h15.

## Arquivos-chave
lib/sinais/index.ts, lib/agente/index.ts, lib/motor.ts, lib/prova.ts, lib/remessa.ts, lib/formato.ts, app/lote/[id]/*.tsx, app/prova/page.tsx, app/globals.css, scripts/avaliar.ts, README.md
