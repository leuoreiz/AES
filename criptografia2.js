const crypto = require('crypto');

// Algoritmo de cifragem escolhido: AES com chave de 256 bits no modo CBC
const ALGORITHM = 'aes-256-cbc';

// Tamanho do IV e do Salt em bytes (128 bits = 16 bytes)
const IV_SIZE = 16;

// ─────────────────────────────────────────────
// deriveKey: transforma uma senha (texto) em uma chave binária de 256 bits
// Por quê? O AES precisa de uma chave com exatamente 32 bytes — não dá pra usar a senha direta
// PBKDF2 faz isso de forma segura, aplicando SHA-256 por 100.000 iterações
// O salt garante que a mesma senha gere chaves diferentes em cada cifragem
// ─────────────────────────────────────────────
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')
}

// ─────────────────────────────────────────────
// encrypt: cifra um texto usando AES-256-CBC
// Recebe: texto em claro + senha do usuário
// Retorna: string base64 contendo [salt(16)] + [IV(16)] + [ciphertext]
// ─────────────────────────────────────────────
function encrypt(text, password) {
  // Gera um salt aleatório — garante que a mesma senha produza chaves diferentes
  const salt = crypto.randomBytes(IV_SIZE);

  // Deriva a chave de 256 bits a partir da senha + salt
  const key = deriveKey(password, salt);

  // Gera um IV aleatório — garante que o mesmo texto produza ciphertexts diferentes
  IV = crypto.randomBytes(IV_SIZE);

  // Cria o objeto de cifragem com o algoritmo, chave e IV
  cipher = crypto.createCipheriv(ALGORITHM, key, IV);

  // Cifra o texto: update() processa o texto, final() fecha e aplica o padding
  chipherfinal = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')

  // Converte o ciphertext de hex para Buffer binário
  const encryptedBuffer = Buffer.from(chipherfinal, 'hex');

  // Concatena tudo: [salt][IV][ciphertext] — necessário para poder decifrar depois
  const juntos = Buffer.concat([salt, IV, encryptedBuffer]);

  // Converte para base64 para facilitar armazenamento em arquivo texto
  const result = Buffer.from(juntos).toString('base64');
  return result;
  // 1. Gere um IV aleatório           → crypto.randomBytes(IV_SIZE)
  // 2. Crie o cipher                  → crypto.createCipheriv(...)
  // 3. Cifre o texto                  → cipher.update(...) + cipher.final()
  // 4. Junte IV  string base6+ texto cifrado
  // 5. Retorne como4
}

// ─────────────────────────────────────────────
// decrypt: decifra um dado cifrado pelo encrypt()
// Recebe: string base64 (com salt + IV + ciphertext) + senha
// Retorna: texto original em claro
// ─────────────────────────────────────────────
function decrypt(encryptedData, password) {
  // Decodifica o base64 de volta para Buffer binário
  const buffer = Buffer.from(encryptedData, 'base64');

  // Extrai o salt dos primeiros 16 bytes
  const salt = buffer.subarray(0, 16);

  // Extrai o IV dos próximos 16 bytes
  const iv = buffer.subarray(16, 32);

  // O resto é o ciphertext
  const ciphertext = buffer.subarray(32);

  // Reconstrói a mesma chave usando a senha + salt extraído
  const key = deriveKey(password, salt);

  // Cria o objeto de decifragem com algoritmo, chave e IV
  decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  // Decifra: update() processa o ciphertext, final() remove o padding e fecha
  const decifrado = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return decifrado;
  // 2. Separe os primeiros 16 bytes (IV) do resto (texto cifrado)
  // 3. Crie o decipher                → crypto.createDecipheriv(...)
  // 4. Decifre e retorne o texto
}// 1. Decodifique o base64


const fs = require('fs');



// ─────────────────────────────────────────────
// cifrarArquivo: lê um arquivo, cifra e salva com extensão .cifrado
// (função incompleta — esqueleto para o aluno implementar)
// ─────────────────────────────────────────────
function cifrarArquivo(caminhoArquivo, senha) {
    const leitura = fs.readFileSync(caminhoArquivo, 'utf8');
    const cifracao = encrypt(leitura, senha);
    fs.writeFileSync(caminhoArquivo + '.cifrado', cifracao);
    // 1. ler o conteúdo do arquivo
    // 2. cifrar usando encrypt()
    // 3. salvar em caminhoArquivo + '.cifrado'
  }


function decifrarArquivos(caminhoArquivo, senha) {
  const leitura = fs.readFileSync(caminhoArquivo, 'utf8');
  try { 
    const decifracao = decrypt(leitura, senha);
  console.log(decifracao); }
  catch(e) { console.log('Senha incorreta ou arquivo corrompido')}
}

const comando = process.argv[2];
const arquivo = process.argv[3];

    
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Digite a senha: ', (senha) => {
    if(comando == 'cifrar') { cifrarArquivo(arquivo, senha); }
    else if(comando == 'decifrar') { decifrarArquivos(arquivo, senha); }
    
    rl.close();
});

// ─────────────────────────────────────────────
// Teste rápido: cifra e decifra uma string para verificar que o fluxo funciona
// ─────────────────────────────────────────────
