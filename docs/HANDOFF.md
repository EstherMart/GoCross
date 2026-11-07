# HANDOFF
## Objetivo
GoCross: triagem de títulos antes da remessa; o agente decide sozinho (libera, retira, bloqueia). Fatia G01, G03, G04, G05 + controles G16. Código congelado; falta a entrega (enviar até 16h15). Demo local, dados fictícios.

## Funciona
- avaliar (sem cache): G01 3/3, G03 4/4, G04 3/3, G05 1/1, G16 5/5, gabarito 16/16, 0 FP, júri 3/3; 855 de 876 por código, IA em 21; US$ 0,0024. Saída em docs/ENTREGA.md.
- Delay resolvido: tentativa única na IA, fatias de 24, cache em disco (IA_CACHE=1). Lote abre em ~0,35–1 s após reiniciar.
- Home com busca de remessa e botão "Conferir lote". Lote em abas: Agentes | Fora da remessa | Remessa final.
- Registro dos agentes: linha do tempo clara, rolável (460 px), segue a última linha.
- Orquestração roda uma vez ao abrir, para no último título e mantém o registro ("conferência concluída"); "Rodar de novo" reinicia. "4/7" = progresso na amostra.

## Quebrado / falta
- Entrega: vídeo (até 2 min), GIFs, slides PDF (até 10), formulário, pitch. Relatório individual pronto em docs/RELATORIO_INDIVIDUAL.md (local, fora do git).
- G09, G02, G14 não rodados; G16 sem conferência contra recebimento/OC/cadastro. Sem cache, 12/146 chamadas de IA estouram 7 s (falha fecha).

## Decisões
- Sem tela de loading (vetado): lentidão resolvida na causa.
- Grafo entra no MVP: mostra o rastro real (amostra de até 7 por lote); o agente roda no servidor com ou sem ele.
- Parada: cada título para no 1º estado final; júri faz 1 rodada; juiz < 60%, sem prova ou "liberar" → bloqueia; IA não responde → mantém o código.

## Armadilhas
- Node fora do PATH: $env:Path += ";C:\Program Files\nodejs". Matar o node da porta 3010 antes do start.
- Demo: npm run build; $env:IA_CACHE="1"; npm start -- -p 3010. Medições sempre sem IA_CACHE.
- Não abrir /api/publico do site do evento na demo (expõe ia_token).

## Próxima ação
1) Pitch (roteiro de 5 min do PPTX). 2) Gravar vídeo/GIFs (roteiro: busca MER → Conferir lote RM20261112-MER → Agentes → Juiz → TP431754 → CSV). 3) Slides PDF. 4) Formulário + link do GitHub público.

## Arquivos-chave
app/{page,Lotes,Orquestracao,globals.css}, app/lote/[id]/{page,Abas,Excecao}.tsx, lib/{ia,remessa,motor}.ts, lib/agente/index.ts, docs/{ENTREGA,AI_LOG,REQUISITOS}.md
