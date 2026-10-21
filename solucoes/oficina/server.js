import { abrirBanco } from '../../compartilhado/banco.js';
import { popular } from './seed.js';
import { criarApp } from './app.js';
const banco=await abrirBanco('oficina');
await popular(banco.criarCliente);
const porta=Number(process.env.PORT||3000);
const server=criarApp(banco.criarCliente).listen(porta,'127.0.0.1',()=>{
 console.log('Oficina mecânica: http://localhost:'+porta+' | admin / 123456');
 console.log('Banco: '+(process.env.DB_MODE==='postgres'?'PostgreSQL externo':'PGlite persistente em .dados/oficina'));
});
async function encerrar() { server.close(async()=>{await banco.fechar();process.exit(0);}); }
process.on('SIGINT',encerrar); process.on('SIGTERM',encerrar);
