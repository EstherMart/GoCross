# hackthonGo · GoHacks Talent 2026

Plano de estudo e execução para o hackathon individual (Fortaleza, 07 e 08/11).

- [Plano GoHacks Talent.html](Plano%20GoHacks%20Talent.html): plano em 8 páginas (essencial, prompts, MVP, setup e skills, entrega e pitch, tokens e riscos, meu projeto, Dia D). Abra no navegador.

## Setup inicial (ordem)

1. Criar `.gitignore` (`.env*`, `node_modules/`, `.next/`, `.vercel/`, `.claude/settings.local.json`) **antes do primeiro commit**. O repositório é público.
2. Prompt SETUP 1: gera `CLAUDE.md` (máx. 40 linhas), `REQUISITOS.md`, `AI_LOG.md` e as skills `ai-log` e `hack-handoff` (máx. 15 linhas cada).
3. Depois de escolher o desafio: SETUP 2 (perfil dos dados) e SETUP 3 (esqueleto Next.js + rota de IA com validação, retry e `maxDuration`).

Os textos dos prompts estão na página 4 do plano, com botão de copiar.

## Projeto: colega digital de contas a pagar (desafio Pagamentos)

Confere cada título do lote antes do fechamento da remessa e age: libera, retira, bloqueia ou pede decisão a uma pessoa. Documentação em [docs/](docs/): [REQUISITOS.md](docs/REQUISITOS.md), [GABARITO.md](docs/GABARITO.md), [IDEIAS.md](docs/IDEIAS.md), [AI_LOG.md](docs/AI_LOG.md) e [HANDOFF.md](docs/HANDOFF.md) (estado da sessão).

```
app/            página do lote (semáforo por nível) e rota /api/lote
lib/dados.ts    leitura dos CSV de data/pagamentos
lib/normalizar.ts  CNPJ, raiz de CNPJ, número de NF
lib/sinais/     detectores em código, por nível (1, 2, 3); G01–G16
lib/niveis.ts   classificação (o crítico vence; não reconhecido não é liberado)
lib/agente/     Investigador, Revisor, Despachante (IA só nos ambíguos)
lib/remessa.ts  remessa filtrada e fila de decisões
scripts/avaliar.ts  acerto por tipologia e placar em R$ sobre data/gabarito/gabarito.csv
```

**Rodar** (precisa de Node, que não está instalado nesta máquina): `npm install`, depois `npm run dev` (abre o lote RM20261103-MER) e `npm run avaliar`. Chave de IA: copiar `.env.example` para `.env.local`.

**Dados:** `data/` não é versionado (repositório público). Para publicar na Vercel é preciso decidir como levar os CSV [CONFIRMAR].

**Estado:** esqueleto. Os detectores de `lib/sinais/` e o agente ainda são vazios; todo título hoje cai em "liberar" (nível 1, sem sinais), e o gabarito está sem casos.
