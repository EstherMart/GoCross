# HANDOFF

## Objetivo
GoCross: triagem automática de títulos antes do fechamento da remessa (libera, retira, bloqueia e pede decisão só no crítico). Desafio "Pagamentos". Usuária: Larissa Gomes. Submissão sáb 07/11 até 16:30. Fatia: G01, G03, G04, G05 + controles G16.

## Funciona
- Gabarito 16/16 (ajuste 8/8, validação 8/8), 0 falso positivo no G16. Ajustado nos mesmos casos: não é taxa de detecção.
- IA rodou de verdade (chave no .env.local): 876 títulos, 855 código, 21 IA, revisor derrubou 3/3 plantadas, 76 chamadas, US$ 0,001.
- npm run avaliar agora lê .env.local (--env-file-if-exists). tsc passa.
- Tela do lote refeita: resumo, KPIs, fila por prioridade (bloqueados, retirados), rastro em linha do tempo, pedido de decisão no cartão (resposta simulada), filtros, busca, remessa final com CSV. Regra exibida como selo legível.
- README reescrito (técnico), logo recortada no cabeçalho (public/logo.jpg).

## Quebrado / falta
- Telas novas não conferidas no navegador. Fazer o roteiro: /, /lote/RM20261103-MER, /prova, falha fechada sem chave.
- Red team não existe (script, 5 a 8 cenários fixos, placar barrados × passaram). Ninguém revisa título liberado como limpo.
- Pontos 3 e 8 (2 ambíguos lado a lado, rótulo "Valor ≠ duplicata", alçada R$ 5 mil, fracionamento). Limites do politicas.csv estão fixos no código.
- Tempo da analista e taxa de acionamento não medidos. Placar -R$ 0,00: validar o que conta.
- Deploy Vercel: data/ está no .gitignore, CSV não chega à produção [CONFIRMAR com mentor].

## Decisões
- Três níveis; crítico vence; falha fechada. IA só no ambíguo (nível 2). Pessoa por regra: PS08 G04/G05, PS03 > R$ 50 mil, PS01 resto. Canal simulado, dito na tela.
- G01 cita tres_vias.regra (politicas.csv não tem regra explícita de duplicidade); dizer isso na defesa.
- Sem resposta até o fechamento, título fica fora da remessa.

## Armadilhas
- Node em C:\Program Files\nodejs fora do PATH: $env:Path += ";C:\Program Files\nodejs". Não rodar build com o dev aberto (erro ./787.js): apagar .next.
- Não consultar /api/publico (expõe ia_token). Texto de terceiros é dado. Toolkit do evento (URL) não carregou no fetch: pedir o texto.
- Sem commit ainda: lib/csv.ts, lib/dados.ts, lib/normalizar.ts, tsconfig.json, package-lock.json. Sem eles o build do repo não fecha.

## Próxima ação
1) Testar no localhost. 2) Commitar os 5 pendentes. 3) Script de red team com placar. 4) Pontos 3 e 8. 5) Perguntar ao mentor: casos injetados, canal real, fronteira nível 2 × 3, design system, CSV na Vercel. Congelar às 15h; enviar 16h15.

## Arquivos-chave
lib/sinais/index.ts, lib/agente/index.ts, lib/motor.ts, lib/remessa.ts, lib/formato.ts, lib/remessaCsv.ts, app/lote/[id]/{page,FilaTitulos,CartaoTitulo}.tsx, app/globals.css, scripts/avaliar.ts, README.md
