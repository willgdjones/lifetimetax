export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          hmrc_access_token_encrypted: string | null;
          hmrc_refresh_token_encrypted: string | null;
          hmrc_token_expires_at: string | null;
          hmrc_nino_encrypted: string | null;
          hmrc_match_id: string | null;
          hmrc_connected_at: string | null;
          is_premium: boolean;
          stripe_payment_id: string | null;
          premium_purchased_at: string | null;
          share_id: string;
          data_fetched_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          hmrc_access_token_encrypted?: string | null;
          hmrc_refresh_token_encrypted?: string | null;
          hmrc_token_expires_at?: string | null;
          hmrc_nino_encrypted?: string | null;
          hmrc_match_id?: string | null;
          hmrc_connected_at?: string | null;
          is_premium?: boolean;
          stripe_payment_id?: string | null;
          premium_purchased_at?: string | null;
          share_id?: string;
          data_fetched_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hmrc_access_token_encrypted?: string | null;
          hmrc_refresh_token_encrypted?: string | null;
          hmrc_token_expires_at?: string | null;
          hmrc_nino_encrypted?: string | null;
          hmrc_match_id?: string | null;
          hmrc_connected_at?: string | null;
          is_premium?: boolean;
          stripe_payment_id?: string | null;
          premium_purchased_at?: string | null;
          share_id?: string;
          data_fetched_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tax_years: {
        Row: {
          id: string;
          user_id: string;
          tax_year: string;
          income_tax_paid: number | null;
          ni_contributions: number | null;
          student_loan_repaid: number | null;
          total_earnings: number | null;
          employment_count: number | null;
          raw_data_encrypted: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tax_year: string;
          income_tax_paid?: number | null;
          ni_contributions?: number | null;
          student_loan_repaid?: number | null;
          total_earnings?: number | null;
          employment_count?: number | null;
          raw_data_encrypted?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tax_year?: string;
          income_tax_paid?: number | null;
          ni_contributions?: number | null;
          student_loan_repaid?: number | null;
          total_earnings?: number | null;
          employment_count?: number | null;
          raw_data_encrypted?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      lifetime_summary: {
        Row: {
          id: string;
          user_id: string;
          total_income_tax: number | null;
          total_ni: number | null;
          estimated_vat: number | null;
          estimated_council_tax: number | null;
          estimated_fuel_duty: number | null;
          estimated_other: number | null;
          grand_total: number | null;
          years_covered: number | null;
          earliest_year: string | null;
          latest_year: string | null;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_income_tax?: number | null;
          total_ni?: number | null;
          estimated_vat?: number | null;
          estimated_council_tax?: number | null;
          estimated_fuel_duty?: number | null;
          estimated_other?: number | null;
          grand_total?: number | null;
          years_covered?: number | null;
          earliest_year?: string | null;
          latest_year?: string | null;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_income_tax?: number | null;
          total_ni?: number | null;
          estimated_vat?: number | null;
          estimated_council_tax?: number | null;
          estimated_fuel_duty?: number | null;
          estimated_other?: number | null;
          grand_total?: number | null;
          years_covered?: number | null;
          earliest_year?: string | null;
          latest_year?: string | null;
          calculated_at?: string;
        };
        Relationships: [];
      };
      share_cards: {
        Row: {
          id: string;
          user_id: string;
          card_type: string;
          public_data: Json;
          share_url: string | null;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_type: string;
          public_data: Json;
          share_url?: string | null;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_type?: string;
          public_data?: Json;
          share_url?: string | null;
          view_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
