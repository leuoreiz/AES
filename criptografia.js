const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

const IV_SIZE = 16;   // bytes (128 bits)





function deriveKey(password) {
  senhaCriptografa = crypto.createHash('sha256').update(password).digest()
  return senhaCriptografa;

}

function encrypt(text, password) {
  const key = deriveKey(password);
  IV = crypto.randomBytes(IV_SIZE);
  cipher = crypto.createCipheriv(ALGORITHM, key, IV);
  chipherfinal = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  const encryptedBuffer = Buffer.from(chipherfinal, 'hex');
  const juntos = Buffer.concat([IV, encryptedBuffer]);
  const result = Buffer.from(juntos).toString('base64');
  return result;
  // 1. Gere um IV aleatório           → crypto.randomBytes(IV_SIZE)
  // 2. Crie o cipher                  → crypto.createCipheriv(...)
  // 3. Cifre o texto                  → cipher.update(...) + cipher.final()
  // 4. Junte IV  string base6+ texto cifrado
  // 5. Retorne como4
}

function decrypt(encryptedData, password) {
  const key = deriveKey(password);
  const buffer = Buffer.from(encryptedData, 'base64');
  const inicio = buffer.subarray(0, 16);
  const final = buffer.subarray(16);  
  decipher = crypto.createDecipheriv(ALGORITHM, key, inicio);
  decifrar = decipher.update(final, 'hex', 'utf8') + decipher.final('utf8');
  return decifrar;
  // 2. Separe os primeiros 16 bytes (IV) do resto (texto cifrado)
  // 3. Crie o decipher                → crypto.createDecipheriv(...)
  // 4. Decifre e retorne o texto
}// 1. Decodifique o base64
  


const texto = "Olá mundo!";
const senha = "minha-senha-secreta";

const criptografado = encrypt(texto, senha);
console.log("Criptografado:", criptografado);

const descriptografado = decrypt(criptografado, senha);
console.log("Descriptografado:", descriptografado);