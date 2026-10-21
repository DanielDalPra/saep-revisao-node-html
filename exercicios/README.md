# Exercícios: tente antes de abrir o gabarito

## 0. Aquecimento (15 min)

Complete as quatro funções em `aquecimento.js`. Rode `npm run exercicios`. Os testes devem falhar no início por design. Não altere os testes para fazê-los passar.

## 1. Listar e buscar (8 min)

Na base clonada do professor, abra `sistema/routes/tutores.js`. Implemente GET que usa `req.query.busca`, `ILIKE` parametrizado e descriptografa o CPF. No frontend, busque a URL e mostre tabela; trate 401.

**Aceite:** buscar `ana` também encontra `Ana`; termo inexistente mostra estado vazio; apagar termo volta à lista completa. Teste apóstrofo no termo sem quebrar SQL.

**Dica:** valor do parâmetro é `'%' + busca + '%'`; não escreva `ILIKE '$1'`.

## 2. Inserir (9 min)

Implemente POST que exige nome e CPF, salva CPF cifrado e devolve 201. Complete submit do formulário com `preventDefault`, JSON e recarregamento da lista.

**Aceite:** cadastro válido aparece; recarregar a página mantém cadastro; nome vazio recebe 400; no banco, CPF não está em texto puro.

**Dica:** o banco gera id; `RETURNING *` devolve o registro. `required` ajuda, mas backend também valida.

## 3. Editar e excluir (10 min)

Complete PUT e DELETE por id. Faça editar preencher o formulário e salvar usando PUT. Excluir deve confirmar a intenção e atualizar a lista.

**Aceite:** edição preserva id; novo cadastro depois de edição cria outro id; excluir tutor sem pet funciona; tutor com pet recebe erro compreensível, sem apagar pet silenciosamente.

**Dica:** se o SELECT retornou array, use `.rows[0]` para um registro; ausência deve resultar em 404. FK bloqueia exclusão de pai com dependentes.

## 4. Sessão e HTML (8 min)

Mostre nome do usuário em `principal.js`, complete logout em `routes/auth.js` e conecte o botão Sair. Acrescente `label` associado a input e feedback textual se houver erro.

**Aceite:** login errado mostra mensagem; certo mostra nome; após logout GET protegido responde 401; formulário não recarrega a página inesperadamente.

**Dica:** no frontend o nome vem de `json.usuario.nome`; `req.session` só existe no backend.

## 5. Pet com tutor (8 min)

Complete POST de pets e submit. O select deve enviar id do tutor, não o nome. Exija nome e tutor_id.

**Aceite:** pet cadastrado tem FK do tutor escolhido; sem tutor não salva; tutor inexistente não cria vínculo inválido.

## 6. JOIN e alteração de data (12 min)

Escreva SELECT ligando agendamentos → pets → tutores, devolvendo os campos necessários sem colisão de nomes e ordenando por data. Complete PUT para alterar apenas `data_agendamento` e botão Salvar.

**Aceite:** aparecem pet e tutor corretos; data editada persiste; a lista reordena; valor do input date é `YYYY-MM-DD`; data impossível é rejeitada.

**Dica:** dois JOINs, aliases nos nomes e `ORDER BY`. Evite `SELECT *` de três tabelas com `id` e `nome` repetidos.

Para estes exercícios 1–6, use os clones originais como área de prática. Se quiser manter sua própria cópia intacta, copie `sistema/` para uma pasta de treino (sem node_modules). O laboratório completo é a referência de correção, não a área obrigatória de edição. Use o utilitário e o SQL correspondentes da própria base; não misture com os dados cifrados deste laboratório.
