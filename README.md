# SAEP amanhã: revisão prática de Node + HTML em 2h30

**Comece aqui.** O objetivo é voltar a escrever o fluxo completo: formulário → fetch → rota Express → SQL → JSON → tela. Material de estudo independente, preparado a partir dos dois repositórios indicados do professor Michel Tartas. Não é previsão nem garantia do conteúdo da avaliação.

## Rodar agora — 3 comandos

Requisito: Node.js 24.15.0 ou superior da linha 24 (validado com Node 24.18.0). No terminal, dentro desta pasta:

```powershell
npm ci
npm start
```

Abra **http://localhost:3000**. Login: **admin**, senha: **123456**. O primeiro início cria 3 registros em cada tabela. Depois disso, os dados ficam salvos em `.dados/veterinaria`.

Para oficina: pare o servidor com `Ctrl+C` e rode `npm run oficina`, na mesma URL. O banco de oficina é separado. Nada depende de CDN. Instale antes de ficar sem internet; depois, código, documentação, banco embarcado e testes funcionam localmente.

**Se você só tem 150 minutos, não leia tudo. Siga [COMECE-AQUI.md](COMECE-AQUI.md).**

## O que abrir e em que ordem

| Material | Para quê |
|---|---|
| [Roteiro de 150 minutos](COMECE-AQUI.md) | Estudar com tempo e critérios de saída |
| [Reativação de JavaScript/Node](guias/01-reativar-node.md) | Relembrar async/await, objetos, arrays, módulos, req/res |
| [Fluxo de um CRUD explicado](guias/02-crud-passo-a-passo.md) | Entender cada parte antes de repetir |
| [Exercícios](exercicios/README.md) | Tentar sem olhar resposta |
| [Mini-simulado](exercicios/SIMULADO-35-MIN.md) | Treinar na cópia intacta da base do professor |
| [Gabaritos](gabaritos/README.md) | Conferir depois de tentar |
| [SQL, documentação e DER](guias/03-sql-documentacao.md) | Não esquecer entregas fora do código |
| [Erros comuns](guias/04-socorro.md) | Destravar em até 2 minutos |
| [Revisão final](guias/05-revisao-final.md) | Recuperar de memória e conferir entrega |
| [Fontes e problemas encontrados](FONTES.md) | Saber de onde veio cada prioridade |
| [Como foi validado](VALIDACAO.md) | Diferenciar testado de não testado |

## Duas soluções completas, legíveis

* `solucoes/veterinaria/`: tutores → pets → agendamentos.
* `solucoes/oficina/`: clientes → veículos → ordens de serviço.
* Cada uma tem `app.js`, `routes/`, `public/`, `schema.sql` e `seed.js`.
* `compartilhado/`: conexão, criptografia e validação. As rotas mantêm `connect/query/end`, `$1` e `resultado.rows`, como o professor.
* `exercicios/`: código propositalmente incompleto; `gabaritos/`: respostas separadas.

Os exemplos completos são **referência**, não substituem tentar os TODOs da base. As páginas foram concentradas numa tela para enxergar o fluxo; na base do professor são páginas separadas. A oficina registra o endpoint `/api/ordens_servico` neste laboratório; na base original, veja `/api/ordens`. Não troque nomes às cegas.

## Comandos úteis

```powershell
npm test                 # Testa as duas soluções (banco isolado em memória)
npm run exercicios       # Começa VERMELHO: resolva exercicios/aquecimento.js
npm run gabarito         # Mesmos casos com a resposta pronta
npm run sql:gerar        # Gera SQL completo com 3 registros/tabela em sql/
```

Não é necessário passar os exercícios para executar as soluções. `npm test` não apaga seu banco de estudo.

## PostgreSQL tradicional, igual à prova

O padrão usa **PGlite**, um PostgreSQL embarcado, para não gastar o estudo configurando servidor. Ele executa SQL de verdade e persiste em disco; não é um array que simula banco. Para usar o servidor PostgreSQL instalado, crie um banco vazio só para este laboratório. No PowerShell:

```powershell
$env:DB_MODE='postgres'
$env:PGHOST='localhost'
$env:PGPORT='5432'
$env:PGUSER='postgres'
$env:PGPASSWORD='SUA_SENHA_LOCAL'
$env:PGDATABASE='saep_estudo_veterinaria'
npm start
```

O app cria tabelas e popula se `usuarios` estiver vazia. Não aponte para banco de outro projeto. Para oficina, use OUTRO banco, como `saep_estudo_oficina`. Para retornar ao banco embarcado: `Remove-Item Env:DB_MODE` e reinicie. O `.env.example` é apenas modelo; não é carregado automaticamente por `npm start`.

Material local de treino: MemoryStore de sessão, senha de demonstração e chave padrão não são configuração de produção. CPF de treino não é validado pelos dígitos verificadores. O foco é persistência, associação e uso correto da criptografia fornecida.

## Originais clonados

No computador onde este material foi preparado, as duas pastas irmãs preservam os clones originais. Nenhum arquivo do professor foi alterado. Em outro computador:

```powershell
git clone https://github.com/micheltartas/simulado-oficina-mecanica.git
git clone https://github.com/micheltartas/repositorio-base-saep-veterinaria.git
```

Os originais contêm TODOs de propósito. Leia [FONTES.md](FONTES.md) para entender as diferenças do laboratório e os utilitários já fornecidos.

