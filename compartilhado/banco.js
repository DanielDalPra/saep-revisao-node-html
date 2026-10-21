import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// Adaptação apenas para estudar sem instalar/configurar um servidor.
// As rotas continuam usando connect/query/end e SQL PostgreSQL igual à base.
export async function abrirBanco(tema, memoria = false) {
  if (process.env.DB_MODE === 'postgres') {
    return { criarCliente: () => new pg.Client(), fechar: async () => {} };
  }
  const pasta = resolve('.dados', tema);
  if (!memoria) await mkdir(pasta, { recursive: true });
  const banco = new PGlite(memoria ? undefined : pasta);
  await banco.waitReady;
  return {
    criarCliente: () => ({ connect: async () => {}, query: (sql, params) => banco.query(sql, params), end: async () => {} }),
    fechar: () => banco.close()
  };
}
