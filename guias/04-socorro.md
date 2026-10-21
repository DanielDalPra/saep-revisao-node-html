# Travou? Diagnóstico em dois minutos

| Sintoma | Confira primeiro | Correção |
|---|---|---|
| npm não reconhecido | `node --version` | terminal/instalação do Node; nesta máquina já está instalado |
| npm não acha package.json | pasta atual | entre em saep-revisao-node-html ou sistema/ correto |
| npm.ps1 bloqueado | política do PowerShell | use `npm.cmd ci` e `npm.cmd start`, sem alterar política global |
| EADDRINUSE | outra aplicação na porta 3000 | Ctrl+C no servidor anterior; ou `$env:PORT='3001'` |
| Invalid initialization vector | algum IV foi alterado | AES-CBC exige 16 bytes; o IV original fornecido tem tamanho correto |
| bad decrypt | ciphertext/chave/IV não combinam | gere novamente dados com o utilitário correto; não mude chave após seed |
| password authentication failed | PGUSER/PGPASSWORD | ajuste credenciais locais; modo padrão PGlite dispensa isso |
| ECONNREFUSED 5432 | PostgreSQL parado/porta | inicie serviço ou use modo embarcado |
| relation does not exist | banco/tabela escolhidos | execute schema/seed no banco correto |
| req.body undefined | middleware/header/body | express.json + Content-Type + JSON.stringify |
| Cannot read properties of null | id HTML ou script cedo | conferir id exato e usar defer/module |
| Cannot set headers after sent | resposta dupla | `return res.status(...).json(...)` nas validações |
| Fetch 404 | prefixo da rota | app.use + caminho do router; confira método HTTP |
| Fetch 401 | sessão/cookie | faça login na mesma origem (host e porta) |
| CPF ilegível | resposta com cifra | descriptografar ao listar e em JOIN |
| Excluir retorna 409 | filhos com FK | teste tutor sem pet; informe vínculo ao usuário |
| Editar cria outro registro | id não foi guardado | preencha input hidden e use PUT |
| Próximo cadastro edita anterior | id ficou no form | limpar hidden após salvar/cancelar |
| Data aparece vazia | ISO completo no input date | enviar YYYY-MM-DD; no exemplo SQL usa ::text |
| Lista duplica a cada busca | tbody não é limpo | replaceChildren antes de renderizar |
| Clique recarrega página | submit padrão | preventDefault ou type=button |

Use DevTools → Network para olhar URL, método, status e resposta. Use terminal Node para erro do SQL. Se frontend está vazio mas API devolve JSON correto, investigue renderização. Se API falha, não perca tempo com CSS.

Não tente consertar SQL interpolando strings nem removendo middleware de autenticação. Localize o erro por camada.
