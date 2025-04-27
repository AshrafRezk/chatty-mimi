
export interface CompanySearchResult {
  name: string;
  website: string;
  favicon?: string;
}

export interface LeadStakeholder {
  id?: string;
  requestId?: string;
  name: string;
  title: string;
  linkedinUrl: string;
  email?: string;
}

export interface LeadIntent {
  id?: string;
  requestId?: string;
  activitySummary: string;
  urgencyScore: number; // 1-10
}

export interface LeadSalesPlan {
  id?: string;
  requestId?: string;
  coldCallScript: string;
  emailSequence: string;
  marketingTips: string;
}

export interface LeadRequest {
  id?: string;
  userId?: string;
  providerCompany: string;
  providerServices: string;
  targetClient: string;
  targetClientWebsite: string;
  createdAt?: string;
  stakeholders?: LeadStakeholder[];
  intents?: LeadIntent;
  salesPlan?: LeadSalesPlan;
  scoutingMode?: boolean;
  industry?: string;
}

// Types for scout mode
export interface ScoutedCompany {
  name: string;
  website: string;
  description: string;
  matchScore: number; // 1-10
  contacts: LeadStakeholder[];
}

export interface ScoutingResult {
  companies: ScoutedCompany[];
  searchQuery: string;
  timestamp: string;
}

// Search history types
export interface LeadSearchHistoryItem {
  id?: string;
  lead_request_id?: string;
  search_query: string;
  search_type: 'direct' | 'scouting';
  search_params: Record<string, any>;
  searched_at?: string;
  provider_company?: string;
  provider_services?: string;
  target_client?: string;
  target_client_website?: string;
  // These fields come from the view and might be JSON strings or parsed objects
  contacts?: LeadStakeholder[] | string;
  intent?: {
    activity_summary: string;
    urgency_score: number;
  } | string;
  sales_plan?: {
    cold_call_script: string;
    email_sequence: string;
    marketing_tips: string;
  } | string;
}
