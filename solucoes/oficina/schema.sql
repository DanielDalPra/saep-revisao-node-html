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
