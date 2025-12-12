import crypto from 'crypto';
import bcrypt from 'bcrypt';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';
const SALT_ROUNDS = 12; // Усиленное шифрование для bcrypt

// ===== СИММЕТРИЧНОЕ ШИФРОВАНИЕ (для данных) =====

/**
 * Шифрует данные AES-256-GCM
 * @param text Текст для шифрования
 * @returns Зашифрованные данные с IV и auth tag
 */
export const encryptData = (text: string): string => {
  try {
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Формат: IV:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Data encryption failed');
  }
};

/**
 * Расшифровывает данные AES-256-GCM
 * @param encryptedData Зашифрованные данные в формате IV:authTag:encrypted
 * @returns Исходный текст
 */
export const decryptData = (encryptedData: string): string => {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }
    
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Data decryption failed');
  }
};

// ===== АСИММЕТРИЧНОЕ ШИФРОВАНИЕ ПАРОЛЕЙ (bcrypt) =====

/**
 * Хеширует пароль с bcrypt
 * @param password Исходный пароль
 * @returns Хеш пароля
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Сравнивает пароль с его хешем
 * @param password Исходный пароль
 * @param hash Хеш пароля из БД
 * @returns true если пароль совпадает
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// ===== ГЕНЕРАЦИЯ БЕЗОПАСНЫХ ТОКЕНОВ =====

/**
 * Генерирует криптографически безопасный токен
 * @param length Длина токена в байтах (default 32)
 * @returns Токен в hex формате
 */
export const generateToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Генерирует код подтверждения (6 цифр)
 * @returns Код подтверждения
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ===== ХЕШИРОВАНИЕ ДАННЫХ =====

/**
 * Создаёт SHA-256 хеш строки
 * @param text Текст для хеширования
 * @returns SHA-256 хеш
 */
export const hashSHA256 = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Создаёт HMAC для проверки целостности
 * @param data Данные
 * @param secret Секретный ключ
 * @returns HMAC-SHA256
 */
export const createHMAC = (data: string, secret: string = ENCRYPTION_KEY): string => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

// ===== ВАЛИДАЦИЯ =====

/**
 * Проверяет безопасность пароля
 */
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character (!@#$%^&*)');
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// ===== МАСКИРОВАНИЕ ДАННЫХ (для логов) =====

/**
 * Скрывает последние символы Email
 */
export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  const masked = name.substring(0, 2) + '****';
  return `${masked}@${domain}`;
};

/**
 * Скрывает IP адрес
 */
export const maskIP = (ip: string): string => {
  const parts = ip.split('.');
  parts[3] = '***';
  return parts.join('.');
};
