# HANDOFF

## Objetivo
GoCross: triagem de títulos antes do fechamento da remessa (libera, retira, bloqueia; pessoa só no crítico). Desafio "Pagamentos". Fatia: G01, G03, G04, G05 + controles G16. Congelar 15h, enviar 16h15. Demo no localhost (mentor liberou; dados fictícios, sem Vercel).

## Funciona
- Júri (promotor × defensor × juiz) no lugar do revisor: prova é escolha fechada entre evidências reais; IA nunca libera nem rebaixa. Gabarito 16/16, 0 FP, 3/3 plantadas. 829/21/26 (lib/ret/pessoa), US$ 0,0023/semana, 156 s nos 17 lotes (máx 45 s).
- Proxy com uma nova tentativa e contagem de falhas (5/190 na avaliação). Clean code parcial; tsc passa.
- Lote: faixa de KPIs + abas "Agentes trabalhando" (padrão, orquestração em trilhas + replay), Exceções, Remessa final. Logo só com o nome.
- Métricas em docs/METRICAS.md: base, linha humana do histórico (100 pagos com sinal, R$ 703 mil, 35 aprovados), júri antes/depois, modo sombra nos críticos (0/4 fraudes liberadas).

## Quebrado / falta
- Pedido em aberto da usuária: orquestração ainda difícil de ler; melhorar o fluxo visual sem deixar de ser MVP. Aba Agentes e replay não conferidos no navegador.
- Pedido em aberto: comparação agente × humano nos críticos nas métricas (taxa de fraude liberada e legítimo bloqueado; hoje só 4 casos + histórico).
- Tempo da analista não medido. Red team sintético (30 a 50 críticos) é próximo passo declarado.
- Arquivos sem commit desde antes: lib/csv.ts, lib/dados.ts, lib/normalizar.ts, tsconfig.json, package-lock.json, img/.

## Decisões
- Agente bloqueia sozinho no crítico; aprovar crítico continua humano (politicas.csv exige aprovação dupla em troca bancária) e falta base maior.
- Defesa: "funciona para este recorte e medimos o que sabemos"; retido ≠ perda evitada.

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Dev aberto em :3010; fechar antes de build (senão apagar .next).
- Não abrir /api/publico (expõe ia_token). Lote com IA demora até 45 s: abrir antes da demo.

## Próxima ação
1) Melhorar leitura da orquestração (fluxo único e simples). 2) Tabela agente × humano nos críticos em METRICAS. 3) Conferir telas no navegador. 4) Congelar, GIFs (ScreenToGif), pitch.

## Arquivos-chave
lib/agente/index.ts, lib/ia.ts, lib/motor.ts, lib/prova.ts, app/lote/[id]/{page,AbasLote,Orquestracao,FilaTitulos}.tsx, app/globals.css, scripts/{avaliar,medir,historico,sombra}.ts, docs/METRICAS.md
