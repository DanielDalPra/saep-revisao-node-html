# Reativar a memória de Node em 15 minutos

JavaScript roda no navegador e no Node, mas com objetos diferentes. `document` existe no navegador. `req`, `res`, `client.query` e acesso ao banco ficam no servidor. Você não importa `pg` no JavaScript da página.

```js
const tutor = { id: 7, nome: 'Ana', cpf: '11111111111' };
const { nome, cpf } = tutor;           // desestruturação
const editado = { ...tutor, nome: 'Bia' }; // cópia com um campo alterado
const nomes = [tutor, editado].map(p => p.nome); // ['Ana', 'Bia']
const encontrados = [tutor, editado].filter(p => p.nome.includes('A'));
```

`map` transforma cada item. `filter` mantém itens. `find` devolve um item ou `undefined`. `.value` de input/select é string: `Number(select.value)` converte o ID.

```js
async function carregar() {
  try {
    const resposta = await fetch('/api/tutores');
    if (!resposta.ok) throw new Error('Erro HTTP ' + resposta.status);
    const tutores = await resposta.json();
    console.log(tutores);
  } catch (erro) {
    console.error(erro.message);
  }
}
```

Uma função `async` devolve Promise. `await` espera seu resultado antes da próxima linha dentro daquela função. `resposta.json()` também é assíncrono. `fetch` não transforma HTTP 404/500 em exceção automaticamente.

## Três lugares diferentes no Express

| Requisição | De onde ler | Valor |
|---|---|---|
| `GET /api/tutores?busca=ana` | `req.query.busca` | `'ana'` |
| `PUT /api/tutores/7` | `req.params.id` | `'7'` |
| Body JSON `{ "nome": "Ana" }` | `req.body.nome` | `'Ana'` |

`express.json()` precisa estar registrado antes das rotas para interpretar JSON. No navegador, envie `Content-Type: application/json` e `JSON.stringify(dados)`.

```js
app.use('/api/tutores', tutorRoutes); // em app.js
router.get('/', handler);             // em routes/tutores.js
// URL final: /api/tutores, não /api/tutores/api/tutores
```

## SQL retorna um objeto, não só uma lista

```js
const resultado = await client.query('SELECT * FROM tutores WHERE id=$1', [7]);
console.log(resultado.rows);    // array de registros
console.log(resultado.rows[0]); // primeiro registro ou undefined
res.json(resultado.rows);      // responde uma vez
```

`return res.status(400).json(...)` responde **e encerra a função**. Sem `return`, o código pode continuar e tentar responder duas vezes. `finally` roda mesmo após `return` e fecha a conexão.

## Módulos

`"type": "module"` no package.json permite `import`/`export`. Nos imports locais use `.js`: `import rotas from './routes/tutores.js'`. Rode o comando na pasta que tem `package.json`. Pare servidor com Ctrl+C.

Agora implemente [aquecimento.js](../exercicios/aquecimento.js). Não precisa de servidor para os testes.
