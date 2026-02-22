import { APP_VERSION } from '@/lib/env';

export type FraudPreventionClientData = {
  userAgent: string;
  deviceId: string;
  screens: string;
  timezone: string;
  windowSize: string;
};

function toOffsetTz(): string {
  const offsetMinutes = new Date().getTimezoneOffset();
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${minutes}`;
}

function getOrCreateDeviceId() {
  const existing = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('fraud_device_id='))
    ?.split('=')[1];

  if (existing) return decodeURIComponent(existing);

  const created = crypto.randomUUID();
  document.cookie = `fraud_device_id=${created}; Path=/; SameSite=Lax; Max-Age=315360000`;
  return created;
}

export function collectFraudPreventionData(): FraudPreventionClientData {
  return {
    userAgent: navigator.userAgent,
    deviceId: getOrCreateDeviceId(),
    screens: `width=${window.screen.width}&height=${window.screen.height}&scaling-factor=${window.devicePixelRatio}&colour-depth=${window.screen.colorDepth}`,
    timezone: toOffsetTz(),
    windowSize: `width=${window.innerWidth}&height=${window.innerHeight}`,
  };
}

function parseIp(forwardedFor: string | null): string {
  return forwardedFor?.split(',')[0]?.trim() ?? '';
}

export function buildFraudPreventionHeaders(input: {
  clientData?: FraudPreventionClientData;
  requestHeaders: Headers;
  userId: string;
  mfaReference?: string;
}) {
  const timestamp = new Date().toISOString();
  return {
    'Gov-Client-Connection-Method': 'WEB_APP_VIA_SERVER',
    'Gov-Client-Browser-JS-User-Agent': input.clientData?.userAgent ?? '',
    'Gov-Client-Device-ID': input.clientData?.deviceId ?? '',
    'Gov-Client-Multi-Factor': `type=AUTH_CODE&timestamp=${timestamp}&unique-reference=${input.mfaReference ?? input.userId}`,
    'Gov-Client-Public-IP': parseIp(input.requestHeaders.get('x-forwarded-for')),
    'Gov-Client-Public-IP-Timestamp': timestamp,
    'Gov-Client-Public-Port': input.requestHeaders.get('x-forwarded-port') ?? '',
    'Gov-Client-Screens': input.clientData?.screens ?? '',
    'Gov-Client-Timezone': input.clientData?.timezone ?? '',
    'Gov-Client-User-IDs': `lifetimetax=${encodeURIComponent(input.userId)}`,
    'Gov-Client-Window-Size': input.clientData?.windowSize ?? '',
    'Gov-Vendor-Version': `lifetimetax=${APP_VERSION}`,
    'Gov-Vendor-License-IDs': '',
  };
}
