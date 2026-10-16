import * as crypto from 'crypto';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    if (!stored || !stored.includes(':')) return false;
    const [salt, originalHash] = stored.split(':');
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch (e) {
    return false;
  }
}

describe('Password Security and Hashing', () => {
  it('should generate salted scrypt hashes that differ for identical passwords', () => {
    const p = 'SecretPassword123!';
    const h1 = hashPassword(p);
    const h2 = hashPassword(p);

    expect(h1).not.toBe(h2);
    expect(h1).toContain(':');
    expect(h2).toContain(':');
  });

  it('should successfully verify correct password with timing-safe comparison', () => {
    const p = 'CorrectHorseBatteryStaple';
    const hash = hashPassword(p);

    expect(verifyPassword(p, hash)).toBe(true);
  });

  it('should reject incorrect password', () => {
    const p = 'MySecurePass!';
    const hash = hashPassword(p);

    expect(verifyPassword('WrongPassword', hash)).toBe(false);
  });

  it('should safely handle corrupted or malformed hashes without crashing', () => {
    expect(verifyPassword('test', 'not-a-valid-hash')).toBe(false);
    expect(verifyPassword('test', '')).toBe(false);
    expect(verifyPassword('test', 'salt:short')).toBe(false);
  });
});
