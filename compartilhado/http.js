export function verificarSessao(req, res, next) {
  if (!req.session.usuario) return res.status(401).json({ erro: 'Faça login novamente.' });
  next();
}
export function falha(res, erro) {
  if (erro.code === '23503') return res.status(409).json({ erro: 'Vínculo inválido ou registro ainda possui dependentes.' });
  if (['22007', '22008', '22P02', '22001'].includes(erro.code)) return res.status(400).json({ erro: 'Confira os dados e a data informados.' });
  console.error(erro.message);
  return res.status(500).json({ erro: 'Falha no banco. Veja o terminal.' });
}
export function idValido(id) { return /^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id)); }
export function dataValida(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const d = new Date(data + 'T12:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === data;
}
