# HANDOFF

## Objetivo
GoCross: triagem de títulos antes do fechamento da remessa; o agente decide sozinho (libera, retira, bloqueia). Desafio "Pagamentos". Fatia: G01, G03, G04, G05 + controles G16. Congelar 15h, enviar 16h15 (o site do evento diz 16h30). Demo no localhost (dados fictícios, sem Vercel).

## Funciona
- Júri (promotor × defensor × juiz) nos ambíguos; IA nunca libera. Gabarito 16/16, 0 FP, 3/3 plantadas. tsc passa.
- Crítico: o código bloqueia e o despachante registra o dossiê (fraude → PS08; > R$ 50 mil → PS03; demais → PS01).
- Grafo de agentes só em /lote/[id]: nós claros com estado (aguardando/rodando/concluído), clique abre o que o agente disse. Home agora é resumo da semana + fila ("Abrir e conferir").
- Dossiê (Excecao.tsx): "por que bloqueou / por que não liberou" e "encaminhado a".
- Tela /prova removida; lib/prova.ts fica (gabarito usado por avaliar e sombra).
- IA_CACHE=1 grava respostas da IA em .cache/ (opt-in, fora das medições). Timeout da IA: 12 s.
- docs/IMPACTO.md novo (impacto, riscos, proposições); README atualizado.

## Quebrado / falta
- Layout novo do grafo e da home NÃO conferido no navegador (nós cortados à direita foram reposicionados).
- Não feito: agrupar acionamentos por responsável; destacar a remessa com mais exceções (RM20261112-MER, 6).
- Tempo da analista não medido. Red team sintético (30 a 50 críticos) é o próximo passo, com OK do mentor.
- Falta submissão: slides PDF (até 10), formulário, GIFs, pitch (5 min + 5 de sabatina).

## Decisões
- Grafo na remessa, não na home: uma remessa, uma analista, um resultado.
- Crítico é bloqueado pelo código; o júri só atua nos ambíguos.
- Defesa: "funciona para este recorte e medimos o que sabemos"; retido ≠ perda evitada.

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Dev em :3010; fechar antes de build.
- Erro "__webpack_modules__[moduleId]": parar o dev, apagar .next e subir de novo.
- Não abrir /api/publico (expõe ia_token). Demo: subir com IA_CACHE=1 e abrir os lotes antes.
- Timeout menor (12 s) pode subir as falhas do proxy; rodar medir de novo.

## Próxima ação
1) Limpar .next, subir dev e conferir home e lote. 2) Red team sintético e cronômetro de 10 títulos. 3) Slides, GIFs, pitch; congelar às 15h.

## Arquivos-chave
app/{page,Orquestracao,globals.css}, app/lote/[id]/{page,Excecao}.tsx, lib/{ia,remessa,motor,formato}.ts, lib/agente/index.ts, docs/{METRICAS,IMPACTO}.md
