# Validação realizada em 21/10/2026

Ambiente: Windows, Node.js 24.18.0, npm 11.16.0. Dependências fixadas em package-lock.json. Use Node 24.15.0 ou superior da linha 24 para reproduzir este ambiente; os testes de DOM usam jsdom com esse requisito.

## Resultados

* `npm test`: **33 testes aprovados, zero falhas**.
* `npm run gabarito`: **4 testes aprovados, zero falhas**.
* Verificação `node --check`: 25 arquivos JavaScript sem erros de sintaxe.
* SQL exportado dos dois temas importado em PostgreSQL embarcado, com 3 registros por tabela. Banco fechado e reaberto para confirmar persistência.
* Hash da senha `123456` e os seis CPFs fictícios nos SQLs originais conferidos com bcrypt e o algoritmo/chave/IV fornecidos pelo professor. Todos compatíveis; IV tem 16 bytes.

## O que os testes exercitam

Login válido/inválido; campos obrigatórios; cookie e usuário da sessão; GET sem autenticação; busca parcial, vazia, inexistente e com apóstrofo; INSERT/UPDATE/DELETE; 404; conflito de FK; CPF cifrado no armazenamento; associação de pet/veículo; JOIN e ordenação; data inválida e válida; logout; expiração no servidor.

As duas telas foram exercitadas em DOM simulado (jsdom), chamando as APIs reais: login, renderização, cadastrar, editar, buscar, excluir, cadastrar filho vinculado, remarcar data e sair. Um nome contendo marcação HTML permanece texto, sem virar elemento.

## Limites

Não foi feita inspeção visual por screenshot em navegador. Os testes DOM validam comportamento e elementos, não aparência pixel a pixel. O modo PostgreSQL externo com `pg.Client` está implementado, mas não foi executado: o PostgreSQL instalado não pôde iniciar no ambiente isolado (erro de token restrito do Windows). Os testes SQL usaram PGlite, que executa PostgreSQL embarcado.

`npm run exercicios` começa falhando de propósito: os TODOs precisam ser resolvidos pelo estudante. Isso é independente dos testes das soluções.
