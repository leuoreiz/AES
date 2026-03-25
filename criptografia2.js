const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

const IV_SIZE = 16;   // bytes (128 bits)





function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')

}



function encrypt(text, password) {
  const salt = crypto.randomBytes(IV_SIZE);
  const key = deriveKey(password, salt);
  IV = crypto.randomBytes(IV_SIZE);
  cipher = crypto.createCipheriv(ALGORITHM, key, IV);
  chipherfinal = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  const encryptedBuffer = Buffer.from(chipherfinal, 'hex');
  const juntos = Buffer.concat([salt, IV, encryptedBuffer]);
  const result = Buffer.from(juntos).toString('base64');
  return result;
  // 1. Gere um IV aleatório           → crypto.randomBytes(IV_SIZE)
  // 2. Crie o cipher                  → crypto.createCipheriv(...)
  // 3. Cifre o texto                  → cipher.update(...) + cipher.final()
  // 4. Junte IV  string base6+ texto cifrado
  // 5. Retorne como4
}

function decrypt(encryptedData, password) {
  const buffer = Buffer.from(encryptedData, 'base64');
  const salt = buffer.subarray(0, 16);
  const iv = buffer.subarray(16, 32);
  const ciphertext = buffer.subarray(32);
  const key = deriveKey(password, salt);  
  decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decifrado = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return decifrado;
  // 2. Separe os primeiros 16 bytes (IV) do resto (texto cifrado)
  // 3. Crie o decipher                → crypto.createDecipheriv(...)
  // 4. Decifre e retorne o texto
}// 1. Decodifique o base64
  


const fs = require('fs');

// ler arquivo
const conteudo = fs.readFileSync('mensagem.txt', 'utf8');

// escrever arquivo
fs.writeFileSync('mensagem.txt.cifrado', dados);


function cifrarArquivo('mensagem.txt', senha) {
    fs.readFileSync
    // 1. ler o conteúdo do arquivo
    // 2. cifrar usando encrypt()
    // 3. salvar em caminhoArquivo + '.cifrado'
  }


const texto = "Olá mundo!";
const senha = "minha-senha-secreta";

const criptografado = encrypt(texto, senha);
console.log("Criptografado:", criptografado);

const descriptografado = decrypt(criptografado, senha);
console.log("Descriptografado:", descriptografado);