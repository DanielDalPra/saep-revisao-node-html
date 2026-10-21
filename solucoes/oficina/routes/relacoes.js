import express from 'express';
import { verificarSessao, falha, idValido, dataValida } from '../../../compartilhado/http.js';
import { descriptografarCPF } from '../../../compartilhado/crypto.js';

export default function rotasRelacoes(criarCliente) {
 const router=express.Router();
 router.use(verificarSessao);
 router.get('/veiculos',async(req,res)=>{
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('SELECT * FROM veiculos ORDER BY id');
   res.json(resultado.rows);
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.post('/veiculos',async(req,res)=>{
  const { placa, modelo, cliente_id }=req.body || {};
  if(typeof placa!=='string'||!placa.trim()||!idValido(cliente_id))
   return res.status(400).json({erro:'Preencha placa e selecione cliente.'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('INSERT INTO veiculos (placa,modelo,cliente_id) VALUES ($1,$2,$3) RETURNING *',
    [placa.trim(),modelo||null,cliente_id]);
   res.status(201).json(resultado.rows[0]);
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.get('/ordens_servico',async(req,res)=>{
  const client=criarCliente();
  try {
   await client.connect();
   // Todos os campos das três tabelas, com aliases para evitar colisão de id/nome.
   // ::text devolve DATE como YYYY-MM-DD, sem conversão de fuso no navegador.
   const resultado=await client.query(`SELECT a.id,a.veiculo_id,a.data_abertura::text AS data_abertura,a.descricao,
    f.placa AS veiculo_placa,f.modelo,f.cliente_id,
    p.nome AS cliente_nome,p.cpf,p.telefone
    FROM ordens_servico a
    JOIN veiculos f ON f.id=a.veiculo_id
    JOIN clientes p ON p.id=f.cliente_id
    ORDER BY a.data_abertura ASC,a.id ASC`);
   res.json(resultado.rows.map(a=>({...a,cpf:descriptografarCPF(a.cpf)})));
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.put('/ordens_servico/:id',async(req,res)=>{
  const { data_abertura }=req.body || {};
  if(!idValido(req.params.id)||!dataValida(data_abertura))
   return res.status(400).json({erro:'Informe uma data válida (AAAA-MM-DD).'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('UPDATE ordens_servico SET data_abertura=$1 WHERE id=$2 RETURNING id,data_abertura::text AS data_abertura',
    [data_abertura,req.params.id]);
   if(!resultado.rows.length) return res.status(404).json({erro:'Registro não encontrado.'});
   res.json(resultado.rows[0]);
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 return router;
}
