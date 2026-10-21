import { readFile } from 'node:fs/promises';
import { hashSenha, criptografarCPF } from '../../compartilhado/crypto.js';

export async function popular(criarCliente) {
 const client = criarCliente();
 await client.connect();
 try {
  // Transação evita banco parcialmente populado em caso de falha.
  await client.query('BEGIN');
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  for (const sql of schema.split(';').filter(s => s.trim())) await client.query(sql);
  const { rows } = await client.query('SELECT COUNT(*) AS total FROM usuarios');
  if (Number(rows[0].total) === 0) {
   for (let i=1; i<=3; i++) {
    await client.query('INSERT INTO usuarios (nome,login,senha) VALUES ($1,$2,$3)',
     ['Estudante '+i, i===1?'admin':'aluno'+i, await hashSenha('123456')]);
    const pessoa = await client.query('INSERT INTO tutores (nome,cpf,telefone) VALUES ($1,$2,$3) RETURNING id',
     [['Ana Silva','Bruno Souza','Carla Lima'][i-1], criptografarCPF(String(i).repeat(11)), '4999999000'+i]);
    const filho = await client.query('INSERT INTO pets (nome,especie,tutor_id) VALUES ($1,$2,$3) RETURNING id',
     ['Rex'+i,'Cachorro',pessoa.rows[0].id]);
    await client.query('INSERT INTO agendamentos (pet_id,data_agendamento,observacao) VALUES ($1,$2,$3)',
     [filho.rows[0].id, ['2026-10-23','2026-10-21','2026-10-22'][i-1], 'Atendimento de estudo '+i]);
   }
  }
  await client.query('COMMIT');
 } catch(erro) { await client.query('ROLLBACK'); throw erro; }
 finally { await client.end(); }
}
