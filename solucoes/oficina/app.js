import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'node:url';
import auth from './routes/auth.js';
import pessoas from './routes/clientes.js';
import relacoes from './routes/relacoes.js';

export function criarApp(criarCliente, duracao=15*60*1000) {
 const app=express();
 app.use(express.json());
 app.use(session({secret:process.env.SESSION_SECRET||'sessao-exclusiva-de-estudo',resave:false,saveUninitialized:false,
  cookie:{maxAge:duracao,httpOnly:true,sameSite:'lax'}}));
 app.use('/api/auth',auth(criarCliente));
 app.use('/api/clientes',pessoas(criarCliente));
 app.use('/api',relacoes(criarCliente));
 app.use(express.static(fileURLToPath(new URL('./public',import.meta.url))));
 app.use((erro,req,res,next)=>res.status(erro.status===400?400:500).json({erro:'Requisição inválida.'}));
 return app;
}
