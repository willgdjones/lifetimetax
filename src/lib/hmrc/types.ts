export type HMRCAuthTokenResponse = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type HMRCProfile = {
  nino?: string;
  [key: string]: unknown;
};

export type HMRCNationalInsurance = {
  class1Contributions?: number;
  class2Contributions?: number;
  class4Contributions?: number;
  totalEarnings?: number;
  [key: string]: unknown;
};

export type HMRCIncome = {
  totalIncome?: number;
  incomeTaxPaid?: number;
  studentLoanRepayment?: number;
  [key: string]: unknown;
};

export type HMRCEmployment = {
  employments?: Array<{ employerName?: string; taxPaid?: number; studentLoanRepayment?: number }>;
  [key: string]: unknown;
};

export type HMRCBenefits = {
  benefitsReceived?: number;
  [key: string]: unknown;
};

export type HMRCSelfAssessment = {
  taxPaid?: number;
  [key: string]: unknown;
};
