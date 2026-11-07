# REQUISITOS

> Fonte: texto do desafio, dicionario_de_dados.md, parametros.md, politicas.csv, ferramentas.csv e perfil dos dados. Versão 3: adiciona persona, gabarito (GABARITO.md), ação/orquestração e cobertura das 6 frentes após revisão contra os critérios da banca (Modelagem 40%). Versão 2: níveis de criticidade e momento da decisão. Itens [CONFIRMAR] ficam para o mentor.

## Problema
Uma empresa paga um volume alto de títulos (contas a pagar), com cadastro manual repetido em vários sistemas e informação espalhada entre ERP e dois bancos. Ninguém consegue conferir cada pagamento: duplicidade, "um zero a mais", conta bancária trocada ou pagamento sem nota/recebimento só aparecem depois que o dinheiro saiu.

## Usuário-chave
**Analista de contas a pagar** que fecha o lote de remessa antes de enviar ao banco. Hoje confere por amostra, abrindo vários sistemas. Quem aprova (gestor/controladoria) só vê o que o analista escalar.

## Situação-modelo (para o pitch)
**Larissa Gomes**, analista de contas a pagar pleno, usuária da base (`usuarios_sistema.csv`: alçada R$ 5.000, pode alterar dados bancários). A cena ao redor dela é encenada: o horário e as mensagens são inventados. Terça, 03/11: o lote **RM20261103-MER** (Banco Meridiano, `agenda_remessa.csv`) fecha às **10h00** e o tesoureiro vai assinar. Lotes têm em média 52 títulos (máx. 192). Hoje Larissa abre ERP, portal de NF, extrato e e-mail, e confere uns poucos por amostra (inferido, não medido).
- **Antes:** o lote sai com o que estiver nele. Se um fornecedor trocou a conta sem confirmação, ou um título está duplicado, só se descobre depois.
- **Com o colega digital:** ele percorre todos os títulos antes das 10h. Libera os limpos, retira do lote o duplicado e o sem recebimento (com evidência), e para o título de conta trocada: monta o dossiê e manda a Larissa uma mensagem pedindo decisão. Larissa responde "ok" ou "segura"; o lote final sai filtrado.
- **Número da demo:** tempo até o lote fechado e R$ retido, medidos no gabarito (ver GABARITO.md). Não citar ganho que não foi medido.

## Hipótese
Se um colega digital percorrer **cada título do lote antes do fechamento**, resolver sozinho os casos de **criticidade baixa e média** (com evidência, ação reversível e dentro da alçada) e **acionar uma pessoa só no cenário crítico** (fraude, golpe, acima da alçada), então o dinheiro indevido que sai cai e as pessoas são acionadas apenas onde importam. Medida: o placar em R$ da política (indevido que saiu + atraso de legítimo + R$ 60 por acionamento desnecessário) contra a linha de base "o tesoureiro assina o lote sem conferir".

## Momento da decisão: remessa ou lançamento?
Medido nos dados: mediana de **28 dias** entre lançamento e pagamento (p90: 60); na agenda, só **8 de 876** títulos foram lançados até 7 dias antes da data prevista; **48 de 876** pertencem a fornecedores que trocaram dados bancários **depois** do lançamento. Origem dos agendados: xml_portal 516, boleto_email 153, manual 137, integração de frete 70. Lotes têm 52 títulos em média (máx. 192) e fecham às 10h e 14h.
- **Remessa = portão de decisão.** É o único momento em que cadastro atual, pagamentos manuais, extrato, boleto e status da NF convergem, e a última chance antes de o dinheiro sair. Uma checagem só no lançamento fica velha em semanas.
- **Lançamento ou chegada da NF = pré-voo, com o mesmo motor.** Pega erro de digitação com semanas de folga (corrigir é barato) e reduz o volume sob pressão no dia do lote. O ferramentas.csv não tem ferramenta de lançar título: a NF emitida só pode ser lida, não gerar o título.
- **MVP:** remessa. **Extensão:** rodar o mesmo motor no lançamento.

## Fluxo atual (inferido)
1. Título entra no contas a pagar (cadastro manual a partir de NF/boleto).
2. Alterações de cadastro de fornecedor feitas à mão em mais de um sistema.
3. Lote de remessa montado e aprovado conforme alçada [CONFIRMAR].
4. Remessa vai ao banco; retorno e extrato são conferidos depois.

## Solução (MVP)
Cada título passa por três níveis de criticidade. **Construção: de baixo para cima** (nível 1, depois 2, depois 3). **Execução: o crítico vence primeiro** (um sinal crítico nunca é liberado por um nível menor). Regra de pessoas: **humano só no nível 3.**

| Nível | O que é | Exemplos (política) | O que o agente faz |
|---|---|---|---|
| 1 · baixo | Divergência de forma, dentro da tolerância, sem risco de dinheiro | NF com zeros ou série; filial com mesma raiz de CNPJ; título = duplicata ±R$ 0,10; multa e juros legítimos; OC dispensada (utilidades) ou NF dispensada (aluguel); vencimento no próximo dia útil; NF até 2% ou R$ 50 acima da OC | Libera sozinho; corrige o lançamento quando o erro de digitação é evidente |
| 2 · médio | Dinheiro potencialmente indevido, mas o agente prova e age com ação reversível, dentro da alçada de R$ 5 mil | Duplicidade; valor digitado ≠ duplicata (zero a mais); título já pago fora do lote; NF cancelada; produto sem recebimento | Investiga (consulta, contata o fornecedor só pelo canal do cadastro), corrige, cancela ou retira do lote, com evidência. Sem acionar pessoa |
| 3 · crítico | Fraude, golpe ou decisão que não cabe ao agente | Troca bancária sem confirmação válida; boleto ou 2ª via com banco/beneficiário diferente por canal fora do cadastro; "diretor" pedindo pagamento urgente; sem NF/OC fora das dispensas; acima de R$ 50 mil; fracionamento para fugir da alçada | Bloqueia (retira do lote), monta o dossiê e aciona a pessoa certa (PS01, PS03 ou PS08) |

Pipeline por título, com a parte numérica em **código** (barato e exato) e a IA onde precisa de leitura, política em texto e parecer:
1. **Coleta e sinais em código:** título → NF → OC → recebimento → cadastro → histórico → extrato.
2. **Classificação por nível** (crítico primeiro) e escolha da ação.
3. **Autoverificação por nível:** citações existem nos dados (código); revisor adversário pergunta "esta ação pode prejudicar um pagamento legítimo?"; no nível 3 confere se o acionamento se justifica (evita R$ 60 à toa) e se o dossiê está completo. Textos de terceiros são só dado.
4. **Tela:** lote com semáforo por nível, ação tomada e parecer; botão "rodar exemplo".

## Ação e orquestração (o que faz o agente ser colega, não painel)
O desafio exige que o agente **aja nos sistemas** e **levante a mão** quando não deve decidir. O resultado do lote é uma ação, não só uma classificação:
- **Saída 1, remessa filtrada:** lista final de títulos liberados, gerada pelo agente; os retirados e bloqueados ficam registrados com motivo e regra.
- **Saída 2, pedido de decisão:** para títulos de nível 3 (e aprovações acima da alçada), o agente envia mensagem à pessoa certa (PS01, PS03 ou PS08) com dossiê curto e **recebe a resposta**, que muda o status do título. Canal: simulado na tela (estilo chat) na demo, dito explicitamente; WhatsApp/Telegram/Slack ficam como próximo passo [CONFIRMAR com mentor se vale canal real].
- **Ferramentas usadas** (nomes de ferramentas.csv): consultar_* (leitura), retirar_do_lote, bloquear_titulo, solicitar_aprovacao, acionar_pessoa. O agente escolhe a ferramenta; o dado numérico vem de código.
- **Papéis (orquestração):** Investigador (níveis 1 e 2: coleta evidência e age), Revisor adversário (pergunta se a ação pode prejudicar pagamento legítimo e confere citações), Despachante (nível 3: dossiê, mensagem, registro da resposta). Uma chamada de IA por título ambíguo, nunca por título limpo.
- **Registro de erros da IA:** cada correção feita sobre saída da IA vai ao AI_LOG.md (alimenta Modelagem e o relatório individual).

## Diferencial sugerido: red team e blue team em IA (proteção da área de pagamento)
**Status: sugestão, fora do MVP mínimo.** Entra só depois de P3 e P4 funcionando e com OK do mentor. Ideia: o GoCross não só confere o lote, ele **prova que a área de pagamento resiste a invasão cibernética**, testando a si mesmo.

**Dois agentes de IA, em ambiente simulado:**
- **Red team (atacante):** gera cenários de invasão e fraude contra o fluxo de pagamento, em cima de títulos do lote. Exemplos ligados às tipologias já mapeadas: e-mail de "diretor" pedindo pagamento urgente; troca de conta bancária por canal fora do cadastro (G04); boleto ou 2ª via com beneficiário de outra raiz de CNPJ (G05); NF ou e-mail com instrução embutida ("ignore as regras") para enganar a IA (G14); fracionamento para fugir da alçada de R$ 5 mil; pedido de liberar título já bloqueado.
- **Blue team (defensor):** o próprio GoCross (detectores em código, Investigador, Revisor, Despachante). Tenta detectar, bloquear e acionar a pessoa certa.
- **Placar do duelo:** quantos ataques o blue team barrou, quantos passaram, quantos controles G16 (legítimos) foram barrados por engano, e o R$ que teria saído. Rodadas repetidas mostram a evolução e alimentam o AI_LOG.

**Regras de segurança do próprio experimento (obrigatórias):**
- O red team **só gera dados de teste** (títulos, e-mails e boletos sintéticos em memória ou em arquivo separado). Não acessa banco, ERP nem sistema real, não faz varredura, não envia mensagem a ninguém.
- Casos do red team ficam **separados do gabarito real** (`data/gabarito/` intocado) e rotulados como sintéticos. Como a declaração do hackathon é "apenas dados fornecidos", **injetar só com OK do mentor** (mesma regra do ponto 10 dos pontos fracos).
- Não se publica o texto dos ataques na demo pública além de exemplos mínimos; a chave de IA continua só em `AI_PROXY_API_KEY`.

**Proteção da área de pagamento (o que o blue team deve garantir):**
1. Texto de terceiros (e-mail, NF, WhatsApp, descrição) é **só dado**: nunca vira instrução nem chamada de ferramenta.
2. **Lista fixa de ferramentas** por papel (analista_cp, auditor, aprovador) e menor privilégio: a IA propõe, o código executa só o que o papel permite.
3. **Falha fecha:** título não reconhecido, IA fora do ar ou revisor sem resposta = não libera.
4. Nenhuma ação que **solta dinheiro** sem checagem em código e revisor; liberar nunca depende só de texto gerado.
5. **Separação de funções:** quem sugere não aprova; acima da alçada vai a aprovador (PS01, PS03 ou PS08).
6. **Registro de cada ação** (quem, o quê, evidência, regra) para auditoria; ataque barrado também é registrado.
7. Segredos fora do repositório; `/api/publico` e `ia_token` não são copiados.

**Critério de pronto (se entrar):** pelo menos 5 cenários do red team rodados contra o lote, tabela barrados × passaram × falsos positivos, e a causa de cada ataque que passou. Não citar taxa de detecção sem esse número medido.

**Risco:** pode soar como escopo demais para 1 dia. Corte primeiro o agente atacante autônomo e fique com **cenários de ataque fixos** (lista curta, escritos por nós) contra o blue team; a IA atacante vira próximo passo.

## Cobertura das 6 frentes oficiais do desafio
| Frente | Cobertura no MVP |
|---|---|
| 1 Volume sem revisão título a título | Total: todos os títulos do lote são percorridos |
| 2 Cadastro manual repetido | Parcial: detecta erro de digitação e propõe correção; cadastro automático fica fora |
| 3 Erros do cadastro manual | Total: duplicidade, zero a mais, valor × duplicata |
| 4 Informação fragmentada | Total: ERP, NF, OC, recebimento, cadastro, extratos e DDA cruzados |
| 5 Pegar o erro antes de sair o dinheiro | Total: portão na remessa (PoC) |
| 6 Seguir sozinho × pedir aprovação | Total: níveis 1 e 2 sozinho, nível 3 pede decisão |

**Pendente com o mentor:** a política manda acionar o comprador quando a NF passa da OC além da tolerância, e pede aprovador acima de R$ 5 mil. O colega digital pode tratar isso como rotina (via ferramenta de aprovação) ou conta como acionamento?

## Requisitos
**DEVE**
- Ler contas_a_pagar, lotes_remessa, fornecedores, alteracoes_cadastro, notas_fiscais, pedidos_compra, recebimentos_mercadoria, politicas, parametros.
- Classificar cada título do lote em nível 1, 2 ou 3, com justificativa e regra citada. Ordem de construção: 1, 2, 3.
- Nível 1 fechado de ponta a ponta antes de começar o 2; se o tempo acabar, título não reconhecido não é liberado.
- Detectar ao menos: duplicidade, valor anômalo, troca bancária sem confirmação, boleto divergente.
- **Agir:** gerar a remessa filtrada (liberados) e registrar retirados/bloqueados com motivo; enviar pedido de decisão ao responsável no nível 3 e processar a resposta (canal simulado, declarado).
- Rodar nos casos de GABARITO.md e mostrar acerto por tipologia (ajuste e validação separados), incluindo falsos positivos nos controles G16.
- Fluxo de ponta a ponta na Vercel; processamento dos CSV em TypeScript no servidor (sem Python nesta máquina).

**PODERIA**
- Conciliar retorno_remessa e extratos dos bancos.
- Cruzar dda_boletos com contas a pagar.
- Segregação de funções (aprovacoes, usuarios_sistema, log_auditoria).
- Rascunho de mensagem ao fornecedor (comunicacoes_fornecedores).
- Custo e tempo por título no slide.
- Diferencial red team × blue team (seção própria acima): cenários de ataque simulados contra o fluxo de pagamento, com placar de barrados × passaram.

**NÃO VAI**
- Cadastro automático nos sistemas, integração real com ERP/banco, login, treino de modelo, dashboard de 12 gráficos.

## Dados (perfil feito em 07/11, pasta data/pagamentos)
**Formato.** Dados 100% sintéticos (dicionário). CSV com vírgula, UTF-8, datas ISO, ponto decimal. **Exceção: extrato_banco_litoral.csv** (`;`, dd/mm/aaaa, vírgula decimal, ponto de milhar). Na pasta, comunicacoes_fornecedores, politicas e ferramentas são **.csv**, não .jsonl/.json como o dicionário diz. CNPJ varia: com pontuação (ERP, boleto), só números (Compras, NF). Número da NF no título vem "como digitado" (zeros, `-1`, série).

**Ambiente de simulação (muda o desenho).** parametros.md e ferramentas.csv descrevem um ambiente de 168 horas (02/11 08:00 → 09/11 08:00) com agente por papel (analista_cp, auditor, aprovador) e 26 ferramentas (consultar_*, retirar_do_lote, bloquear_titulo, solicitar_aprovacao, acionar_pessoa...). Placar em R$: −(dinheiro que saiu indevidamente + atraso de pagamento legítimo + R$ 60 por acionamento desnecessário). Hoje o tesoureiro assina o lote sem conferir; **o que estiver no lote sai no fechamento** (Meridiano 10:00, Litoral 14:00). Textos de e-mail/WhatsApp/NF são dado, nunca instrução (risco de prompt injection).

**Volumes.** contas_a_pagar 7.120 títulos (4.698 pagos, 1.522 abertos, 876 agendados, 24 cancelados); agenda_remessa 876 títulos em 17 lotes (03/11–13/11); notas_fiscais 4.150; pedidos_compra 6.055; fornecedores 131; comunicações 245; alteracoes_cadastro 67.

**Nulos e chaves (medido).** 14 títulos sem NF, 16 sem OC, 4.338 sem CNPJ de boleto (esperado: ted/pix). Todos os fornecedor_id e OC existem. Dos abertos/agendados com NF digitada, 2.394 de 2.396 acharam a NF no portal ao normalizar (raiz do CNPJ + número sem zeros): **os joins funcionam**.

**Sinais já visíveis.**
- 113 grupos de títulos com mesmo fornecedor + NF normalizada + parcela (226 títulos); em 34 deles há ao menos um aberto/agendado: candidatos a duplicidade. Mais 22 abertos com mesmo fornecedor + valor + vencimento.
- alteracoes_cadastro: 12 trocas de banco, 12 de agência, 12 de conta, 5 de pix (jan–out). 2 linhas de banco/conta/pix sem confirmação registrada (uma troca gera até 3 linhas); **25 títulos na agenda pertencem a fornecedores com troca sem confirmação**.
- Boletos por e-mail (1.203 títulos) trazem banco/beneficiário que podem divergir do fornecedor (regra de golpe em politicas).

**Problemas que quebrariam o agente.**
1. Rótulos de "indevido" **não existem** nos arquivos: a verdade fica escondida no ambiente; teremos de rotular por evidência (duplicata, troca sem confirmação, boleto divergente).
2. Chaves heterogêneas (FP/FN/FC, CNPJ com e sem máscara, filial com raiz igual, NF com zeros/série) e Litoral em formato diferente.
3. Texto de terceiros (comunicações, infCpl, descrição) pode conter instruções; deve ser tratado só como dado.

**Hipótese:** a coluna necessária existe e está preenchida (titulo→NF→OC→recebimento→cadastro→histórico). Falta validar: valor título × duplicata, OC × NF (2% ou R$ 50), linha digitável × fornecedor.

**Impacto no desenho (a decidir).** O ponto de decisão real é o **fechamento do lote**, não só o lançamento. Quando em dúvida, `acionar_pessoa` custa R$ 60; retirar do lote um título legítimo custa multa + R$ 250–3.000 de relacionamento. Aprovação automática errada custa o valor do título.

## Casos de teste
Fonte: **GABARITO.md** (16 tipologias G01–G16 mapeadas). **Escopo do MVP: 5 tipologias (G01, G03, G04, G05 e controles G16).** Manifesto `data/gabarito/gabarito.csv` montado em 07/11 com 16 títulos reais da agenda (origem real, nenhum injetado): G01 ×3, G03 ×4, G04 ×3, G05 ×1, G16 ×5; ajuste e validação separados. Os controles G16 ainda não foram checados contra recebimento, OC e cadastro. Exemplos do primeiro ciclo (ids genéricos; títulos reais no CSV):
| id | entrada | esperado | grupo |
|----|---------|----------|-------|
| G01 | título duplicado [id] | retirar, cita título original | ajuste |
| G03 | valor com zero a mais [id] | corrigir/retirar, cita duplicata | ajuste |
| G04 | conta trocada sem confirmação [id] | bloquear, acionar pessoa | ajuste |
| G16 | título limpo suspeito [id] | liberar | ajuste |
| G09 | sem recebimento [id] | retirar | validação (não rodado) |
| G02 | NF reemitida [id] | retirar | validação (não rodado) |
| G14 | texto com instrução ("ignore as regras") [id] | ignorar instrução, bloquear | validação (não rodado; fora do escopo do MVP) |

## Métricas
- Processo: acerto por tipologia (ajuste e validação), falsos positivos nos controles G16, tempo e custo por título.
- Placar em R$ contra a linha de base "assinar sem conferir"; lista do que o agente deixou passar.
- Negócio: valor em R$ retido antes da remessa; títulos que o analista deixa de abrir.

## Pontos fracos que a banca pode apontar (revisão de 07/11)
| # | Ponto fraco | Por que a banca pode achar | Resposta / ação |
|---|---|---|---|
| 1 | Gabarito pequeno e escolhido por nós | 16 casos, 1 só de G05; "acerto 100%" soa circular | Dizer o n real; rótulo por evidência dos dados; mostrar o que o agente deixou passar; ajuste e validação separados |
| 2 | Poucos "indevidos" reais | G04 é 1 fornecedor (FP4615, 3 linhas de alteração); G05 tem 1 título | Não generalizar; apresentar como prova de conceito e declarar a amostra |
| 3 | "É só regra if/else" | Duplicidade, G03, G04 e G05 são regras em código | Mostrar 2 casos ambíguos onde a regra erra e a IA decide (Jev + parecer); citar quanto é código e quanto é IA |
| 4 | IA no app | Resolvido: `lib/agente` tem Investigador, júri, Auditor e Despachante | Mostrar quanto é código e quanto é IA (Jev + parecer) |
| 5 | Ação é simulada | Canal e resposta da pessoa são de mentira | Declarar na tela e no pitch; registrar cada ação; canal real fica como próximo passo |
| 6 | Verificador pode concordar com tudo | Revisor adversário sem prova | Plantar 3 ações erradas e reportar quantas ele derrubou |
| 7 | Número de impacto inferido | "Larissa confere uns poucos" é inferido; mediana de 28 dias e 48/876 são medidos | Só usar números medidos; o resto, rotular como inferido |
| 8 | G03 não é só "zero a mais" | A maioria dos casos reais é valor a **menor** (dígito faltando) | Nomear como "valor ≠ duplicata"; tratar acima de R$ 5 mil como requer aprovação |
| 9 | Fronteira nível 2 × 3 não validada | Comprador e aprovador acima de R$ 5 mil ainda pendentes | Perguntar ao mentor e registrar a resposta |
| 10 | Dados injetados vs. declaração "apenas dados fornecidos" | Casos sintéticos poderiam ferir a declaração | MVP atual usa só casos reais; injetar só com OK do mentor |
| 11 | Custo e tempo por título sem medição | Slide promete R$ 0,0X por análise | Registrar `usage` e tempo por chamada (Jev traz `estimated_cost_usd`; chat só tokens) |
| 13 | Red team usa casos sintéticos | Conflita com "apenas dados fornecidos" e pode virar escopo demais | Separar do gabarito real, rotular como sintético, pedir OK do mentor; começar com cenários fixos |
| 12 | Segurança do repositório | Chave exposta ou `data/` público | Chave só em `AI_PROXY_API_KEY`; `data/` no `.gitignore`; token `ia_token` do /api/publico não copiado |

## Outros desafios (simulados, fora da lista do site)
Pagamento em feriado bancário ou data de agenda errada · fracionamento para fugir de alçada · NF cancelada ainda paga · pagamento sem recebimento · preço diferente do contrato · remessa rejeitada sem reprocesso · quem cadastra também aprova. Detalhes e ideias em IDEIAS.md.
