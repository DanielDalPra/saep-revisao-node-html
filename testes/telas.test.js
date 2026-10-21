import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { abrirBanco } from '../compartilhado/banco.js';

delete process.env.DB_MODE;
for(const [tema,pessoas,filhos,campo,outro,fk] of [
 ['veterinaria','tutores','pets','nome','especie','tutor_id'],
 ['oficina','clientes','veiculos','placa','modelo','cliente_id']
]){
 test(tema+': DOM do frontend com API real (sem renderização visual)',async()=>{
  const banco=await abrirBanco(tema,true);
  const {popular}=await import('../solucoes/'+tema+'/seed.js');
  const {criarApp}=await import('../solucoes/'+tema+'/app.js');
  await popular(banco.criarCliente);
  const server=criarApp(banco.criarCliente).listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  const base='http://127.0.0.1:'+server.address().port;
  const html=await readFile(new URL('../solucoes/'+tema+'/public/index.html',import.meta.url),'utf8');
  const js=await readFile(new URL('../solucoes/'+tema+'/public/app.js',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:base,runScripts:'outside-only'});
  const w=dom.window, $=id=>w.document.getElementById(id);
  let cookie='';
  w.fetch=async(url,options={})=>{
   const resposta=await fetch(new URL(url,base),{...options,headers:{...options.headers,...(cookie?{Cookie:cookie}:{})}});
   const recebido=resposta.headers.get('set-cookie');if(recebido)cookie=recebido.split(';')[0];
   return resposta;
  };
  w.confirm=()=>true;
  async function esperar(condicao){
   const inicio=Date.now();while(!condicao()){
    if(Date.now()-inicio>5000)throw new Error('Estado não atingido. Mensagem: '+$('mensagem').textContent);
    await new Promise(r=>setTimeout(r,20));
   }
  }
  const submit=id=>$(id).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  try{
   w.eval(js);
   await esperar(()=>$('mensagem').textContent.includes('login'));
   $('login').elements.login.value='admin';$('login').elements.senha.value='123456';submit('login');
   await esperar(()=>$('mensagem').textContent==='Login realizado.');
   assert.equal($('sistema').hidden,false);assert.equal($('nome-usuario').textContent,'Estudante 1');
   assert.equal($('lista').children.length,3);
   const form=$('cadastro');form.elements.nome.value='<img src=x onerror=alert(1)>';
   form.elements.cpf.value='12345678900';submit('cadastro');
   await esperar(()=>$('mensagem').textContent==='Salvo no banco.');
   assert.equal($('lista').children.length,4);assert.equal($('lista').querySelector('img'),null);
   const linha=$('lista').lastElementChild;linha.querySelector('button').click();
   form.elements.nome.value='Teste editado';submit('cadastro');
   await esperar(()=>$('lista').textContent.includes('Teste editado'));
   assert.equal(form.elements.id.value,'');
   $('busca').elements.termo.value='inexistente';submit('busca');
   await esperar(()=>$('lista').textContent.includes('Nenhum registro'));
   $('busca').elements.termo.value='Teste editado';submit('busca');
   await esperar(()=>$('lista').textContent.includes('Teste editado'));
   const botoes=$('lista').querySelectorAll('button');botoes[1].click();
   await esperar(()=>$('mensagem').textContent==='Registro excluído.');
   assert.equal($('lista').children.length,3);
   const filho=$('cadastro-filho');filho.elements[campo].value='Novo teste';filho.elements[outro].value='Tipo';filho.elements[fk].value='1';submit('cadastro-filho');
   await esperar(()=>$('mensagem').textContent==='Cadastro vinculado salvo.');
   assert.equal($('lista-filhos').children.length,4);
   const ultima=$('lista-eventos').lastElementChild;ultima.querySelector('input').value='2026-01-01';ultima.querySelector('button').click();
   await esperar(()=>$('mensagem').textContent==='Data atualizada e lista reordenada.');
   assert.equal($('lista-eventos').querySelector('input').value,'2026-01-01');
   $('sair').click();await esperar(()=>$('mensagem').textContent==='Você saiu.');
   assert.equal($('sistema').hidden,true);assert.equal($('entrada').hidden,false);
  }finally{dom.window.close();await new Promise(r=>server.close(r));await banco.fechar();}
 });
}
