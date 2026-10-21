-- SOMENTE BANCO NOVO E VAZIO. Dados fictícios. Login admin / 123456.
-- CPF compatível com compartilhado/crypto.js e CPF_SECRET usado na geração.
BEGIN;
-- Execute em banco NOVO de estudo. Não apaga tabelas existentes.
CREATE TABLE IF NOT EXISTS usuarios (
 id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL,
 login VARCHAR(50) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS tutores (
 id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL,
 cpf VARCHAR(255) NOT NULL, telefone VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS pets (
 id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL,
 especie VARCHAR(50), tutor_id INTEGER NOT NULL REFERENCES tutores(id)
);
CREATE TABLE IF NOT EXISTS agendamentos (
 id SERIAL PRIMARY KEY, pet_id INTEGER NOT NULL REFERENCES pets(id),
 data_agendamento DATE NOT NULL, observacao VARCHAR(255)
);

INSERT INTO usuarios (nome,login,senha) VALUES ('Estudante 1','admin','$2b$10$3AbSLNdwSpGDL4FHa7Yr6uKVD5vK9OuJyOAvFlNj0LcDApZg5iORq');
INSERT INTO tutores (nome,cpf,telefone) VALUES ('Ana Silva','58280178a5adf780d80a600aaea70d71:23d679b9b0280b55d44135506d8d31c9','49999990001');
INSERT INTO pets (nome,especie,tutor_id) VALUES ('Pet 1','Tipo 1',1);
INSERT INTO agendamentos (pet_id,data_agendamento,observacao) VALUES (1,'2026-10-21','Atendimento de estudo 1');
INSERT INTO usuarios (nome,login,senha) VALUES ('Estudante 2','aluno2','$2b$10$Mov2aD/vp7x3KcjcILxmVOcoUpkOI.UJX3cYDr3cfEUDAMILCGc4e');
INSERT INTO tutores (nome,cpf,telefone) VALUES ('Bruno Souza','280c39654766e0ace02a4e95b5c90af2:ff1e39c99b62f8ee0a0dc012520e19bd','49999990002');
INSERT INTO pets (nome,especie,tutor_id) VALUES ('Pet 2','Tipo 2',2);
INSERT INTO agendamentos (pet_id,data_agendamento,observacao) VALUES (2,'2026-10-22','Atendimento de estudo 2');
INSERT INTO usuarios (nome,login,senha) VALUES ('Estudante 3','aluno3','$2b$10$CDpD1sXO.h3hZ3D1P68I0O6CqBwR9QrcQ1u.dZQ3CWFKe4TtgtvZK');
INSERT INTO tutores (nome,cpf,telefone) VALUES ('Carla Lima','5958f2cbaa7ff1ec418f81fa622c17ec:2ce9937ec8dc7102d31459f67f622a13','49999990003');
INSERT INTO pets (nome,especie,tutor_id) VALUES ('Pet 3','Tipo 3',3);
INSERT INTO agendamentos (pet_id,data_agendamento,observacao) VALUES (3,'2026-10-23','Atendimento de estudo 3');
COMMIT;
