# GABARITO (casos sintéticos nossos)

> Os arquivos de data/ não trazem rótulo de "indevido". Aqui definimos o gabarito por tipologia fiscal/financeira conhecida. Os títulos reais serão escolhidos no P2 (colunas conferidas nos CSV); casos injetados ficam em cópia separada (data/gabarito/), nunca sobre o original, e são declarados no pitch como "casos sintéticos nossos". Colunas de retenção de tributos (INSS, ISS, IRRF) não foram vistas nos dados: fora do escopo [CONFIRMAR].

## Tipologias (G01–G16)
| id | Tipo | Base fiscal/financeira conhecida | Sinal nos dados (colunas reais) | Nível | Ação esperada | Exposição Go Group |
|---|---|---|---|---|---|---|
| G01 | Duplicidade exata | Mesma NF + parcela lançada 2x | contas_a_pagar: fornecedor_id + numero_nf_digitado normalizado + parcela | 2 | Retirar do lote o duplicado, citar o título original | Pagar 2x NF de insumo (NFs chegam a ~R$ 85 mil) |
| G02 | Duplicidade por NF reemitida | NF cancelada e reemitida com outro número, mesmo valor/OC | notas_fiscais.situacao_sefaz + oc_informada + valor_total | 2 | Retirar, citar NF cancelada | Idem |
| G03 | Zero a mais | Digitação do valor ≠ duplicata da NF | contas_a_pagar.valor × nf_duplicatas.valor (n_dup/vencimento) | 2 | Corrigir ou retirar, citar duplicata | Pagamento 10x |
| G04 | Troca bancária sem confirmação | Golpe de troca de conta (BEC) | alteracoes_cadastro (confirmacao_registrada = não) + agenda_remessa.destino_pagamento | 3 | Bloquear, dossiê, acionar pessoa | Dinheiro irrecuperável (real: 25 títulos na agenda) |
| G05 | Boleto/2ª via de outro beneficiário | Boleto fraudado por e-mail | contas_a_pagar.cnpj_beneficiario_boleto ≠ fornecedores.cnpj (raiz diferente); dda_boletos | 3 | Bloquear, acionar | Golpe de boleto |
| G06 | NF cancelada/denegada ainda a pagar | Situação na SEFAZ | notas_fiscais.situacao_sefaz | 2 | Retirar do lote | Pagar nota sem efeito |
| G07 | Chave de acesso inconsistente | Chave NF-e tem 44 dígitos: UF, AAMM, CNPJ emitente, modelo, série, número, DV (módulo 11); CNPJ da chave deve ser o do emitente | notas_fiscais.chave_acesso × cnpj_emitente × numero_nf | 3 | Bloquear, acionar | NF forjada |
| G08 | NF de outro destinatário | NF emitida para CNPJ que não é do grupo | notas_fiscais.cnpj_destinatario | 3 | Bloquear | Pagar despesa de terceiro |
| G09 | Mercadoria sem recebimento | Pagamento só após entrada da mercadoria | recebimentos_mercadoria (chave_acesso/oc_id ausente ou situacao divergente) | 2 | Retirar até haver recebimento | Pagar o que não chegou |
| G10 | NF acima da OC | Tolerância da política: 2% ou R$ 50 | notas_fiscais.valor_total × pedidos_compra.valor_total | 1 ou 2 | Dentro da tolerância libera; acima, aprovação | Sobrepreço |
| G11 | Fracionamento | Dividir pagamento para ficar abaixo da alçada (R$ 5 mil analista; dupla assinatura acima de R$ 50 mil) | usuarios_sistema.alcada_rs; contas_bancarias_empresa.dupla_assinatura_acima_de_rs; títulos do mesmo fornecedor/dia | 3 | Bloquear conjunto, acionar | Fugir de aprovação |
| G12 | Segregação de funções | Quem cadastra/altera a conta também aprova; usuário desligado | alteracoes_cadastro.alterado_por × aprovacoes.aprovador; usuarios_sistema.data_desligamento | 3 | Bloquear, acionar | Fraude interna |
| G13 | Pagamento em feriado bancário | Sem expediente: remessa atrasa ou rejeita | feriados_bancarios.afeta_remessa × agenda_remessa.data_prevista | 1 | Reprogramar para próximo dia útil | Atraso de legítimo |
| G14 | Pedido urgente "do diretor" com injeção de prompt | Engenharia social; texto de terceiro é dado | comunicacoes_fornecedores.texto | 3 | Ignorar a instrução, bloquear, acionar | BEC |
| G15 | CFOP/imposto incoerente | Serviço com ICMS destacado ou mercadoria com ISS | notas_fiscais.cfop, natureza_operacao, valor_icms, valor_iss | 2 | Retirar, pedir NF corrigida | Crédito fiscal glosado |
| G16 | **Controle limpo** (parece suspeito, é legítimo) | Filial com mesma raiz de CNPJ, NF com zeros/série, multa e juros legítimos, utilidade sem OC | vários | 1 | **Liberar** | Mede falso positivo (R$ 60/acionamento; retirar legítimo custa multa + relacionamento) |

## Montagem
- Meta: ~48 casos (3 por tipologia, G16 com 6 controles), cada um com título real.
- Dividir **ajuste** (2/3) e **validação** (1/3), sem misturar tipologia vista só no ajuste.
- Casos reais primeiro (G01, G04, G05 já têm candidatos no perfil); injetar só onde não houver caso natural.
- Manifesto `data/gabarito/gabarito.csv`: cenario_id, titulo_id, tipologia, nivel, acao_esperada, valor_em_risco, grupo, origem (real|injetado).
- Placar: R$ indevido que passaria − R$ retido corretamente, mais R$ 60 por acionamento desnecessário e atraso de legítimo, contra a linha de base "assinar o lote sem conferir".
- Não prometer "zero indevidos": mostrar acerto por tipologia e o que o agente deixou passar.
