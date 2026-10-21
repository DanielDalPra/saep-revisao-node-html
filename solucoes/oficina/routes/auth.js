import express from 'express';
import { compararSenha } from '../../../compartilhado/crypto.js';
import { verificarSessao, falha } from '../../../compartilhado/http.js';

export default function rotasAuth(criarCliente) {
 const router = express.Router();
 router.post('/login', async (req,res) => {
  const { login, senha } = req.body || {};
  if (typeof login !== 'string' || typeof senha !== 'string' || !login.trim() || !senha)
   return res.status(400).json({erro:'Informe login e senha.'});
  const client=criarCliente();
  try {
   await client.connect();
   const resultado=await client.query('SELECT * FROM usuarios WHERE login=$1',[login]);
   const usuario=resultado.rows[0];
   if (!usuario || !await compararSenha(senha,usuario.senha))
    return res.status(401).json({erro:'Usuário ou senha inválidos.'});
   // Regenera o identificador ao autenticar e salva somente os dados necessários.
   req.session.regenerate(erro => {
    if (erro) return res.status(500).json({erro:'Não foi possível criar a sessão.'});
    req.session.usuario={id:usuario.id,nome:usuario.nome,login:usuario.login};
    res.json({usuario:req.session.usuario});
   });
  } catch(erro) { falha(res,erro); } finally { await client.end(); }
 });
 router.get('/sessao', verificarSessao, (req,res)=>res.json({usuario:req.session.usuario}));
 router.post('/logout', (req,res)=>{
  req.session.destroy(erro=>{
   if(erro) return res.status(500).json({erro:'Não foi possível sair.'});
   res.clearCookie('connect.sid');
   res.json({mensagem:'Sessão encerrada.'});
  });
 });
 return router;
}
