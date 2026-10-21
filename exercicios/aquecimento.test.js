import test from 'node:test';
import assert from 'node:assert/strict';
import { filtrarPorNome, montarRequisicao, lerEntradas, ordenarPorData } from './aquecimento.js';
test('busca ignora caixa e espaços; vazio traz todos',()=>{
 const lista=[{nome:'Ana'},{nome:'Bruno'},{nome:'Mariana'}];
 assert.deepEqual(filtrarPorNome(lista,' ANA '),[lista[0],lista[2]]);
 assert.deepEqual(filtrarPorNome(lista,''),lista);
 assert.deepEqual(filtrarPorNome(lista,'zzz'),[]);
});
test('novo é POST com JSON; edição é PUT na URL com id',()=>{
 const dados={nome:'Ana',cpf:'111'};
 const novo=montarRequisicao('',dados);const edicao=montarRequisicao('7',dados);
 assert.equal(novo.url,'/api/tutores');assert.equal(novo.options.method,'POST');
 assert.equal(novo.options.headers['Content-Type'],'application/json');
 assert.deepEqual(JSON.parse(novo.options.body),dados);
 assert.equal(edicao.url,'/api/tutores/7');assert.equal(edicao.options.method,'PUT');
 assert.deepEqual(JSON.parse(edicao.options.body),dados);
});
test('não confunde params, query e body',()=>{
 assert.deepEqual(lerEntradas({params:{id:'7'},query:{busca:'ana'},body:{nome:'Bia'}}),{id:7,busca:'ana',nome:'Bia'});
 assert.equal(lerEntradas({params:{id:'1'},query:{},body:{nome:'X'}}).busca,'');
});
test('ordena sem modificar o original',()=>{
 const lista=[{data_agendamento:'2026-10-23'},{data_agendamento:'2026-10-21'}];
 const copia=structuredClone(lista);const resultado=ordenarPorData(lista);
 assert.equal(resultado[0].data_agendamento,'2026-10-21');assert.deepEqual(lista,copia);assert.notEqual(resultado,lista);
});
