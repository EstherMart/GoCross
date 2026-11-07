# IDEIAS · desafio de pagamentos

Notas 1–5 (Impacto / Esforço em 5h, 1 pessoa). Esforço alto é ruim. Baseado nos nomes dos arquivos; confirmar com dicionário.

| # | Ideia | I | E |
|---|-------|---|---|
| 1 | Um agente que confere cada título do lote contra NF, pedido e recebimento (3-way match) para que o analista libere só o que bate. | 5 | 3 |
| 2 | Um agente que detecta pagamento em duplicidade (fornecedor, valor, NF, boleto) antes da remessa, para que o analista não pague duas vezes. | 5 | 2 |
| 3 | Um agente que sinaliza valor fora do padrão (zero a mais) comparando com pedido, contrato e histórico, para que o analista corrija antes de pagar. | 5 | 2 |
| 4 | Um agente que valida alteração de conta bancária de fornecedor (alteracoes_cadastro, log, comunicações) para que a controladoria evite fraude. | 5 | 3 |
| 5 | **Um agente que classifica cada título em liberar / aprovar / bloquear, citando a política, para que o analista revise só o que importa.** (usa 1–4 como sinais) | 5 | 3 |
| 6 | Um agente que concilia retorno da remessa e extratos com o contas a pagar para achar pagamentos rejeitados ou sem baixa. | 4 | 3 |
| 7 | Um agente que cruza boletos do DDA com o contas a pagar para que o analista não pague boleto sem NF ou com valor diferente. | 4 | 3 |
| 8 | Um agente que audita segregação de funções (quem cadastrou também aprovou) para a controladoria. | 4 | 3 |
| 9 | Um agente que redige a mensagem ao fornecedor sobre a pendência de cada título bloqueado. | 3 | 2 |
| 10 | Um agente que lê a NF e pré-preenche o cadastro nos sistemas, eliminando digitação. | 4 | 5 |

## Pre-mortem das 3 melhores
**#5 Classificar liberar/aprovar/bloquear**
- Vira "só regras if/else" e a banca pergunta onde está a IA. → A IA lê a política em texto, decide casos ambíguos e justifica citando a regra; o verificador checa a citação.
- Muitos falsos positivos: tudo vai para "aprovar". → Medir falsos positivos e ajustar limiares com os casos de ajuste.
- Volume não cabe no contexto. → Código faz os cruzamentos; IA vê só o recorte de cada título e só os casos limítrofes.

**#2 Duplicidade**
- Duplicado de verdade é difícil (NF reemitida, valor com centavos diferentes). → Chave aproximada e caso de validação específico.
- Parece só um filtro de planilha. → Resolve como sinal dentro de #5, não como produto isolado.

**#4 Conta alterada**
- Dados podem não ter fraude evidente. → Verificar em alteracoes_cadastro na 1ª hora; se não houver, rebaixar para sinal.
- Sensível: exige justificativa clara para não acusar fornecedor. → Saída "aprovar" com motivo, nunca "fraude".

## Recomendação
**#5**, com os sinais de #1–#4 e as ideias 6–9 como PODERIA. Uma narrativa para a banca: "o erro é pego antes de o dinheiro sair, e o sistema diz o que segue sozinho e o que precisa de aprovação" (os dois últimos pontos do desafio).

## Outros desafios simulados (além dos do site)
- Pagamento agendado em feriado bancário ou fim de semana (feriados_bancarios, agenda_remessa): atraso, multa.
- Fracionamento para ficar abaixo da alçada (vários títulos pequenos do mesmo fornecedor no mesmo dia).
- NF cancelada ou substituída ainda no contas a pagar.
- Pagamento sem recebimento de mercadoria ou com quantidade diferente.
- Preço ou condição diferente do contrato vigente ou vencido.
- Remessa rejeitada pelo banco sem reprocesso (retorno_remessa).
- Mesma pessoa cadastra, altera e aprova (log_auditoria, aprovacoes).
- Fornecedor duplicado no cadastro com CNPJ formatado de jeito diferente.
- Centro de custo ou conta contábil inválida para o tipo de despesa.
- Dados sensíveis (CNPJ, conta bancária) em repositório público: não commitar `data/` sem conferir.
