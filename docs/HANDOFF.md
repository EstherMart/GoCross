# HANDOFF

## Objetivo
GoCross: triagem de títulos antes do fechamento da remessa; o agente decide sozinho (libera, retira, bloqueia). Desafio "Pagamentos". Fatia: G01, G03, G04, G05 + controles G16. Congelar 15h, enviar 16h15 (o site do evento diz 16h30). Demo no localhost (dados fictícios, sem Vercel).

## Funciona
- Júri (promotor × defensor × juiz) nos ambíguos; IA nunca libera. Gabarito 16/16, 0 FP, 3/3 plantadas. tsc passa.
- Crítico: o código bloqueia e o despachante registra o dossiê (fraude → PS08; > R$ 50 mil → PS03; demais → PS01).
- Velocidade: decidir() com memória por título (reiniciar o dev limpa); parecer e jev do investigador em paralelo.
- Orquestração roda sozinha ao abrir o lote e repete a cada 4 s (botão só reinicia). PASSO_MS = 700. Corrigido o Strict Mode que deixava viva=false.
- Registro dos agentes agora é seção própria abaixo do grafo (largura total, 40 linhas). Lote sem exceção toca 3 liberados.
- Grafo com colunas espaçadas (10/30/50/70/89%); sem animação infinita nem glow.
- Dossiê curto: "→ Nome · canal simulado" (regra de roteamento só no README/pitch).

## Quebrado / falta
- Nada desta sessão foi conferido no navegador (grafo, registro, auto-run). tsc ok.
- Medir e REQUISITOS.md não rodados após as mudanças.
- Home ainda parece dash; ideia: abrir no lote com mais exceções (RM20261112-MER, 6). Agrupar acionamentos por responsável.
- Tempo da analista não medido. Red team sintético (30 a 50 críticos) com OK do mentor.
- Falta submissão: slides PDF (até 10), formulário, GIFs, pitch (5 min + 5 de sabatina).

## Decisões
- Grafo na remessa, não na home. Crítico é bloqueado pelo código; júri só nos ambíguos.
- Defesa: "funciona para este recorte"; integração entre sistemas fica fora; retido ≠ perda evitada.
- Demo: abrir RM20261112-MER (lote RM20261103-LIT não tem IA, 15 limpos).

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Dev em :3010; fechar antes de build.
- Erro "__webpack_modules__[moduleId]": parar o dev, apagar .next e subir de novo.
- Não abrir /api/publico (expõe ia_token). Subir com IA_CACHE=1 e abrir os lotes antes.
- Memória do decidir guarda "IA fora do ar" até reiniciar; reiniciar antes de medir.

## Próxima ação
1) Limpar .next, subir dev, conferir lote (grafo, registro, auto-run). 2) Rodar medir e casos de REQUISITOS.md. 3) Red team, cronômetro, slides, GIFs, pitch.

## Arquivos-chave
app/{page,Orquestracao,globals.css}, app/lote/[id]/{page,Excecao}.tsx, lib/{ia,remessa,motor,formato}.ts, lib/agente/index.ts, docs/{METRICAS,IMPACTO}.md
