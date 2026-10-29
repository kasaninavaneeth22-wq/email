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
