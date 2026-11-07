# HANDOFF

## Objetivo
GoCross: triagem de títulos antes do fechamento da remessa (libera, retira, bloqueia; pessoa só no crítico). Desafio "Pagamentos". Fatia: G01, G03, G04, G05 + controles G16. Congelar 15h, enviar 16h15 (submissão diz 16:30: confirmar).

## Funciona
- Gabarito 16/16 (ajustado nos mesmos casos, não é taxa de detecção), 0 FP, revisor 3/3. IA: ~118 chamadas, US$ 0,0017.
- Métricas reais (scripts/medir.ts): 876 títulos/17 lotes; 829 liberados (94,6%), 21 retirados, 26 acionam pessoa (1,5/lote, máx 6 em RM20261112-MER); R$ 461.391,78 retido; 113 s tudo, até 24 s por lote com IA.
- Logo só com o nome: public/logo-nome.png (topbar e README). Não conferida no navegador.

## Quebrado / falta
- Tela do lote não mostra a "Prova" nem métricas. Plano proposto, aguardando OK: bloco Prova + métricas no lote, limites lidos do politicas.csv, rodar tsc e gabarito.
- Limites fixos no código (30 dias, ±0,10, 2%+1%, R$ 50 mil): regra nova exige código. politicas.csv tem regras não cobertas (aprovação dupla, fracionamento, segregação, sem NF/OC, antecipação, alçadas).
- Tempo da analista não medido: cronometrar 10 títulos manuais (t); antes 52×t por lote, depois ~2,8 exceções.
- Red team, investigador com ferramentas, canal real: fora. Vercel sem CSV (data/ no .gitignore): demo em localhost.

## Decisões
- Três níveis; crítico vence; falha fechada; IA só no ambíguo. PS08 G04/G05, PS03 > R$ 50 mil, PS01 resto. Canal simulado.
- Defesa: "funciona para este recorte e medimos o que sabemos"; resto como próximo passo. Retido ≠ perda evitada.
- Demo: abas pré-abertas (lote demora até 24 s), GIFs (ScreenToGif) como plano B.

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Build com dev aberto quebra: apagar .next.
- Não abrir /api/publico (expõe ia_token).
- Ainda sem commit: lib/csv.ts, lib/dados.ts, lib/normalizar.ts, tsconfig.json, package-lock.json, img/ (build do repo não fecha sem eles).

## Próxima ação
1) OK do plano da Prova no lote + limites do politicas.csv. 2) Commitar pendentes e testar checklist no localhost. 3) Medir tempo da analista. 4) Gravar GIFs e montar slides.

## Arquivos-chave
lib/sinais/index.ts, lib/agente/index.ts, lib/prova.ts, lib/remessa.ts, app/lote/[id]/page.tsx, app/globals.css, scripts/avaliar.ts, scripts/medir.ts, README.md
