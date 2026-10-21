import express from 'express';
import { criptografarCPF, descriptografarCPF } from '../../../compartilhado/crypto.js';
import { verificarSessao, falha, idValido } from '../../../compartilhado/http.js';

export default function rotasPessoas(criarCliente) {
 const router=express.Router();
 router.use(verificarSessao);
 // req.query: ?busca=ana. $1 recebe o primeiro item do array de valores.
 router.get('/',async(req,res)=>{
  const client=criarCliente();
  try {
   await client.connect();
   const busca=typeof req.query.busca==='string'?req.query.busca.trim():'';
   const resultado=await client.query('SELECT * FROM clientes WHERE nome ILIKE $1 ORDER BY id',['%'+busca+'%']);
   res.json(resultado.rows.map(p=>({...p,cpf:descriptografarCPF(p.cpf)})));
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.post('/',async(req,res)=>{
  // req.body: conteúdo JSON enviado pelo formulário.
  const {nome,cpf,telefone}=req.body || {};
  if(typeof nome!=='string'||!nome.trim()||typeof cpf!=='string'||!cpf.trim())
   return res.status(400).json({erro:'Nome e CPF são obrigatórios.'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('INSERT INTO clientes (nome,cpf,telefone) VALUES ($1,$2,$3) RETURNING *',
    [nome.trim(),criptografarCPF(cpf.trim()),telefone||null]);
   res.status(201).json({...resultado.rows[0],cpf:cpf.trim()});
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.put('/:id',async(req,res)=>{
  // req.params: trecho variável da URL, por exemplo /api/clientes/4.
  const {id}=req.params;
  const {nome,cpf,telefone}=req.body || {};
  if(!idValido(id)||typeof nome!=='string'||!nome.trim()||typeof cpf!=='string'||!cpf.trim())
   return res.status(400).json({erro:'Confira ID, nome e CPF.'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('UPDATE clientes SET nome=$1,cpf=$2,telefone=$3 WHERE id=$4 RETURNING *',
    [nome.trim(),criptografarCPF(cpf.trim()),telefone||null,id]);
   if(!resultado.rows.length) return res.status(404).json({erro:'Registro não encontrado.'});
   res.json({...resultado.rows[0],cpf:cpf.trim()});
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.delete('/:id',async(req,res)=>{
  if(!idValido(req.params.id)) return res.status(400).json({erro:'ID inválido.'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('DELETE FROM clientes WHERE id=$1 RETURNING id',[req.params.id]);
   if(!resultado.rows.length) return res.status(404).json({erro:'Registro não encontrado.'});
   res.json({mensagem:'Excluído.'});
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 return router;
}
