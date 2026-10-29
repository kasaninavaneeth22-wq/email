import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  RotateCcw, 
  Sparkles, 
  Link as LinkIcon, 
  Mail, 
  User, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  ShieldQuestion
} from 'lucide-react';
import { api } from '../services/api';
import { EmailAnalysisResult, ClassificationType } from '../types';
import { RiskBadge } from '../components/RiskBadge';

// 3 Predefined realistic demonstration emails as required by Section 9
const DEMO_EMAILS = [
  {
    id: 'phishing',
    title: 'Phishing (Simulated Credential Theft)',
    label: 'PayPal Account Suspended',
    badge: 'Phishing Demo',
    sender: 'support@paypal-security-alert.xyz',
    subject: 'URGENT: Your PayPal Account Has Been Temporarily Suspended',
    body: `Dear Customer,

We detected unauthorized sign-in attempts on your PayPal account from an unrecognized IP address. To prevent permanent closure of your account and protect your funds, you must verify your identity immediately.

Click the security link below to confirm your password, billing address, and credit card security code:
http://192.168.1.100/paypal-verify/login.php

Failure to complete this verification within 24 hours will result in permanent account termination and forfeiture of pending transfers.

Sincerely,
PayPal Security & Fraud Prevention Center`,
    url_input: 'http://192.168.1.100/paypal-verify/login.php'
  },
  {
    id: 'spam',
    title: 'Promotional Spam (Prize Scam)',
    label: '$1,000 Walmart Gift Card Winner',
    badge: 'Spam Demo',
    sender: 'rewards@super-deals-sweepstakes.net',
    subject: 'Congratulations! You Have Won a $1,000 Walmart Gift Card',
    body: `Congratulations Valued Shopper!

Your email address was randomly selected in our monthly nationwide shopper sweepstakes! You are eligible to receive a complimentary $1,000 Walmart Gift Card today with zero purchase necessary!

Claim your exclusive VIP gift card before today's deadline:
http://super-deals-rewards.com/claim-card

Do not miss out on this 100% free reward opportunity. Terms and conditions apply.`,
    url_input: 'http://super-deals-rewards.com/claim-card'
  },
  {
    id: 'legitimate',
    title: 'Legitimate Email (College Meeting)',
    label: 'Capstone Project Review Agenda',
    badge: 'Legitimate Demo',
    sender: 'prof.sharma@university.edu',
    subject: 'Capstone Project Review Meeting Agenda - Thursday at 3:00 PM',
    body: `Dear Team,

Please review the attached schedule for our upcoming Phase 2 capstone project viva scheduled for this Thursday at 3:00 PM in Seminar Hall B.

We will evaluate the frontend user interface, FastAPI backend endpoints, and machine learning classification metrics. Please make sure your git commits are pushed to your team's repository by noon tomorrow.

If you have questions regarding the evaluation criteria, feel free to visit my office during afternoon consultation hours.

Best regards,
Dr. K. Sharma
Department of Computer Science & Engineering`,
    url_input: 'https://university.edu/student-portal'
  }
];

export const AnalyzerPage: React.FC = () => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailAnalysisResult | null>(null);

  // Feedback state
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleLoadDemo = (demo: typeof DEMO_EMAILS[0]) => {
    setSender(demo.sender);
    setSubject(demo.subject);
    setBody(demo.body);
    setUrlInput(demo.url_input);
    setResult(null);
    setError(null);
    setFeedbackSent(false);
  };

  const handleClear = () => {
    setSender('');
    setSubject('');
    setBody('');
    setUrlInput('');
    setResult(null);
    setError(null);
    setFeedbackSent(false);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please provide an email subject line.');
      return;
    }
    if (!body.trim()) {
      setError('Please provide email body text to analyze.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFeedbackSent(false);
      const res = await api.analyzeEmail({
        sender: sender.trim() || undefined,
        subject: subject.trim(),
        body: body.trim(),
        url_input: urlInput.trim() || undefined,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async (type: 'correct' | 'incorrect') => {
    if (!result?.id) return;
    try {
      await api.submitFeedback({
        analysis_id: result.id,
        feedback_type: type,
        suggested_classification: type === 'incorrect' ? 'legitimate' : undefined,
      });
      setFeedbackSent(true);
      setFeedbackMsg(type === 'correct' ? 'Thank you! Classification confirmed.' : 'Feedback recorded for model retraining.');
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Interactive Security Scanner</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Email Threat & Phishing Analyzer</h1>
        <p className="text-sm text-slate-400 mt-1">
          Submit email headers, body content, and links to evaluate against machine learning models and security heuristics.
        </p>
      </div>

      {/* Demo Selector Quick Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Load Demonstration Email Samples:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_EMAILS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleLoadDemo(demo)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
                title={demo.title}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 columns) */}
        <form onSubmit={handleAnalyze} className="lg:col-span-7 space-y-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Email Data Input</span>
          </h2>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Sender Address */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Sender Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </span>
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. security-service@paypal-notice.xyz"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Email Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Your Account Has Been Temporarily Suspended"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Email Body Text <span className="text-rose-400">*</span>
              </span>
              <span className="text-[11px] text-slate-400">{body.length} characters</span>
            </label>
            <textarea
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the email message body here. Our static parser will check for coercive language, suspicious phrases, and embedded URLs..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed font-sans"
            />
          </div>

          {/* Optional Extracted URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                Target URL / Link <span className="text-slate-400 font-normal">(Optional)</span>
              </span>
              <span className="text-[10px] text-emerald-400">Never fetched or visited</span>
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. http://192.168.1.100/paypal-verify.php"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Threat Signatures...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              title="Clear all fields"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Output Panel (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          {!result && !loading && (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <ShieldQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">Awaiting Email Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Fill in the email form or click a demo button above. When you click <strong>Analyze Email</strong>, the hybrid engine will calculate threat metrics and explain the classification reasons.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-12 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto animate-spin">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Running Hybrid Forensics</h3>
                <p className="text-xs text-slate-400 mt-1">Analyzing TF-IDF vectors, heuristics, and URLs...</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Classification Banner Card */}
              <div className={`p-6 rounded-2xl border ${
                result.classification === 'phishing'
                  ? 'bg-rose-950/25 border-rose-500/40 glow-rose'
                  : result.classification === 'spam'
                  ? 'bg-amber-950/25 border-amber-500/40 glow-amber'
                  : 'bg-emerald-950/25 border-emerald-500/40'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Classification Result
                    </span>
                    <div className="mt-1">
                      <RiskBadge type="classification" value={result.classification} size="lg" />
                    </div>
                  </div>
                  <RiskBadge type="level" value={result.risk_level} size="md" />
                </div>

                {/* Risk Score Meter */}
                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-300">Explainable Risk Score</span>
                    <span className="font-mono font-bold text-white text-sm">{result.risk_score} / 100</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.risk_score >= 80 
                          ? 'bg-gradient-to-r from-rose-600 to-red-500' 
                          : result.risk_score >= 55 
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                          : result.risk_score >= 30 
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>0 (Safe)</span>
                    <span>50 (Suspicious)</span>
                    <span>100 (Critical)</span>
                  </div>
                </div>

                {/* Model Statistical Confidence */}
                {result.confidence !== null && (
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>ML Model Confidence:</span>
                    <span className="font-mono text-slate-200">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>

              {/* Reasons Card */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Detection Reasons & Evidence</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suspicious Keywords Chips */}
              {result.suspicious_keywords.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Flagged Phrases ({result.suspicious_keywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suspicious_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-800 text-rose-300 border border-rose-500/20 text-xs font-mono"
                      >
                        "{kw}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Security Findings */}
              {result.url_findings.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Static URL Forensics ({result.url_findings.length})</span>
                  </h4>
                  <div className="space-y-2.5">
                    {result.url_findings.map((urlItem, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-slate-200 truncate max-w-xs">{urlItem.url}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            urlItem.risk_points >= 30 ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            Score: {urlItem.risk_points}
                          </span>
                        </div>
                        {urlItem.indicators.length > 0 && (
                          <ul className="space-y-1 text-slate-400 text-[11px]">
                            {urlItem.indicators.map((ind, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-amber-300/90">
                                <span className="shrink-0">•</span>
                                <span>{ind}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recommended Safety Actions</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* User Feedback Widget */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">Was this classification accurate?</span>
                {feedbackSent ? (
                  <span className="text-emerald-400 font-medium">{feedbackMsg}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendFeedback('correct')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Correct</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendFeedback('incorrect')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      <span>Incorrect</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                <strong>Disclaimer:</strong> {result.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
