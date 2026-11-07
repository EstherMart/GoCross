# ENTREGA · evidências

Saída de `npm run avaliar` em 07/11/2026, 14:50, sem cache de IA (IA_CACHE desligado), depois de: tentativa única na IA, fatias de 24 títulos, busca de remessa na home.

```
G01: 3/3
G03: 4/4
G04: 3/3
G05: 1/1
G16: 5/5
grupo ajuste: 8/8
grupo validacao: 8/8
Falsos positivos G16: 0
Placar: -R$ 0.00
Agenda: 876 títulos; código 855, IA 21
Júri: derrubou 3/3 ações plantadas
IA: 146 chamadas, 59194+6772 tok, US$ 0.002443, 114341 ms, 12 falhas
```

Leitura:
- Gabarito 16/16 (ajuste 8/8 + validação 8/8) e 0 falso positivo nos controles G16.
- 855 de 876 títulos decididos por código; a IA entra só em 21 (ambíguos).
- 12 chamadas de IA sem resposta em 7 s: o motor falhou fechado (retirou, não liberou) e o gabarito se manteve.
- Custo de IA do lote inteiro da semana: US$ 0,0024.

Tempo de abertura do lote (build de produção, IA_CACHE=1, cache aquecido, após reiniciar o servidor):
RM20261112-MER 1033 ms · RM20261109-MER 348 ms · RM20261103-MER 382 ms. Sem cache, a 1ª abertura de um lote MER levou de 6 a 22 s.

Não rodados: G09, G02, G14 (fora da fatia).
