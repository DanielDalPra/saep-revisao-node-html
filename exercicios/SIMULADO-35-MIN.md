# Mini-simulado de 35 minutos, sem consulta à solução

Treino de recuperação de memória, não simulação das 3 horas completas. Use a base do professor e seus TODOs. Se não conseguiu preparar o banco original, use uma cópia da solução local, apague o corpo das funções indicadas abaixo e reconstrua; mantenha conexão, seed e autenticação.

**Desafio:** uma clínica quer buscar tutores, cadastrar novos tutores, vincular pets e remarcar uma consulta. Você recebeu conexão, sessão, banco e estrutura de páginas.

| Tempo | Tarefa | Evidência |
|---|---|---|
| 0–5 | GET/busca tutores | buscar trecho do nome funciona |
| 5–15 | POST + submit | cadastro persiste e aparece na tabela |
| 15–22 | PUT + editar | mesmo id com nome atualizado |
| 22–28 | POST pet com tutor | FK do responsável correto |
| 28–33 | JOIN + ORDER BY ou PUT de data | listagem ordenada ou remarcação persistida |
| 33–35 | Testar e anotar erro | diga exatamente onde travou |

Na cópia da solução local, funções alvo: GET/POST/PUT em `routes/tutores.js`; submit de `cadastro` em `public/app.js`; POST de `/pets` e GET/PUT de `/agendamentos` em `routes/relacoes.js`.

## Rubrica de treino (10 pontos, não oficial)

* 2: busca funciona e usa parâmetro SQL.
* 2: POST persiste e retorna 201.
* 2: formulário envia JSON e trata erro.
* 1: PUT usa id correto sem alterar todos os registros.
* 1: pet tem tutor válido.
* 1: JOIN/ordenação ou atualização de data funciona.
* 1: explica body/params/query sem consultar.

Se fez 7 ou mais, corrija o que faltou e revise documentação. Se fez menos, refaça apenas POST → fetch → tabela antes de tentar mais funcionalidades. Não compense falta de fluxo com CSS.

**Transferência oral para oficina (sem tempo extra):** tutor vira cliente, pet vira veículo, nome do pet vira placa, espécie vira modelo, agendamento vira ordem de serviço, data_agendamento vira data_abertura. Diga quais FKs e quais URLs precisam mudar.
