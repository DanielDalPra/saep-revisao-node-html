# Gabaritos e justificativas

Leia depois de tentar. As soluções são implementações independentes, não respostas oficiais do professor.

| Exercício | Resposta executável |
|---|---|
| 0 | [aquecimento.js](aquecimento.js); `npm run gabarito` |
| 1, 2 e 3 — SQL/rotas | [routes/tutores.js](../solucoes/veterinaria/routes/tutores.js) |
| 1, 2 e 3 — navegador | [public/app.js](../solucoes/veterinaria/public/app.js): carregarPessoas, submit de cadastro |
| 4 — sessão/logout | [routes/auth.js](../solucoes/veterinaria/routes/auth.js) e entrar/sair no frontend |
| 5 e 6 — vínculos/data | [routes/relacoes.js](../solucoes/veterinaria/routes/relacoes.js) |
| Mesmo padrão na oficina | [solução oficina](../solucoes/oficina/) |

## As decisões que você precisa explicar

* **Busca:** `ILIKE` ignora maiúsculas. `%termo%` encontra trecho em qualquer posição. `$1` separa o dado do comando SQL.
* **CPF:** criptografa ao inserir E editar. Descriptografa ao listar, incluindo listagem com JOIN. Não use o ciphertext como novo CPF durante edição.
* **Senha:** `bcrypt.compare` verifica texto contra hash; não se descriptografa senha nem se compara dois hashes recém-gerados como strings.
* **PUT:** `WHERE id=...` é essencial. Sem WHERE, altera a tabela inteira.
* **DELETE:** FK pode impedir exclusão. O código devolve 409 para dependência; para demonstrar exclusão, crie tutor sem pets e exclua esse tutor.
* **404:** ID inexistente não é edição bem-sucedida. Verifique se `rows` veio vazia.
* **Pet:** select manda `tutor_id`, não nome. O banco garante FK; a rota valida ausência e formato.
* **JOIN:** agendamento não tem tutor_id: chegue ao tutor através do pet. Use aliases para não perder um `nome`/`id` por colisão.
* **Data:** usar `DATE::text` entrega `YYYY-MM-DD`; evita converter meia-noite entre fusos.
* **Frontend:** `response.ok` não é a mesma coisa que a Promise do fetch ter sido resolvida.

## Respostas da revisão final

1. Body = dados enviados; params = id na URL; query = busca após `?`.
2. `JSON.stringify` converte objeto em texto JSON; header informa o formato.
3. Array de objetos: `resultado.rows`.
4. id escondido determina POST/PUT e precisa ser limpo ao concluir/cancelar.
5. `WHERE id=$n` restringe registro.
6. `$1` recebe primeiro parâmetro; não vai entre aspas no SQL.
7. 401 = sessão/autenticação; frontend retorna à entrada.
8. Sessão mora no servidor; browser leva cookie identificador.
9. Senha = hash; CPF = cifra reversível.
10. `agendamentos.pet_id → pets.id`, `pets.tutor_id → tutores.id`.
11. `ORDER BY data_agendamento ASC` ordena cronologicamente.
12. FK impede excluir tutor com pet; informe conflito, não apague em cascata sem requisito.
