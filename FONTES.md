# Fontes, leitura da base e diferenças do laboratório

Materiais consultados em 21/10/2026:

* [Oficina mecânica](https://github.com/micheltartas/simulado-oficina-mecanica), commit `cc4824744b7327eceeacbc90f093e98b581b0f53`.
* [Veterinária](https://github.com/micheltartas/repositorio-base-saep-veterinaria), commit `e5c938dfc98aa071423df6a71f7f804dd76b4f12`.

Lidos: cadernos, listas de verificação, guias de desenvolvimento, SQL, rotas, frontend e utilitários. A divisão de prioridades vem das listas dos repositórios, não de uma promessa sobre a prova de amanhã. Os clones foram preservados; este material tem implementação própria.

## Criptografia original e formato do laboratório

Nos dois repositórios, o IV `saep2026vetiv16b` tem **16 bytes**, tamanho correto para AES-CBC. A contagem foi confirmada por execução. Não é necessário alterar esse IV para estudar com a base original. Uma suspeita inicial de tamanho incorreto foi descartada nos testes.

Na base, use `criptografarCPF` e `descriptografarCPF` de `sistema/utils/crypto-utils.js` com o SQL correspondente. Senha usa bcrypt e não é descriptografada. O logout em `routes/auth.js` ainda contém TODO, apesar do comentário inicial dizer que a rota está pronta.

Neste laboratório cada cifra guarda `iv:ciphertext`, com IV aleatório de 16 bytes; `seed.js` e `sql:gerar` usam o MESMO módulo. A chave padrão é apenas didática. Não copie os CPFs criptografados do professor para o banco deste laboratório: os formatos e chaves diferem. Se mudar a chave do seu treino, regenere seus dados de teste com a mesma chave.

## Outras diferenças intencionais

* `bcryptjs` em vez de `bcrypt`: mesma finalidade/API básica e hashes compatíveis; evita compilação nativa no Windows.
* PGlite no modo rápido; `pg.Client` no modo PostgreSQL externo. SQL é PostgreSQL nos dois.
* HTML/CSS local, sem Bootstrap via CDN, para revisão offline.
* Uma página por tema no laboratório; várias páginas na base.
* Funções de criação de app/rotas recebem a conexão para permitir testes isolados. Na base, `criarCliente` é importado de config/db.js; o corpo connect/query/end é o mesmo padrão.
* API de ordens do laboratório é `/api/ordens_servico`; a original registra `/api/ordens`.
* O laboratório inclui GET de pets/veículos para conferir cadastro; requisito central é inserir associado.
* MemoryStore, credenciais de teste e chave didática são adequados ao laboratório local, não a deploy público.

## Correspondência das listas fornecidas

Documentação: 4; SQL: 3; login: 6; principal: 4; tutor/cliente: 13; pet/veículo: 3; agendamento/ordem: 5. Total dos pesos: 38. Essa soma é um auxílio para priorizar estudo; o formato de nota da avaliação não foi verificado.
