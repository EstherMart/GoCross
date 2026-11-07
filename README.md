# GoCross

> Um colega digital que confere cada pagamento antes de a remessa fechar.

Projeto individual do **GoHacks Talent 2026** (Fortaleza, 07 e 08/11), desafio **Pagamentos**.

## O problema

Todo mês saem milhares de pagamentos. O cadastro é manual, em vários sistemas, e ninguém consegue conferir título a título. Hoje o lote é assinado quase sem checagem, e o dinheiro indevido (duplicidade, valor errado, troca de conta, boleto de outro CNPJ) sai junto.

## A solução

O GoCross percorre cada título do lote **antes** do fechamento da remessa e age:

| Nível | O que é | O que o GoCross faz |
|-------|---------|---------------------|
| 1 · Baixo | Rotina, sem sinal de risco | Libera sozinho |
| 2 · Médio | Erro provável (ex.: duplicidade, valor divergente) | Retira do lote e explica o motivo |
| 3 · Crítico | Risco de fraude ou acima da alçada | Bloqueia e pede decisão a uma pessoa, com dossiê curto |

Regras: o nível crítico vence, título não reconhecido não é liberado e pessoa só entra no nível 3.

**Para quem:** a analista de contas a pagar que fecha a remessa. O GoCross assume a conferência repetitiva; ela decide as exceções.

## Tipologias do MVP

G01 duplicidade · G03 valor divergente da duplicata · G04 troca bancária sem confirmação · G05 boleto com CNPJ de outra raiz · G16 controles (casos que parecem erro mas são legítimos e não podem ser barrados).

## Como funciona

- Os CSV são processados **em código**. A IA entra só nos casos ambíguos, para decidir e escrever o parecer.
- Um revisor independente checa se o parecer cita só valores, NF e CNPJ que existem nos dados.
- Texto de e-mail, NF e WhatsApp é tratado como dado, nunca como instrução.

## Stack

Next.js 14 + TypeScript, publicado na Vercel. IA pelo AI Proxy (a chave fica só em variável de ambiente).

## Como rodar

Precisa de Node 20+.

```bash
npm install
cp .env.example .env.local   # preencha AI_PROXY_API_KEY
npm run dev                  # abre o lote RM20261103-MER
npm run avaliar              # acerto por tipologia e placar em R$
```

Os dados ficam em `data/` e **não são versionados**. Coloque a pasta `pagamentos` lá antes de rodar.

## Estrutura

```
app/               tela do lote e rota /api/lote
lib/dados.ts       leitura dos CSV
lib/normalizar.ts  CNPJ, raiz de CNPJ, número de NF
lib/sinais/        detectores em código, por nível
lib/niveis.ts      classificação (o crítico vence)
lib/agente/        IA nos casos ambíguos e revisor
lib/remessa.ts     remessa filtrada e fila de decisões
scripts/avaliar.ts acerto por tipologia sobre data/gabarito/gabarito.csv
docs/              requisitos, gabarito, ideias, AI_LOG e handoff
```

## Estado

Esqueleto de ponta a ponta com a nova interface. Os detectores e o agente de IA ainda estão sendo implementados, então hoje todo título sai como "liberar". O acompanhamento está em [docs/HANDOFF.md](docs/HANDOFF.md).

## Como usamos IA

Cada correção feita à IA está registrada em [docs/AI_LOG.md](docs/AI_LOG.md), com o antes e o depois.

## Documentação

[Requisitos](docs/REQUISITOS.md) · [Gabarito](docs/GABARITO.md) · [Ideias](docs/IDEIAS.md) · [AI_LOG](docs/AI_LOG.md) · [Handoff](docs/HANDOFF.md)

## Quem fez

Luiza Martins · GoHacks Talent 2026

Demo: [CONFIRMAR]

Plano de estudo usado no evento: [Plano GoHacks Talent.html](Plano%20GoHacks%20Talent.html) (local, fora do GitHub).
