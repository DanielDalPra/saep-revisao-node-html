import test from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco } from '../compartilhado/banco.js';
import { criptografarCPF, descriptografarCPF } from '../compartilhado/crypto.js';

// Estes testes nunca usam o banco externo nem o diretório persistente do aluno.
delete process.env.DB_MODE;
const temas=[
 {tema:'veterinaria',pessoas:'tutores',filhos:'pets',campo:'nome',outro:'especie',fk:'tutor_id',eventos:'agendamentos',data:'data_agendamento',nome:'tutor_nome'},
 {tema:'oficina',pessoas:'clientes',filhos:'veiculos',campo:'placa',outro:'modelo',fk:'cliente_id',eventos:'ordens_servico',data:'data_abertura',nome:'cliente_nome'}
];
for(const t of temas) {
 test(t.tema+': fluxo HTTP completo com PostgreSQL embarcado real',async suite=>{
  const banco=await abrirBanco(t.tema,true);
  const {popular}=await import('../solucoes/'+t.tema+'/seed.js');
  const {criarApp}=await import('../solucoes/'+t.tema+'/app.js');
  await popular(banco.criarCliente);
  const app=criarApp(banco.criarCliente,1000);
  const servidor=app.listen(0,'127.0.0.1');
  await new Promise(resolve=>servidor.once('listening',resolve));
  const base='http://127.0.0.1:'+servidor.address().port;
  let cookie='';
  async function pedir(url,method='GET',body,autenticado=true){
   const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...(autenticado&&cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
   const novo=r.headers.get('set-cookie');if(novo&&autenticado)cookie=novo.split(';')[0];
   return {status:r.status,body:await r.json(),cookie:novo};
  }
  try {
   await suite.test('3 registros em todas as tabelas; seed pode rodar de novo',async()=>{
    await popular(banco.criarCliente);
    const client=banco.criarCliente();
    for(const tabela of ['usuarios',t.pessoas,t.filhos,t.eventos]){
     const r=await client.query('SELECT COUNT(*) AS total FROM '+tabela);
     assert.equal(Number(r.rows[0].total),3);
    }
   });
   await suite.test('sem sessão, dados protegidos; login inválido e campos ausentes',async()=>{
    assert.equal((await pedir('/api/'+t.pessoas)).status,401);
    assert.equal((await pedir('/api/'+t.filhos)).status,401);
    assert.equal((await pedir('/api/'+t.eventos)).status,401);
    assert.equal((await pedir('/api/auth/login','POST',{})).status,400);
    assert.equal((await pedir('/api/auth/login','POST',{login:'admin',senha:'errada'})).status,401);
   });
   await suite.test('login cria cookie e sessão sem divulgar senha',async()=>{
    const login=await pedir('/api/auth/login','POST',{login:'admin',senha:'123456'});
    assert.equal(login.status,200);assert.match(login.cookie,/HttpOnly/);
    const sessao=await pedir('/api/auth/sessao');assert.equal(sessao.body.usuario.nome,'Estudante 1');
    assert.equal(sessao.body.usuario.senha,undefined);
   });
   let id;
   await suite.test('busca parcial, vazia, inexistente e apóstrofo',async()=>{
    assert.equal((await pedir('/api/'+t.pessoas+'?busca=ANA')).body.length,1);
    assert.equal((await pedir('/api/'+t.pessoas+'?busca=')).body.length,3);
    assert.equal((await pedir('/api/'+t.pessoas+'?busca=zzzz')).body.length,0);
    assert.equal((await pedir('/api/'+t.pessoas+'?busca='+encodeURIComponent("' OR 1=1 --"))).body.length,0);
   });
   await suite.test('criar, validar campos e conferir CPF cifrado no banco',async()=>{
    assert.equal((await pedir('/api/'+t.pessoas,'POST',{nome:' '})).status,400);
    const novo=await pedir('/api/'+t.pessoas,'POST',{nome:'Teste',cpf:'12345678900',telefone:'49999999999'});
    assert.equal(novo.status,201);id=novo.body.id;
    const {rows}=await banco.criarCliente().query('SELECT cpf FROM '+t.pessoas+' WHERE id=$1',[id]);
    assert.notEqual(rows[0].cpf,'12345678900');assert.equal(descriptografarCPF(rows[0].cpf),'12345678900');
   });
   await suite.test('edição persiste; ID inexistente retorna 404',async()=>{
    assert.equal((await pedir('/api/'+t.pessoas+'/'+id,'PUT',{nome:'Editado',cpf:'99999999999'})).status,200);
    const lista=(await pedir('/api/'+t.pessoas+'?busca=Editado')).body;
    assert.equal(lista[0].id,id);assert.equal(lista[0].cpf,'99999999999');
    assert.equal((await pedir('/api/'+t.pessoas+'/99999','PUT',{nome:'X',cpf:'123'})).status,404);
   });
   await suite.test('exclusão sem vínculo e conflito com FK',async()=>{
    assert.equal((await pedir('/api/'+t.pessoas+'/'+id,'DELETE')).status,200);
    assert.equal((await pedir('/api/'+t.pessoas+'/'+id,'DELETE')).status,404);
    assert.equal((await pedir('/api/'+t.pessoas+'/1','DELETE')).status,409);
   });
   await suite.test('cadastro associado valida e persiste FK',async()=>{
    assert.equal((await pedir('/api/'+t.filhos,'POST',{[t.campo]:'Teste'})).status,400);
    assert.equal((await pedir('/api/'+t.filhos,'POST',{[t.campo]:'Teste',[t.fk]:999999})).status,409);
    const r=await pedir('/api/'+t.filhos,'POST',{[t.campo]:'Novo',[t.outro]:'Tipo',[t.fk]:1});
    assert.equal(r.status,201);assert.equal(r.body[t.fk],1);
    assert.equal((await pedir('/api/'+t.filhos)).body.length,4);
   });
   await suite.test('JOIN traz responsável/CPF e ordena cronologicamente',async()=>{
    const r=await pedir('/api/'+t.eventos);assert.equal(r.status,200);
    assert.deepEqual(r.body.map(x=>x[t.data]),['2026-10-21','2026-10-22','2026-10-23']);
    assert.equal(r.body[0][t.nome],'Bruno Souza');assert.equal(r.body[0].cpf,'22222222222');
   });
   await suite.test('data inválida rejeitada; data válida persiste e reordena',async()=>{
    assert.equal((await pedir('/api/'+t.eventos+'/1','PUT',{[t.data]:'2026-02-30'})).status,400);
    assert.equal((await pedir('/api/'+t.eventos+'/99999','PUT',{[t.data]:'2026-10-01'})).status,404);
    assert.equal((await pedir('/api/'+t.eventos+'/1','PUT',{[t.data]:'2026-10-01'})).status,200);
    assert.equal((await pedir('/api/'+t.eventos)).body[0].id,1);
   });
   await suite.test('logout invalida inclusive cookie anterior',async()=>{
    const antigo=cookie;
    assert.equal((await pedir('/api/auth/logout','POST')).status,200);cookie=antigo;
    assert.equal((await pedir('/api/auth/sessao')).status,401);
   });
   await suite.test('expiração é aplicada no servidor',async()=>{
    await pedir('/api/auth/login','POST',{login:'admin',senha:'123456'});
    await new Promise(resolve=>setTimeout(resolve,1150));
    assert.equal((await pedir('/api/'+t.pessoas)).status,401);
   });
   await suite.test('HTML e JS servidos sem CDN',async()=>{
    const html=await (await fetch(base)).text();
    assert.match(html,/lang="pt-BR"/);assert.match(html,/id="cadastro"/);
    assert.doesNotMatch(html,/https:\/\/cdn/);
    assert.equal((await fetch(base+'/app.js')).status,200);
   });
  } finally {
   await new Promise(resolve=>servidor.close(resolve));
   await banco.fechar();
  }
 });
}
test('CPF reversível e IV diferente a cada cifragem; IV do professor tem 16 bytes',()=>{
 const a=criptografarCPF('11111111111'),b=criptografarCPF('11111111111');
 assert.notEqual(a,b);assert.equal(descriptografarCPF(a),'11111111111');
 assert.equal(Buffer.byteLength('saep2026vetiv16b'),16);
});
