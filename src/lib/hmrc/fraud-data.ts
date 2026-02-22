import type { FraudPreventionClientData } from '@/lib/fraud';

export function parseFraudData(value: unknown): FraudPreventionClientData | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.userAgent !== 'string' ||
    typeof candidate.deviceId !== 'string' ||
    typeof candidate.screens !== 'string' ||
    typeof candidate.timezone !== 'string' ||
    typeof candidate.windowSize !== 'string'
  ) {
    return undefined;
  }

  return {
    userAgent: candidate.userAgent,
    deviceId: candidate.deviceId,
    screens: candidate.screens,
    timezone: candidate.timezone,
    windowSize: candidate.windowSize,
  };
}
