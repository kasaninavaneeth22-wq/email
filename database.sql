-- =======================================================
-- Email Spam and Phishing Detection System
-- SQL Database Schema & Demonstration Seed Data
-- Database Engine: SQLite / ANSI SQL compatible
-- =======================================================

-- 1. Email Analyses Table
CREATE TABLE IF NOT EXISTS email_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    url_input TEXT,
    classification TEXT NOT NULL CHECK(classification IN ('phishing', 'spam', 'legitimate')),
    risk_score INTEGER NOT NULL CHECK(risk_score BETWEEN 0 AND 100),
    risk_level TEXT NOT NULL CHECK(risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    confidence REAL,
    reasons TEXT NOT NULL,             -- JSON encoded array of detection evidence
    suspicious_keywords TEXT NOT NULL, -- JSON encoded array of matched phrases
    url_findings TEXT NOT NULL,        -- JSON encoded array of URL security findings
    recommendations TEXT NOT NULL,     -- JSON encoded array of safety recommendations
    analyzed_at TEXT NOT NULL,         -- ISO-8601 timestamp
    user_feedback TEXT                 -- Optional user classification feedback
);

-- 2. User Feedback & Model Validation Table
CREATE TABLE IF NOT EXISTS user_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER NOT NULL,
    feedback_type TEXT NOT NULL CHECK(feedback_type IN ('correct', 'incorrect')),
    suggested_classification TEXT,
    comments TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (analysis_id) REFERENCES email_analyses (id) ON DELETE CASCADE
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_analyses_created ON email_analyses(analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_classification ON email_analyses(classification);
CREATE INDEX IF NOT EXISTS idx_analyses_risk ON email_analyses(risk_score DESC);

-- =======================================================
-- Initial Demonstration Seed Records
-- =======================================================

-- Record 1: Phishing Email (PayPal Account Suspended)
INSERT INTO email_analyses (
    id, sender, subject, body, url_input, classification, risk_score, risk_level, confidence,
    reasons, suspicious_keywords, url_findings, recommendations, analyzed_at, user_feedback
) VALUES (
    1,
    'support@paypal-security-alert.xyz',
    'URGENT: Your PayPal Account Has Been Temporarily Suspended',
    'Dear customer, we detected unauthorized login attempts on your PayPal account. You must verify your identity immediately or your account will be permanently closed. Please click the link below to confirm your password and billing credentials: http://192.168.1.100/paypal-verify. Action required within 24 hours.',
    'http://192.168.1.100/paypal-verify',
    'phishing',
    100,
    'Critical',
    0.985,
    '["Contains high-risk phishing phrase: account has been suspended", "Host is a raw IP address (192.168.1.100) rather than an authentic domain", "Solicits sensitive authentication and billing credentials", "Applies psychological coercion through urgent 24-hour deadline", "Sender domain paypal-security-alert.xyz is not an authorized PayPal domain"]',
    '["account has been suspended", "verify your identity", "confirm your password", "unauthorized login", "within 24 hours"]',
    '[{"url": "http://192.168.1.100/paypal-verify", "domain": "192.168.1.100", "is_ip_address": true, "is_http": true, "risk_points": 45, "indicators": ["Host is a raw IP address", "Insecure plaintext HTTP protocol"]}]',
    '["Do NOT click any links, open attachments, or verify credentials.", "Never enter passwords or One-Time Passcodes (OTP) on unverified websites.", "Verify your account by logging in directly at https://www.paypal.com in a separate browser window.", "Report this email as a phishing attack to your security team."]',
    '2026-10-29T04:10:00Z',
    'correct'
);

-- Record 2: Spam Email (Walmart Gift Card Winner)
INSERT INTO email_analyses (
    id, sender, subject, body, url_input, classification, risk_score, risk_level, confidence,
    reasons, suspicious_keywords, url_findings, recommendations, analyzed_at, user_feedback
) VALUES (
    2,
    'rewards@super-deals-sweepstakes.net',
    'Congratulations! You Have Won a $1,000 Walmart Gift Card',
    'Dear Winner, Your email address was selected in our monthly shopper sweepstakes! You are eligible to receive a complimentary $1,000 Walmart Gift Card today. Click here to claim your exclusive prize before it expires: http://super-deals-rewards.com/claim-card. No purchase necessary!',
    'http://super-deals-rewards.com/claim-card',
    'spam',
    48,
    'Medium',
    0.942,
    '["Contains promotional prize/sweepstakes spam indicators", "Unsolicited mass marketing reward claim", "Uses insecure plaintext HTTP protocol"]',
    '["congratulations you have won", "shopper sweepstakes", "claim your prize", "no purchase necessary"]',
    '[{"url": "http://super-deals-rewards.com/claim-card", "domain": "super-deals-rewards.com", "is_ip_address": false, "is_http": true, "risk_points": 10, "indicators": ["Insecure plaintext HTTP protocol"]}]',
    '["Mark this email as Spam / Junk in your mail client.", "Do not reply or click unsubscribe on untrusted promotional bulk mail.", "Avoid providing personal contact or mailing address details for unverified prizes."]',
    '2026-10-29T04:12:00Z',
    'correct'
);

-- Record 3: Legitimate Email (Academic Capstone Meeting)
INSERT INTO email_analyses (
    id, sender, subject, body, url_input, classification, risk_score, risk_level, confidence,
    reasons, suspicious_keywords, url_findings, recommendations, analyzed_at, user_feedback
) VALUES (
    3,
    'prof.sharma@university.edu',
    'Capstone Project Review Meeting Agenda - Thursday at 3:00 PM',
    'Hi team, Please find attached the agenda for our upcoming capstone project review scheduled for Thursday at 3:00 PM in Seminar Hall B. We will go through the frontend components, API performance, and machine learning evaluation metrics. Push your commits by noon. Best regards, Dr. K. Sharma.',
    'https://university.edu/student-portal',
    'legitimate',
    8,
    'Low',
    0.991,
    '["No suspicious phrases, deceptive URLs, or brand impersonation patterns detected.", "Verified authentic educational sender domain (@university.edu).", "Standard collaborative language and natural message semantics."]',
    '[]',
    '[{"url": "https://university.edu/student-portal", "domain": "university.edu", "is_ip_address": false, "is_http": false, "risk_points": 0, "indicators": []}]',
    '["Message exhibits standard characteristics of legitimate correspondence.", "Exercise standard cybersecurity hygiene when downloading attachments."]',
    '2026-10-29T04:15:00Z',
    'correct'
);

-- Record 4: Phishing Email (Microsoft 365 Password Expiration)
INSERT INTO email_analyses (
    id, sender, subject, body, url_input, classification, risk_score, risk_level, confidence,
    reasons, suspicious_keywords, url_findings, recommendations, analyzed_at, user_feedback
) VALUES (
    4,
    'alerts@micros0ft-login-auth.com',
    'Security Alert: Office 365 Password Expiration Notice',
    'Your Microsoft 365 corporate password is set to expire in 24 hours. To retain access to your mailbox and company files without disruption, verify your credentials here: https://micros0ft-login-auth.com/renew. Failure to renew will result in account termination.',
    'https://micros0ft-login-auth.com/renew',
    'phishing',
    90,
    'Critical',
    0.976,
    '["Homoglyph typo-squatting detected in domain: micros0ft (numeral 0 replacing letter o)", "Applies urgent 24-hour password expiration pressure", "Impersonates Microsoft 365 corporate authentication gateway"]',
    '["password is set to expire", "verify your credentials", "security alert", "in 24 hours"]',
    '[{"url": "https://micros0ft-login-auth.com/renew", "domain": "micros0ft-login-auth.com", "is_ip_address": false, "has_brand_spoof": true, "risk_points": 35, "indicators": ["Typo-squatting / homoglyph detected"]}]',
    '["Do NOT enter your corporate credentials on lookalike domains.", "Immediately contact your organization IT Helpdesk to verify password expiration policy.", "Ensure Multi-Factor Authentication (MFA) is active on your account."]',
    '2026-10-29T04:18:00Z',
    'correct'
);
