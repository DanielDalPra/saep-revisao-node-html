import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

// bcryptjs preserva a API e o formato bcrypt, sem compilação nativa no Windows.
export const hashSenha = senha => bcrypt.hash(senha, 10);
export const compararSenha = (senha, hash) => bcrypt.compare(senha, hash);
const chave = crypto.scryptSync(process.env.CPF_SECRET || 'chave-apenas-do-laboratorio-saep', 'saep-estudo', 32);

// Senha usa hash; CPF precisa ser recuperado, portanto usa criptografia reversível.
// IV aleatório de 16 bytes. Ele acompanha o texto cifrado; não é a chave.
export function criptografarCPF(cpf) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', chave, iv);
  const texto = Buffer.concat([cipher.update(cpf, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + texto.toString('hex');
}
export function descriptografarCPF(valor) {
  const [iv, texto] = valor.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', chave, Buffer.from(iv, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(texto, 'hex')), decipher.final()]).toString('utf8');
}
