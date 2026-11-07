# HANDOFF

## Objetivo
GoCross: triagem de títulos antes do fechamento da remessa; o agente decide sozinho (libera, retira, bloqueia). Desafio "Pagamentos". Fatia: G01, G03, G04, G05 + controles G16. Congelar 15h, enviar 16h15 (o site do evento diz 16h30). Demo no localhost (mentor liberou; dados fictícios, sem Vercel).

## Funciona
- Júri (promotor × defensor × juiz) nos ambíguos; IA nunca libera. Gabarito 16/16, 0 FP, 3/3 plantadas. tsc passa.
- Crítico: o agente bloqueia e registra o dossiê; sem botões nem "pessoa decide".
- Home: bloco azul com grafo de agentes + terminal; "Rodar conferência" toca 7 títulos reais via /api/conferir. Lote: mesmo grafo, exceções em linhas com dossiê, remessa final com CSV.
- Tema do brandbook Gogroup (azul #2659a5, lima #d7d900, Poppins). Home só por código (~0,7 s).
- docs/METRICAS.md: tabela agente × júri × humano nos críticos (0/4 fraude liberada; júri sozinho bloquearia 5/5 controles).

## Quebrado / falta
- Telas novas NÃO conferidas no navegador (grafo, animação, tema). Tela /prova ainda no layout antigo.
- Tempo da analista não medido. Red team sintético (30 a 50 críticos) é próximo passo declarado.
- Falta submissão: slides PDF (até 10), formulário, GIFs, pitch (5 min + 5 de sabatina).

## Decisões
- Crítico é bloqueado pelo código; o júri só atua nos ambíguos (sozinho bloquearia legítimos sem prova).
- Defesa: "funciona para este recorte e medimos o que sabemos"; retido ≠ perda evitada. IA só onde há dúvida.

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Dev em :3010; fechar antes de build (senão apagar .next).
- Não abrir /api/publico (expõe ia_token). Lote com IA demora até 45 s: abrir antes da demo.
- Brandbook: link do Google não abre; usei o .pptx em Downloads (paleta e Poppins).

## Próxima ação
1) Conferir home e lote no navegador e ajustar. 2) Slides, GIFs (ScreenToGif), pitch e sabatina. 3) Congelar às 15h e submeter.

## Arquivos-chave
app/{page,Orquestracao,globals.css}, app/lote/[id]/{page,Excecao,BaixarCsv}.tsx, app/api/conferir/route.ts, lib/{remessa,motor,formato}.ts, lib/agente/index.ts, scripts/{avaliar,medir,sombra}.ts, docs/METRICAS.md
