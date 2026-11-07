# HANDOFF

## Objetivo
GoCross: triagem de títulos antes do fechamento da remessa; o agente decide sozinho (libera, retira, bloqueia). Desafio "Pagamentos". Fatia: G01, G03, G04, G05 + controles G16. Congelar 15h, enviar 16h15 (o site do evento diz 16h30). Demo no localhost (dados fictícios, sem Vercel).

## Funciona
- Júri (promotor × defensor × juiz) nos ambíguos; IA nunca libera. Gabarito 16/16, 0 FP, 3/3 plantadas (antes dos ajustes de hoje).
- Crítico: o código bloqueia e o despachante registra o dossiê (fraude → PS08; > R$ 50 mil → PS03; demais → PS01). Nomes conferidos com politicas.csv.
- Orquestração roda sozinha ao abrir o lote (PASSO_MS = 700); grafo e registro dos agentes em seções próprias.
- Revisão cética aplicada: evidências do chat em <dados>; júri e Auditor só aceitam número real (Number(null) era 0); valor ilegível vai a PS03; timeout da IA 12 s → 7 s.
- Home: removido o parágrafo final "Na semana, 829 de 876...".

## Quebrado / falta
- Nada conferido no navegador desde as mudanças (grafo, registro, auto-run). tsc/build não rodados após os ajustes de hoje.
- docs/ENTREGA.md não existe: números sem evidência rastreável. Rodar medir e avaliar e registrar a saída.
- G09, G02, G14 marcados "não rodado" em REQUISITOS; G16 sem checagem contra recebimento/OC/cadastro.
- Retry duplo em ia.ts ainda existe (pior caso ~14 s); decidir() memoriza "IA fora do ar".
- Falta submissão: texto da seção #submissao não lido (página carrega por JS); slides PDF (até 10), formulário, GIFs, vídeo, pitch (5 min + 5 de sabatina). Red team com OK do mentor.

## Decisões
- Grafo na remessa, não na home. Crítico bloqueado pelo código; júri só nos ambíguos.
- Defesa: "funciona para este recorte"; retido ≠ perda evitada.
- Demo em produção local (build + start) com IA_CACHE=1 para evitar delay; abrir RM20261112-MER (6 exceções).

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Porta 3010: matar o node antigo antes (EADDRINUSE).
- .next apagada; fazer npm run build antes de npm start -- -p 3010.
- Não abrir /api/publico (expõe ia_token). Abrir os lotes uma vez para aquecer o cache.
- Reiniciar antes de medir (memória do decidir guarda falha da IA).

## Próxima ação
1) npm run build e npm start -- -p 3010; conferir lote (grafo, registro, auto-run). 2) medir/avaliar e criar ENTREGA.md. 3) Colar a seção #submissao aqui; gravar GIFs/vídeo, slides, pitch.

## Arquivos-chave
app/{page,Orquestracao,globals.css}, app/lote/[id]/{page,Excecao}.tsx, lib/{ia,remessa,motor,formato}.ts, lib/agente/index.ts, docs/{REQUISITOS,METRICAS,IMPACTO}.md
