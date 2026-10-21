import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compararSenha, descriptografarCPF } from '../compartilhado/crypto.js';

for(const [tema,pessoas,filhos,eventos] of [['veterinaria','tutores','pets','agendamentos'],['oficina','clientes','veiculos','ordens_servico']]){
 test(tema+': SQL exportado cria/popula e dados persistem após reabrir banco',async()=>{
  const pasta=await mkdtemp(join(tmpdir(),'saep-teste-'));
  let db=new PGlite(pasta);
  try{
   const sql=await readFile(new URL('../sql/'+tema+'-completo.sql',import.meta.url),'utf8');
   await db.exec(sql);
   await db.close();db=new PGlite(pasta);
   for(const tabela of ['usuarios',pessoas,filhos,eventos]){
    const {rows}=await db.query('SELECT COUNT(*) AS total FROM '+tabela);
    assert.equal(Number(rows[0].total),3);
   }
   const users=await db.query("SELECT senha FROM usuarios WHERE login='admin'");
   assert.equal(await compararSenha('123456',users.rows[0].senha),true);
   const cpfs=await db.query('SELECT cpf FROM '+pessoas+' ORDER BY id');
   assert.equal(descriptografarCPF(cpfs.rows[0].cpf),'11111111111');
  }finally{
   await db.close();
   // Somente diretório recém-criado por mkdtemp, nunca um caminho de banco do usuário.
   await rm(pasta,{recursive:true,force:true});
  }
 });
}
