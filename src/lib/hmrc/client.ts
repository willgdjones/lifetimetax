import { createHash, randomBytes } from 'crypto';
import { getEnv } from '@/lib/env';
import type { FraudPreventionClientData } from '@/lib/fraud';
import { buildFraudPreventionHeaders } from '@/lib/fraud';
import type { HMRCAuthTokenResponse } from '@/lib/hmrc/types';

export function getHmrcBaseUrl() {
  return process.env.HMRC_BASE_URL ?? 'https://test-api.service.hmrc.gov.uk';
}

export function getHmrcAuthUrl() {
  return process.env.HMRC_AUTH_URL ?? 'https://test-www.tax.service.gov.uk/oauth/authorize';
}

export function getHmrcTokenUrl() {
  return process.env.HMRC_TOKEN_URL ?? 'https://test-api.service.hmrc.gov.uk/oauth/token';
}

export function makePkcePair() {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export async function exchangeCodeForToken(input: { code: string; codeVerifier: string }) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: input.code,
    client_id: getEnv('HMRC_CLIENT_ID'),
    client_secret: getEnv('HMRC_CLIENT_SECRET'),
    redirect_uri: getEnv('HMRC_REDIRECT_URI'),
    code_verifier: input.codeVerifier,
  });

  const response = await fetch(getHmrcTokenUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`HMRC token exchange failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as HMRCAuthTokenResponse;
}

export async function refreshHmrcToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: getEnv('HMRC_CLIENT_ID'),
    client_secret: getEnv('HMRC_CLIENT_SECRET'),
  });

  const response = await fetch(getHmrcTokenUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`HMRC token refresh failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as HMRCAuthTokenResponse;
}

export async function hmrcGet<T>(input: {
  path: string;
  accessToken: string;
  requestHeaders: Headers;
  userId: string;
  clientData?: FraudPreventionClientData;
}) {
  const response = await fetch(`${getHmrcBaseUrl()}${input.path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      Accept: 'application/vnd.hmrc.1.0+json',
      ...buildFraudPreventionHeaders({
        clientData: input.clientData,
        requestHeaders: input.requestHeaders,
        userId: input.userId,
      }),
    },
  });

  if (!response.ok) {
    throw new Error(`HMRC API error (${input.path}): ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}
