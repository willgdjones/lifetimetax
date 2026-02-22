import { hmrcGet } from '@/lib/hmrc/client';
import type {
  HMRCBenefits,
  HMRCEmployment,
  HMRCIncome,
  HMRCNationalInsurance,
  HMRCSelfAssessment,
} from '@/lib/hmrc/types';
import type { FraudPreventionClientData } from '@/lib/fraud';

type ApiInput = {
  accessToken: string;
  requestHeaders: Headers;
  userId: string;
  clientData?: FraudPreventionClientData;
};

export async function getNationalInsurance(input: ApiInput & { nino: string; taxYear: string }) {
  return hmrcGet<HMRCNationalInsurance>({
    ...input,
    path: `/national-insurance/sa/${encodeURIComponent(input.nino)}/${encodeURIComponent(input.taxYear)}`,
  });
}

export async function getIndividualIncome(input: ApiInput & { matchId: string }) {
  return hmrcGet<HMRCIncome>({
    ...input,
    path: `/individuals/income/?matchId=${encodeURIComponent(input.matchId)}`,
  });
}

export async function getEmployments(input: ApiInput & { matchId: string }) {
  return hmrcGet<HMRCEmployment>({
    ...input,
    path: `/individuals/employments/?matchId=${encodeURIComponent(input.matchId)}`,
  });
}

export async function getBenefitsAndCredits(input: ApiInput & { matchId: string }) {
  return hmrcGet<HMRCBenefits>({
    ...input,
    path: `/individuals/benefits-and-credits/?matchId=${encodeURIComponent(input.matchId)}`,
  });
}

export async function getSelfAssessment(input: ApiInput & { matchId: string }) {
  return hmrcGet<HMRCSelfAssessment>({
    ...input,
    path: `/individuals/self-assessment/?matchId=${encodeURIComponent(input.matchId)}`,
  });
}

export async function getIndividualDetails(input: ApiInput) {
  return hmrcGet<{ matchId: string; nino?: string }>({
    ...input,
    path: '/individuals/details',
  });
}
