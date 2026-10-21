import express from 'express';
import { verificarSessao, falha, idValido, dataValida } from '../../../compartilhado/http.js';
import { descriptografarCPF } from '../../../compartilhado/crypto.js';

export default function rotasRelacoes(criarCliente) {
 const router=express.Router();
 router.use(verificarSessao);
 router.get('/pets',async(req,res)=>{
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('SELECT * FROM pets ORDER BY id');
   res.json(resultado.rows);
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.post('/pets',async(req,res)=>{
  const { nome, especie, tutor_id }=req.body || {};
  if(typeof nome!=='string'||!nome.trim()||!idValido(tutor_id))
   return res.status(400).json({erro:'Preencha nome e selecione tutor.'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('INSERT INTO pets (nome,especie,tutor_id) VALUES ($1,$2,$3) RETURNING *',
    [nome.trim(),especie||null,tutor_id]);
   res.status(201).json(resultado.rows[0]);
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.get('/agendamentos',async(req,res)=>{
  const client=criarCliente();
  try {
   await client.connect();
   // Todos os campos das três tabelas, com aliases para evitar colisão de id/nome.
   // ::text devolve DATE como YYYY-MM-DD, sem conversão de fuso no navegador.
   const resultado=await client.query(`SELECT a.id,a.pet_id,a.data_agendamento::text AS data_agendamento,a.observacao,
    f.nome AS pet_nome,f.especie,f.tutor_id,
    p.nome AS tutor_nome,p.cpf,p.telefone
    FROM agendamentos a
    JOIN pets f ON f.id=a.pet_id
    JOIN tutores p ON p.id=f.tutor_id
    ORDER BY a.data_agendamento ASC,a.id ASC`);
   res.json(resultado.rows.map(a=>({...a,cpf:descriptografarCPF(a.cpf)})));
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.put('/agendamentos/:id',async(req,res)=>{
  const { data_agendamento }=req.body || {};
  if(!idValido(req.params.id)||!dataValida(data_agendamento))
   return res.status(400).json({erro:'Informe uma data válida (AAAA-MM-DD).'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('UPDATE agendamentos SET data_agendamento=$1 WHERE id=$2 RETURNING id,data_agendamento::text AS data_agendamento',
    [data_agendamento,req.params.id]);
   if(!resultado.rows.length) return res.status(404).json({erro:'Registro não encontrado.'});
   res.json(resultado.rows[0]);
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 return router;
}
