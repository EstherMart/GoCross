# AI_LOG

Formato de cada entrada:

## [Hora] Título
- **Tipo:**
- **Pedi:**
- **IA fez:**
- **Como detectei:**
- **Correção:**
- **Resultado (antes→depois):**
- **Aprendizado:**

---

## [10:00] Prompt inicial de criação da base e dos agentes
- **Tipo:** decisão de processo (setup)
- **Pedi:** num único prompt, sem perguntas e com "na dúvida, escolha o mais simples": CLAUDE.md (máx. 40 linhas, com contexto, orçamento de uso por fase e regras de economia), REQUISITOS.md, AI_LOG.md e duas skills (`ai-log` e `hack-handoff`, máx. 15 linhas cada). Pedi só a lista dos nomes dos arquivos como resposta.
- **IA fez:** criou os cinco arquivos na hora, mais um `.gitignore` que eu não tinha pedido (já existia com as mesmas linhas).
- **Como detectei:** conferi os arquivos contra o cartão de memória do plano; o `.gitignore` apareceu como alterado no `git status`.
- **Correção:** ficou o `.gitignore` como estava (só mudou a quebra de linha no fim).
- **Resultado (antes→depois):** [CONFIRMAR] sem medição de tokens ainda; os limites de tamanho foram cumpridos.
- **Como ajuda na gestão de tokens:**
  - Uma resposta só, sem perguntas: evita ida e volta, e cada mensagem reenvia todo o histórico.
  - CLAUDE.md curto: é lido em toda sessão, então cada linha custa em todas.
  - Só duas skills curtas: as descrições ficam sempre carregadas e o corpo só entra quando chamadas.
  - Checagem de MVP, pitch e revisão viraram prompts colados, sem skill e sem subagente (o subagente abre uma janela própria de contexto, o item mais caro).
  - Regras de economia dentro do CLAUDE.md: ler só os arquivos citados, respostas curtas, devolver só os arquivos alterados, sem resumo do que foi feito.
  - Orçamento por fase anotado (setup 10%, MVP 30%, autonomia 30%, revisão 5%, entrega 20%, folga 5%) para não gastar o que a entrega precisa.
- **Aprendizado:** definir as regras de economia no começo reduz o custo de todas as conversas seguintes; falta medir o efeito real.

## [10:42] Tenho sem níveis de criticidade:
- **Tipo:** correção (após alinhamento com mentor)
- **Pedi:** moldar a ideia do motor de pagamentos e fazer pre-mortem
- **IA fez:** propôs saída binária (aprovado automaticamente ou revisão manual) e mandava para pessoa tudo que fosse dúvida; sugeriu o momento da decisão sem medir nos dados
- **Como detectei:** conversa de alinhamento: a pessoa só deve entrar em cenário extremamente crítico, e o desenho deve crescer do menos crítico para o mais crítico
- **Correção:** três níveis (baixo, médio, crítico), construção de baixo para cima, execução com o crítico vencendo primeiro, humano só no nível 3; momento da decisão decidido com medição nos dados (mediana de 28 dias entre lançamento e pagamento; 48 de 876 títulos agendados com troca bancária depois do lançamento): remessa como portão, lançamento como pré-voo
- **Resultado (antes→depois):** [CONFIRMAR] ainda sem teste rodado
- **Aprendizado:** definir quem decide o quê (agente x pessoa) antes de desenhar o fluxo; e medir nos dados antes de opinar sobre o momento

## [10:50] Desafio assumido pelos nomes dos arquivos
- **Tipo:** correção
- **Pedi:** ideias e recomendação para o desafio de pagamentos
- **IA fez:** escreveu requisitos a partir só da lista de 26 arquivos, sem ler dicionário, parâmetros e políticas
- **Como detectei:** ao perfilar os dados, o parametros.md revelou ambiente de simulação com ferramentas por papel e placar em R$ (indevido, atraso, R$ 60 por acionamento)
- **Correção:** REQUISITOS.md reescrito com o placar, o fechamento do lote e a regra de que texto de terceiros é só dado
- **Resultado (antes→depois):** de "classificar liberar/aprovar/bloquear" para níveis de criticidade com custo em R$
- **Aprendizado:** ler dicionário e políticas antes de propor solução

## [11:00] Gestão de tokens, skills e escolha de modelo
- **Tipo:** decisão de processo (custo)
- **Pedi:** registrar como o uso de tokens está sendo gerenciado, como as skills ajudam e qual modelo uso, com justificativa.
- **Modelo em uso:** Sonnet 5.5 (`claude-sonnet-5-5`) como padrão.
- **Por que Sonnet:** a maior parte do trabalho é execução bem especificada (ler CSV, escrever código Next.js/TypeScript, rodar os casos de REQUISITOS.md); o Sonnet resolve isso mais rápido e gasta menos do orçamento por fase do que o Opus.
- **Quando trocar para Opus:** só em decisão de desenho difícil (regras de criticidade, pre-mortem, conflito entre regras de política) ou se o Sonnet errar duas vezes no mesmo ponto. Voltar ao Sonnet depois. Usar o Opus o tempo todo consumiria o orçamento da autonomia e da entrega.
- **Como a gestão de tokens está sendo feita:**
  - Orçamento por fase no CLAUDE.md (setup 10%, fluxo 30%, autonomia 30%, revisão 5%, entrega 20%, folga 5%).
  - Regras de economia: ler só os arquivos citados, respostas curtas, devolver só os arquivos alterados, sem resumo.
  - Plano em até 5 passos com meu OK antes de mudança grande, para não gastar tokens em código que eu não aprovaria.
  - CSV processado em código; a IA entra só na decisão (não lê as 26 planilhas inteiras no contexto).
  - Sem subagentes por padrão (cada um abre janela própria de contexto).
- **Como as skills ajudam:**
  - `ai-log`: registra correção em formato fixo e curto, sem eu reexplicar o formato em cada vez; vira evidência para a entrega.
  - `hack-handoff`: salva o estado ao fim da tarefa e retoma em sessão nova, assim não carrego histórico longo (cada mensagem reenvia todo o histórico) nem releio o que já foi decidido.
  - Só o nome e a descrição ficam sempre carregados; o corpo da skill só entra quando chamada.
- **Resultado (antes→depois):** [CONFIRMAR] sem medição de tokens por fase ainda; conferir o consumo real ao fim de cada fase e anotar aqui.
- **Aprendizado:** modelo mais barato por padrão + sessão curta com handoff + regras de economia escritas valem mais do que otimizar prompt a prompt; falta medir.

## [CONFIRMAR] Interface fora do padrão Gocase
- **Tipo:** correção
- **Pedi:** ajustar a interface, usar o nome GoCross e deixar o README amigável (modelo de README de hackathon).
- **IA fez:** a tela inicial usava estilos soltos no próprio componente, sem identidade e sem seguir o padrão de interface do sistema Gocase.
- **Como detectei:** revisão visual da tela do lote.
- **Correção:** tema centralizado em app/globals.css (cabeçalho GoCross, cartões de resumo, tabela e selos de nível). Os valores de cor e fonte são provisórios: a IA não tem acesso ao design system da Gocase, então trocar pelos tokens oficiais é [CONFIRMAR].
- **Resultado (antes→depois):** [CONFIRMAR] sem medição; só revisão visual.
- **Aprendizado:** passar o design system real (tokens ou link) antes de pedir interface, para a IA não adivinhar o padrão.

## [CONFIRMAR] Regra citada que não existe no politicas.csv (G01)
- **Tipo:** correção
- **Pedi:** explicar de onde vêm as regras e como justificar cada uma.
- **IA fez:** o detector G01 citava `tres_vias.duplicidade`, uma chave que parece oficial mas não está no politicas.csv.
- **Como detectei:** ao ler o politicas.csv para responder, a chave não apareceu em nenhuma linha.
- **Correção:** G01 passou a citar `tres_vias.regra` (OC x NF x título) com comentário no código dizendo que é interpretação, porque o arquivo não tem regra explícita de duplicidade.
- **Resultado (antes→depois):** gabarito 16/16 e 0 falso positivo no G16, iguais antes e depois.
- **Aprendizado:** toda regra citada precisa existir nos dados; conferir a chave contra o politicas.csv antes de escrever.

## [CONFIRMAR] Script de avaliação sem a chave de IA
- **Tipo:** correção
- **Pedi:** rodar a avaliação com a chave já preenchida no .env.local.
- **IA fez:** o `npm run avaliar` (tsx) não carregava o .env.local, então saiu "sem AI_PROXY_API_KEY" mesmo com a chave preenchida.
- **Como detectei:** a saída mostrou "IA: 0 chamadas" e "Revisor: não rodado".
- **Correção:** script passou a usar `--env-file-if-exists=.env.local`.
- **Resultado (antes→depois):** IA de 0 chamadas para 76 chamadas (US$ 0,000987); títulos por IA de 0 para 21 de 876; revisor de "não rodado" para 3/3 ações plantadas derrubadas.
- **Aprendizado:** conferir a saída do script depois de configurar a chave, não só o arquivo.

## [CONFIRMAR] Humano também erra, júri de agentes e orquestração visível
- **Tipo:** mudança de rota
- **Pedi:** responder às críticas: IA como juiz com vários agentes (inclusive um "chato"), comparar erro da IA com erro humano, e a tela parecer dashboard em vez de orquestração.
- **IA fez:** mediu o histórico com os detectores atuais e propôs júri (promotor, defensor, juiz) com citação verificada, trava "IA nunca rebaixa crítico" e visão de orquestração no lote.
- **Como detectei:** crítica externa; a tela mostrava só resultado, não o processo.
- **Correção:** aprovado seguir com 4 passos: comparação humana em METRICAS, júri no lugar do revisor, visão de orquestração, nova medição. Restam 1h30.
- **Resultado (antes→depois):** histórico: 100 títulos pagos com sinal (R$ 703 mil), 35 com aprovação humana explícita (sinal, não erro confirmado).
- **Aprendizado:** defender a IA como apoio que tira a rotina do humano, não como substituta dele nos críticos.

## [CONFIRMAR] Críticos sem humano e orquestração em trilhas
- **Tipo:** correção
- **Pedi / IA fez / Como detectei / Correção:** pedi menos poluição e orquestração clara / IA manteve crítico esperando pessoa ("Pessoa decide", botões simulados) e trilhas com replay difícil de ler / revisando a tela / crítico vira bloqueio final do agente com dossiê registrado; home e lote mostram trilhas por risco (Triagem → Auditor IA | Investigador → Promotor × Defensor → Juiz | Despachante).
- **Resultado (antes→depois):** [CONFIRMAR]
- **Aprendizado:** a autonomia precisa aparecer na tela; mostrar os agentes por papel, não o resultado por título.

## [14:46] Sem tela de loading no lote
- **Tipo:** correção
- **Pedi / IA fez / Como detectei / Correção:** pedi resolver o delay de "Abrir e conferir" / IA criou tela de loading com texto explicativo ("Triagem por regra... júri só nos ambíguos") / revisando a proposta, não quero tela intermediária / loading removido; delay atacado com cache de IA em disco aquecido (IA_CACHE=1), tentativa única na IA e fatias de 24 títulos.
- **Resultado (antes→depois):** [CONFIRMAR]
- **Aprendizado:** resolver a lentidão na causa, sem esconder atrás de tela de espera nem texto extra.

## [CONFIRMAR] Orquestração reiniciava em vez de parar
- **Tipo:** correção
- **Pedi / IA fez / Como detectei / Correção:** pedi o agente conferindo o lote na tela / IA deixou a orquestração em loop (repetia a cada 4 s e apagava o registro) / ao ver que, depois do último ambíguo, o registro do lote reiniciava / roda uma vez, para no último título, mantém o registro e fecha com "conferência concluída"; "Rodar de novo" reinicia.
- **Resultado (antes→depois):** [CONFIRMAR]
- **Aprendizado:** o critério de parada do agente precisa aparecer também na tela; loop de vitrine passa a impressão de que ele não termina.
