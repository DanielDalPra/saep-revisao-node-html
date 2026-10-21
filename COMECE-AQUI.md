# Seu roteiro: 150 minutos, mão no teclado

Escolha **veterinária como tema principal**. Oficina é transferência do mesmo padrão, não outro curso. Se estiverem estudando em dupla, alternem quem digita a cada bloco; quem observa explica a próxima linha. Fechem o gabarito durante a tentativa.

| Relógio | Min | Faça | Só avance sabendo… |
|---|---:|---|---|
| 00:00–00:10 | 10 | `npm ci`, `npm start`, login; crie e edite um tutor | localizar erro no terminal e no navegador |
| 00:10–00:25 | 15 | Leia guia 01 e resolva `aquecimento.js`; execute `npm run exercicios` | explicar `await`, `rows`, `body`, `params`, `query` |
| 00:25–00:45 | 20 | Abra `routes/auth.js` e o início de `public/app.js`; faça login errado, certo, recarregue, saia | distinguir cookie de sessão e dados da sessão |
| 00:45–01:20 | 35 | Faça exercícios 1–4: GET/busca, POST, PUT/DELETE, formulário | escrever um INSERT parametrizado e um fetch com JSON |
| 01:20–01:40 | 20 | Faça exercícios 5–6: pet vinculado e JOIN/data; mapeie para oficina | traçar agendamento → pet → tutor |
| 01:40–02:15 | 35 | Faça o [mini-simulado](exercicios/SIMULADO-35-MIN.md) sem gabarito | conectar backend + frontend, sem só ler |
| 02:15–02:25 | 10 | Confira SQL/DER e escreva 4 requisitos no modelo | lembrar as entregas de documentação |
| 02:25–02:30 | 5 | Responda revisão final de memória | saber sua ordem de ataque amanhã |
| **Total** | **150** | | |

Se perder 10 minutos em instalação, use os clones já baixados e leia o CRUD; não gaste 40 minutos reinstalando ferramentas. O material tem dependências já instaladas nesta máquina. Em instalação nova, `npm ci` precisa de internet.

## Regra de estudo

1. Tente por 5 minutos.
2. Leia apenas a dica do exercício.
3. Se continuar travado por 2 minutos, consulte a função equivalente na solução.
4. Feche a solução e reescreva a função de memória.
5. Teste pelo navegador e confirme no banco ou ao recarregar a tela.

## Por que esta prioridade?

As listas fornecidas somam **38 pontos de peso**, não necessariamente a nota oficial. Tutor/cliente soma 13; login + principal somam 10; agendamento/ordem, 5; pet/veículo, 3; documentação + SQL, 7. Portanto, **CRUD, busca e sessão** são o núcleo. Layout bonito vem depois de dados persistidos e ações funcionando.

Na base, boa parte do login, middleware e estrutura HTML já existe. O logout ainda está vazio, apesar do comentário inicial de `auth.js` dizer que a rota está pronta. Leia o código, não apenas o cabeçalho.

## Se só restarem 45 minutos

10 min: POST + fetch. 10 min: PUT + id escondido e DELETE. 10 min: busca ILIKE e JOIN. 10 min: sessão/logout e formulário. 5 min: checklist de entregas. Execute pelo menos um cadastro completo e uma edição sem olhar a resposta.
