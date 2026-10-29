from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, EmailStr

class EmailAnalysisRequest(BaseModel):
    sender: Optional[str] = Field(None, description="Sender email address, e.g. support@paypal-notice.xyz")
    subject: str = Field(..., min_length=1, max_length=500, description="Email subject line")
    body: str = Field(..., min_length=1, max_length=50000, description="Email body content")
    url_input: Optional[str] = Field(None, max_length=2000, description="Optional specific URL extracted from the email")

class URLFinding(BaseModel):
    url: str
    domain: str
    is_ip_address: bool = False
    is_shortener: bool = False
    is_suspicious_tld: bool = False
    has_brand_spoof: bool = False
    is_http: bool = False
    is_punycode_or_encoded: bool = False
    subdomain_count: int = 0
    risk_points: int = 0
    issues: List[str] = []

class EmailAnalysisResponse(BaseModel):
    id: Optional[int] = None
    sender: Optional[str] = None
    subject: str
    body_excerpt: str
    classification: str = Field(..., description="phishing, spam, or legitimate")
    risk_score: int = Field(..., ge=0, le=100, description="Explainable composite risk score from 0 to 100")
    risk_level: str = Field(..., description="Low, Medium, High, or Critical")
    confidence: Optional[float] = Field(None, description="Model statistical confidence probability if calibrated")
    reasons: List[str] = []
    suspicious_keywords: List[str] = []
    url_findings: List[Dict[str, Any]] = []
    recommendations: List[str] = []
    analyzed_at: str
    disclaimer: str

class FeedbackRequest(BaseModel):
    analysis_id: int
    feedback_type: str = Field(..., description="'correct' or 'incorrect'")
    suggested_classification: Optional[str] = Field(None, description="Optional suggested class: spam, phishing, legitimate")
    comments: Optional[str] = Field(None, max_length=1000)

class FeedbackResponse(BaseModel):
    success: bool
    message: str

class HistoryItem(BaseModel):
    id: int
    sender: Optional[str]
    subject: str
    body: str
    url_input: Optional[str]
    classification: str
    risk_score: int
    risk_level: str
    confidence: Optional[float]
    reasons: List[str]
    suspicious_keywords: List[str]
    url_findings: List[Dict[str, Any]]
    recommendations: List[str]
    analyzed_at: str
    user_feedback: Optional[str] = None

class HistoryListResponse(BaseModel):
    items: List[HistoryItem]
    total: int
    page: int
    page_size: int
    total_pages: int

class DashboardStatsResponse(BaseModel):
    total_analyzed: int
    spam_count: int
    phishing_count: int
    legitimate_count: int
    risk_distribution: Dict[str, int]
    recent_high_risk: List[HistoryItem]
    trend_by_date: List[Dict[str, Any]]
