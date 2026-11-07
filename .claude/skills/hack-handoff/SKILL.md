---
name: hack-handoff
description: Salva ou retoma o estado da sessão. Use "salvar" ao encerrar uma tarefa ou "retomar" ao abrir sessão nova.
---

**salvar:** escreva docs/HANDOFF.md (máx. 30 linhas) com as seções: objetivo, funciona,
quebrado, decisões, armadilhas, próxima ação, arquivos-chave. Depois faça commit
só do docs/HANDOFF.md e dos arquivos que você alterou na sessão (nunca `git add -A`;
nunca data/). Mensagem do commit **em inglês e amigável**:
- Assunto de até 60 caracteres, tom leve, começando com "handoff:" e dizendo o
  que mudou, ex.: `handoff: requirements v3 and fraud test set are ready`.
- Corpo opcional de 2 a 4 linhas curtas: o que ficou pronto, o que falta e a
  próxima ação (ex.: "Next up: build the data loader.").
- Sem jargão, sem pontuação exagerada, no máximo um emoji.
- Termine com a linha de atribuição indicada no system-reminder, se houver.
Responda só "salvo".

**retomar:** leia apenas CLAUDE.md e docs/HANDOFF.md. Resuma em 5 linhas o estado e a
próxima ação, e pergunte antes de agir. Não leia outros arquivos.
