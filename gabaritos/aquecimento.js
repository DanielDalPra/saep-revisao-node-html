export function filtrarPorNome(pessoas, termo) {
 const busca=termo.trim().toLowerCase();
 return pessoas.filter(p=>p.nome.toLowerCase().includes(busca));
}
export function montarRequisicao(id,dados) {
 return {url:'/api/tutores'+(id?'/'+id:''),options:{method:id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dados)}};
}
export function lerEntradas(req) {
 return {id:Number(req.params.id),busca:req.query.busca||'',nome:req.body.nome};
}
export function ordenarPorData(registros) {
 return [...registros].sort((a,b)=>a.data_agendamento.localeCompare(b.data_agendamento));
}
