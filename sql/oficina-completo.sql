-- SOMENTE BANCO NOVO E VAZIO. Dados fictícios. Login admin / 123456.
-- CPF compatível com compartilhado/crypto.js e CPF_SECRET usado na geração.
BEGIN;
-- Execute em banco NOVO de estudo. Não apaga tabelas existentes.
CREATE TABLE IF NOT EXISTS usuarios (
 id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL,
 login VARCHAR(50) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS clientes (
 id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL,
 cpf VARCHAR(255) NOT NULL, telefone VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS veiculos (
 id SERIAL PRIMARY KEY, placa VARCHAR(100) NOT NULL,
 modelo VARCHAR(50), cliente_id INTEGER NOT NULL REFERENCES clientes(id)
);
CREATE TABLE IF NOT EXISTS ordens_servico (
 id SERIAL PRIMARY KEY, veiculo_id INTEGER NOT NULL REFERENCES veiculos(id),
 data_abertura DATE NOT NULL, descricao VARCHAR(255)
);

INSERT INTO usuarios (nome,login,senha) VALUES ('Estudante 1','admin','$2b$10$.VURKAOMpgDoN4rp5niFrOgzi6AIjxPO0/ow1jJq8q4rC.0bPtpKu');
INSERT INTO clientes (nome,cpf,telefone) VALUES ('Ana Silva','c9bdf02084fd2e80e4268a5f0f016963:0933b5265591fcbc611d6d3597b98e1c','49999990001');
INSERT INTO veiculos (placa,modelo,cliente_id) VALUES ('ABC1D21','Tipo 1',1);
INSERT INTO ordens_servico (veiculo_id,data_abertura,descricao) VALUES (1,'2026-10-21','Atendimento de estudo 1');
INSERT INTO usuarios (nome,login,senha) VALUES ('Estudante 2','aluno2','$2b$10$QXSD5UIHz0torqc.ai86xernqfA.pV5gwwyi7wsEAise32qrQjt5K');
INSERT INTO clientes (nome,cpf,telefone) VALUES ('Bruno Souza','7d4cf3b9c1bdc39cec732a8fb63a8122:f042852b031b56b7266d5f3b2d5f33e1','49999990002');
INSERT INTO veiculos (placa,modelo,cliente_id) VALUES ('ABC1D22','Tipo 2',2);
INSERT INTO ordens_servico (veiculo_id,data_abertura,descricao) VALUES (2,'2026-10-22','Atendimento de estudo 2');
INSERT INTO usuarios (nome,login,senha) VALUES ('Estudante 3','aluno3','$2b$10$raJiOyfPfkSaxG38kVLOo.brP.i9J45R9lvxok56GtJKhBAwk4mT.');
INSERT INTO clientes (nome,cpf,telefone) VALUES ('Carla Lima','f4f3ce019ef32b6bb856065874cf1d56:7b9a13f33719aa0949c16126e730a58a','49999990003');
INSERT INTO veiculos (placa,modelo,cliente_id) VALUES ('ABC1D23','Tipo 3',3);
INSERT INTO ordens_servico (veiculo_id,data_abertura,descricao) VALUES (3,'2026-10-23','Atendimento de estudo 3');
COMMIT;
