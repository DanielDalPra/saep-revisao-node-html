# Um cadastro, do clique ao banco

Leia esta sequência e depois tente escrevê-la sem consultar.

```html
<form id="form-tutor">
  <label>Nome <input id="nome" required></label>
  <label>CPF <input id="cpf" required></label>
  <button type="submit">Salvar</button>
</form>
<p id="mensagem" role="status"></p>
<script src="tutores.js" defer></script>
```

`defer` espera o HTML ser analisado. Sem isso, um script no head pode tentar encontrar elementos que ainda não existem. Dentro de form, botão sem type é submit: use `type="button"` em cancelar/editar/excluir.

```js
document.getElementById('form-tutor').addEventListener('submit', async evento => {
  evento.preventDefault(); // evita recarregar a página antes do fetch terminar
  try {
    const dados = {
      nome: document.getElementById('nome').value.trim(),
      cpf: document.getElementById('cpf').value.trim()
    };
    const resposta = await fetch('/api/tutores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const json = await resposta.json();
    if (!resposta.ok) throw new Error(json.erro);
    document.getElementById('mensagem').textContent = 'Salvo: ' + json.nome;
    // Em tela com listagem: limpe o form e chame carregarTutores().
  } catch (erro) {
    document.getElementById('mensagem').textContent = erro.message;
  }
});
```

O Express recebe o body, valida, criptografa CPF, executa SQL e devolve JSON. Veja a função `router.post` da [solução](../solucoes/veterinaria/routes/tutores.js).

```js
const resultado = await client.query(
  'INSERT INTO tutores (nome, cpf, telefone) VALUES ($1,$2,$3) RETURNING *',
  [nome, criptografarCPF(cpf), telefone]
);
res.status(201).json(resultado.rows[0]);
```

`$1` = primeiro valor, `$2` = segundo. Não concatene nome/CPF no SQL. `RETURNING *` devolve o registro criado, incluindo o id gerado. Para exibir CPF na resposta real, descriptografe ou retorne o texto recebido; a solução faz isso.

## A tabela é só uma representação dos dados

```js
const tr = document.createElement('tr');
const td = document.createElement('td');
td.textContent = tutor.nome; // texto do usuário não vira HTML
tr.append(td);
document.querySelector('tbody').append(tr);
```

Ao recarregar a listagem, limpe antes (`replaceChildren()`). Se usar `innerHTML` com nomes digitados, eles podem virar marcação executável; os exemplos usam `textContent`.

## O CRUD muda só alguns pontos

| Ação | HTTP | SQL | Onde está o ID? |
|---|---|---|---|
| Listar/buscar | GET | SELECT ... WHERE nome ILIKE $1 | não precisa |
| Criar | POST | INSERT ... RETURNING * | banco gera |
| Editar | PUT /:id | UPDATE ... WHERE id=$4 RETURNING * | req.params.id |
| Excluir | DELETE /:id | DELETE ... WHERE id=$1 RETURNING id | req.params.id |

Na edição, preencha os campos **e o id escondido**. Ao salvar: id vazio → POST; preenchido → PUT. Ao cancelar ou concluir, limpe o id. Se esquecer, o próximo cadastro pode sobrescrever o anterior.

## Sessão em uma frase por etapa

1. Backend verifica senha com `compararSenha(senha, hash)`.
2. Backend salva `{ id, nome, login }` em `req.session.usuario`.
3. Navegador recebe cookie com identificador de sessão, não a senha.
4. Em mesma origem, o fetch envia esse cookie automaticamente.
5. Middleware verifica sessão; sem usuário, devolve 401.
6. Front consulta `/api/auth/sessao` para mostrar nome.
7. Logout chama POST e `req.session.destroy`; esconder a tela sozinho não encerra sessão.

`maxAge: 15 * 60 * 1000` é em milissegundos. A configuração sem `rolling:true` não promete renovação a cada leitura. A sessão em memória também acaba ao reiniciar o servidor.
