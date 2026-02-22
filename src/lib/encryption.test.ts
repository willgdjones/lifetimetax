import { afterEach, describe, expect, it } from 'vitest';
import { decrypt, decryptJson, encrypt, encryptJson } from '@/lib/encryption';

const originalEnv = process.env;

describe('encryption', () => {
  afterEach(() => {
    process.env = originalEnv;
  });

  it('round-trips plaintext with encrypt/decrypt', () => {
    process.env = {
      ...originalEnv,
      ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    };

    const ciphertext = encrypt('LifetimeTax');
    expect(ciphertext.split(':')).toHaveLength(3);
    expect(decrypt(ciphertext)).toBe('LifetimeTax');
  });

  it('round-trips json payloads with encryptJson/decryptJson', () => {
    process.env = {
      ...originalEnv,
      ENCRYPTION_KEY: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    };

    const payload = { nino: 'AB123456C', taxYears: ['2022-23', '2023-24'], amount: 1234.56 };
    const ciphertext = encryptJson(payload);

    expect(decryptJson<typeof payload>(ciphertext)).toEqual(payload);
  });
});
