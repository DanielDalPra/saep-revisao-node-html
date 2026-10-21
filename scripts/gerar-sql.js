import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { hashSenha, criptografarCPF } from '../compartilhado/crypto.js';
const temas=[
 {tema:'veterinaria',pessoas:'tutores',filhos:'pets',campo:'nome',outro:'especie',fk:'tutor_id',eventos:'agendamentos',filho:'pet_id',data:'data_agendamento',descricao:'observacao'},
 {tema:'oficina',pessoas:'clientes',filhos:'veiculos',campo:'placa',outro:'modelo',fk:'cliente_id',eventos:'ordens_servico',filho:'veiculo_id',data:'data_abertura',descricao:'descricao'}
];
const literal=valor=>"'"+String(valor).replaceAll("'","''")+"'";
await mkdir(new URL('../sql/',import.meta.url),{recursive:true});
for(const t of temas){
 const schema=await readFile(new URL('../solucoes/'+t.tema+'/schema.sql',import.meta.url),'utf8');
 let sql='-- SOMENTE BANCO NOVO E VAZIO. Dados fictícios. Login admin / 123456.\n-- CPF compatível com compartilhado/crypto.js e CPF_SECRET usado na geração.\nBEGIN;\n'+schema+'\n';
 for(let i=1;i<=3;i++){
  const login=i===1?'admin':'aluno'+i;
  sql+=`INSERT INTO usuarios (nome,login,senha) VALUES (${literal('Estudante '+i)},${literal(login)},${literal(await hashSenha('123456'))});\n`;
  sql+=`INSERT INTO ${t.pessoas} (nome,cpf,telefone) VALUES (${literal(['Ana Silva','Bruno Souza','Carla Lima'][i-1])},${literal(criptografarCPF(String(i).repeat(11)))},'4999999000${i}');\n`;
  sql+=`INSERT INTO ${t.filhos} (${t.campo},${t.outro},${t.fk}) VALUES ('${t.tema==='oficina'?'ABC1D2':'Pet '}${i}','Tipo ${i}',${i});\n`;
  sql+=`INSERT INTO ${t.eventos} (${t.filho},${t.data},${t.descricao}) VALUES (${i},'2026-10-${20+i}','Atendimento de estudo ${i}');\n`;
 }
 sql+='COMMIT;\n';
 await writeFile(new URL('../sql/'+t.tema+'-completo.sql',import.meta.url),sql);
 console.log('Gerado sql/'+t.tema+'-completo.sql');
}
