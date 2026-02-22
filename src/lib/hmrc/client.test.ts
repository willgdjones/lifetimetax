import { createHash } from 'crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { exchangeCodeForToken, getHmrcAuthUrl, makePkcePair } from '@/lib/hmrc/client';

const originalEnv = process.env;

describe('hmrc client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it('uses default and overridden OAuth auth URL', () => {
    delete process.env.HMRC_AUTH_URL;
    expect(getHmrcAuthUrl()).toBe('https://test-www.tax.service.gov.uk/oauth/authorize');

    process.env.HMRC_AUTH_URL = 'https://example.test/oauth/authorize';
    expect(getHmrcAuthUrl()).toBe('https://example.test/oauth/authorize');
  });

  it('creates a valid PKCE verifier/challenge pair', () => {
    const { verifier, challenge } = makePkcePair();
    const expectedChallenge = createHash('sha256').update(verifier).digest('base64url');

    expect(verifier.length).toBeGreaterThan(20);
    expect(challenge).toBe(expectedChallenge);
  });

  it('exchanges code for token successfully', async () => {
    process.env = {
      ...originalEnv,
      HMRC_CLIENT_ID: 'client-id',
      HMRC_CLIENT_SECRET: 'client-secret',
      HMRC_REDIRECT_URI: 'http://localhost/callback',
      HMRC_TOKEN_URL: 'https://example.test/oauth/token',
    };

    const tokenPayload = {
      access_token: 'access-token',
      token_type: 'bearer' as const,
      expires_in: 3600,
      refresh_token: 'refresh-token',
      scope: 'read:income',
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => tokenPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await exchangeCodeForToken({
      code: 'auth-code',
      codeVerifier: 'pkce-verifier',
    });

    expect(response).toEqual(tokenPayload);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://example.test/oauth/token');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded' });

    const body = options.body as URLSearchParams;
    expect(body.get('grant_type')).toBe('authorization_code');
    expect(body.get('code')).toBe('auth-code');
    expect(body.get('client_id')).toBe('client-id');
    expect(body.get('client_secret')).toBe('client-secret');
    expect(body.get('redirect_uri')).toBe('http://localhost/callback');
    expect(body.get('code_verifier')).toBe('pkce-verifier');
  });

  it('throws a helpful error when token exchange fails', async () => {
    process.env = {
      ...originalEnv,
      HMRC_CLIENT_ID: 'client-id',
      HMRC_CLIENT_SECRET: 'client-secret',
      HMRC_REDIRECT_URI: 'http://localhost/callback',
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'invalid_grant',
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      exchangeCodeForToken({
        code: 'bad-code',
        codeVerifier: 'bad-verifier',
      }),
    ).rejects.toThrow('HMRC token exchange failed: 401 invalid_grant');
  });
});
