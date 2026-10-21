// Complete sem abrir gabaritos/aquecimento.js. Estas funções são puras.
export function filtrarPorNome(pessoas, termo) {
  // Retorne pessoas cujo nome inclui o termo, ignorando maiúsculas e espaços externos do termo.
  throw new Error('TODO 1: filter + toLowerCase + trim');
}
export function montarRequisicao(id, dados) {
  // Retorne {url, options}; id vazio => POST /api/tutores; preenchido => PUT /api/tutores/:id.
  // options precisa de method, headers Content-Type e body JSON.stringify(dados).
  throw new Error('TODO 2: POST ou PUT');
}
export function lerEntradas(req) {
  // Retorne {id: número, busca: string, nome: string}; busca ausente vira ''.
  throw new Error('TODO 3: params, query, body');
}
export function ordenarPorData(registros) {
  // Retorne NOVO array crescente por data_agendamento (strings YYYY-MM-DD), sem alterar original.
  throw new Error('TODO 4: copiar antes de sort');
}
