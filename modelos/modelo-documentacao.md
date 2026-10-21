# Documentação de software — modelo para preencher

Estudante: ____________________  Tema: ____________________

## Objetivo

Gerenciar tutores, pets e agendamentos de uma clínica veterinária, com autenticação e persistência de dados. Adapte para oficina conforme o enunciado.

## Requisitos funcionais

| Código | Requisito | Como verificar |
|---|---|---|
| RF01 | Autenticar usuário cadastrado e informar credenciais inválidas | testar senha correta e incorreta |
| RF02 | Manter sessão com expiração e permitir logout | acessar API após logout e aguardar expiração |
| RF03 | Exibir nome autenticado e navegação para os módulos | conferir página principal |
| RF04 | Cadastrar, listar, buscar, editar e excluir tutor | testar cada ação e persistência |
| RF05 | Cadastrar pet associado a tutor existente | consultar FK do pet criado |
| RF06 | Listar agendamentos por data com dados do pet e tutor | conferir JOIN e ordem |
| RF07 | Atualizar data de agendamento existente | remarcar e recarregar |
| RF08 | Armazenar senha em hash e CPF criptografado | inspecionar valores no banco |

## Infraestrutura

Linguagem: JavaScript. Backend: Node.js e Express. Frontend: HTML5, CSS e JavaScript no navegador. Banco: PostgreSQL. Driver: pg. Sessão: express-session. Bibliotecas de segurança: bcrypt da base e crypto do Node. Informe as versões realmente disponíveis na avaliação; este laboratório usa bcryptjs e PGlite no modo rápido.

## Modelo de dados

Tutores 1:N Pets; Pets 1:N Agendamentos. Usuários é tabela de autenticação. Anexe DER exportado em imagem/PDF.

## Evidências e entrega

SQL com 3 registros em cada tabela; código em sistema/; documentação.pdf; DER em imagem/PDF. Compactar diretório com nome completo conforme instruções do avaliador. Não inclua senhas pessoais ou .env real.
