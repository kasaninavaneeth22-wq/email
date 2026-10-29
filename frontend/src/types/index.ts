export type ClassificationType = 'spam' | 'phishing' | 'legitimate';
export type RiskLevelType = 'Low' | 'Medium' | 'High' | 'Critical';

export interface URLFinding {
  url: string;
  domain: string;
  is_ip_address: boolean;
  is_shortener: boolean;
  is_suspicious_tld: boolean;
  has_brand_spoof: boolean;
  is_http: boolean;
  is_punycode_or_encoded: boolean;
  excessive_subdomains?: boolean;
  suspicious_port?: boolean;
  domain_mismatch?: boolean;
  risk_points: number;
  indicators: string[];
}

export interface EmailAnalysisResult {
  id?: number;
  sender?: string | null;
  subject: string;
  body_excerpt: string;
  classification: ClassificationType;
  risk_score: number;
  risk_level: RiskLevelType;
  confidence: number | null;
  reasons: string[];
  suspicious_keywords: string[];
  url_findings: URLFinding[];
  recommendations: string[];
  analyzed_at: string;
  disclaimer: string;
}

export interface HistoryItem {
  id: number;
  sender: string | null;
  subject: string;
  body: string;
  url_input: string | null;
  classification: ClassificationType;
  risk_score: number;
  risk_level: RiskLevelType;
  confidence: number | null;
  reasons: string[];
  suspicious_keywords: string[];
  url_findings: URLFinding[];
  recommendations: string[];
  analyzed_at: string;
  user_feedback: string | null;
}

export interface HistoryListResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStats {
  total_analyzed: number;
  spam_count: number;
  phishing_count: number;
  legitimate_count: number;
  risk_distribution: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  recent_high_risk: HistoryItem[];
  trend_by_date: Array<{
    date: string;
    spam: number;
    phishing: number;
    legitimate: number;
  }>;
}

export interface AnalyzePayload {
  sender?: string;
  subject: string;
  body: string;
  url_input?: string;
}

export interface FeedbackPayload {
  analysis_id: number;
  feedback_type: 'correct' | 'incorrect';
  suggested_classification?: string;
  comments?: string;
}
