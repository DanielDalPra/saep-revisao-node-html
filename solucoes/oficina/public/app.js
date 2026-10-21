const $=id=>document.getElementById(id);
const mensagem=texto=>{$('mensagem').textContent=texto;};

// fetch só rejeita automaticamente em falha de rede. HTTP 400/401/500 exige conferir ok.
async function api(url,method='GET',dados) {
 const resposta=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:dados===undefined?undefined:JSON.stringify(dados)});
 const json=await resposta.json();
 if(resposta.status===401) { $('sistema').hidden=true; $('entrada').hidden=false; }
 if(!resposta.ok) throw new Error(json.erro||'Falha na requisição.');
 return json;
}
function acao(fn) { return async evento=>{evento?.preventDefault();try{await fn(evento);}catch(erro){mensagem(erro.message);}}; }
function celula(linha,texto) { const td=document.createElement('td');td.textContent=texto??'';linha.append(td);return td; }
function botao(texto,fn) { const b=document.createElement('button');b.type='button';b.textContent=texto;b.addEventListener('click',acao(fn));return b; }
function dadosForm(form) { return Object.fromEntries(new FormData(form)); }

$('login').addEventListener('submit',acao(async()=>{
 await api('/api/auth/login','POST',dadosForm($('login')));
 $('login').reset(); await entrar();mensagem('Login realizado.');
}));
$('sair').addEventListener('click',acao(async()=>{
 await api('/api/auth/logout','POST');$('sistema').hidden=true;$('entrada').hidden=false;mensagem('Você saiu.');
}));
async function entrar() {
 const sessao=await api('/api/auth/sessao');
 $('nome-usuario').textContent=sessao.usuario.nome;
 $('entrada').hidden=true;$('sistema').hidden=false;
 await carregarPessoas();await carregarFilhos();await carregarEventos();
}
async function carregarPessoas(termo='') {
 const pessoas=await api('/api/clientes?busca='+encodeURIComponent(termo));
 $('lista').replaceChildren();
 if(!pessoas.length) { const tr=document.createElement('tr');celula(tr,'Nenhum registro encontrado.').colSpan=5;$('lista').append(tr); }
 for(const pessoa of pessoas) {
  const tr=document.createElement('tr');
  for(const campo of ['id','nome','cpf','telefone']) celula(tr,pessoa[campo]);
  const acoes=celula(tr,'');
  acoes.append(botao('Editar',()=>{
   for(const campo of ['id','nome','cpf','telefone']) $('cadastro').elements[campo].value=pessoa[campo]??'';
   $('cadastro').elements.nome.focus();mensagem('Editando ID '+pessoa.id);
  }),botao('Excluir',async()=>{
   if(!confirm('Excluir '+pessoa.nome+'?'))return;
   await api('/api/clientes/'+pessoa.id,'DELETE');await carregarPessoas();mensagem('Registro excluído.');
  }));
  $('lista').append(tr);
 }
 // Select usa todos os responsáveis, independentemente do filtro da tabela.
 const todos=termo?await api('/api/clientes'):pessoas;
 $('responsavel').replaceChildren(new Option('Selecione…',''));
 for(const p of todos) $('responsavel').append(new Option(p.nome,p.id));
}
$('busca').addEventListener('submit',acao(()=>carregarPessoas($('busca').elements.termo.value.trim())));
$('cancelar').addEventListener('click',()=>{$('cadastro').reset();$('cadastro').elements.id.value='';mensagem('Novo cadastro.');});
$('cadastro').addEventListener('submit',acao(async()=>{
 const dados=dadosForm($('cadastro'));const id=dados.id;delete dados.id;
 await api('/api/clientes'+(id?'/'+id:''),id?'PUT':'POST',dados);
 $('cadastro').reset();$('cadastro').elements.id.value='';
 await carregarPessoas();await carregarEventos();mensagem('Salvo no banco.');
}));
async function carregarFilhos(){
 const filhos=await api('/api/veiculos');$('lista-filhos').replaceChildren();
 for(const f of filhos){const li=document.createElement('li');li.textContent=f.id+' · '+f.placa+' · cliente ID '+f.cliente_id;$('lista-filhos').append(li);}
}
$('cadastro-filho').addEventListener('submit',acao(async()=>{
 const dados=dadosForm($('cadastro-filho'));dados.cliente_id=Number(dados.cliente_id);
 await api('/api/veiculos','POST',dados);$('cadastro-filho').reset();await carregarFilhos();mensagem('Cadastro vinculado salvo.');
}));
async function carregarEventos(){
 const eventos=await api('/api/ordens_servico');$('lista-eventos').replaceChildren();
 for(const a of eventos){
  const tr=document.createElement('tr');
  for(const campo of ['id','veiculo_placa','modelo','cliente_nome','cpf','telefone','descricao'])celula(tr,a[campo]);
  const td=celula(tr,'');const input=document.createElement('input');input.type='date';input.value=a.data_abertura;input.setAttribute('aria-label','Data do registro '+a.id);
  td.append(input,botao('Salvar data',async()=>{
   await api('/api/ordens_servico/'+a.id,'PUT',{data_abertura:input.value});await carregarEventos();mensagem('Data atualizada e lista reordenada.');
  }));$('lista-eventos').append(tr);
 }
}
// Reabrir a página recupera a sessão, se ainda estiver válida.
entrar().catch(erro=>mensagem(erro.message));
