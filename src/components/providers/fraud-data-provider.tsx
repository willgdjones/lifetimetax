'use client';

import { useEffect } from 'react';
import { collectFraudPreventionData } from '@/lib/fraud';

export function FraudDataProvider() {
  useEffect(() => {
    try {
      const data = collectFraudPreventionData();
      localStorage.setItem('fraud_prevention_data', JSON.stringify(data));
      document.cookie = `fraud_device_id=${data.deviceId}; Path=/; SameSite=Lax; Max-Age=315360000`;
      document.cookie = `fraud_client_data=${encodeURIComponent(JSON.stringify(data))}; Path=/; SameSite=Lax; Max-Age=604800`;
    } catch {
      // Ignore client capability errors.
    }
  }, []);

  return null;
}
