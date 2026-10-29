import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Search, 
  Cpu, 
  Lock, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            AI-Driven Email Defense Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Detect Spam. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">Identify Phishing.</span> Protect Your Inbox.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A state-of-the-art security suite combining trained natural language machine learning 
            with deep cybersecurity heuristics to analyze email subjects, senders, links, and coercive language.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyzer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-xl shadow-indigo-600/25 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>Analyze an Email</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all duration-200"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>

          {/* Key Stat Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Detection Categories</p>
              <p className="text-xl font-bold text-white font-mono mt-1">3 Classes</p>
              <p className="text-[11px] text-slate-400 mt-1">Spam • Phishing • Legitimate</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Core Engine</p>
              <p className="text-xl font-bold text-white font-mono mt-1">Hybrid ML</p>
              <p className="text-[11px] text-slate-400 mt-1">TF-IDF + Security Rules</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">URL Threat Analysis</p>
              <p className="text-xl font-bold text-white font-mono mt-1">Zero-Execution</p>
              <p className="text-[11px] text-slate-400 mt-1">Static Forensic Parsing</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Persistence</p>
              <p className="text-xl font-bold text-white font-mono mt-1">SQLite</p>
              <p className="text-[11px] text-slate-400 mt-1">Audit Trail & Feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Comprehensive Defense Capabilities</h2>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">Engineered for Academic Rigor and Real-World Threat Modeling</p>
          <p className="mt-3 text-slate-400 text-sm">
            Our multi-layered detection pipeline evaluates multiple threat vectors simultaneously rather than depending on a single rule or keyword.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Machine Learning Classification</h3>
            <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
              Trained scikit-learn statistical model utilizing TF-IDF vectorization and balanced classification to accurately score email text patterns against verified spam and legitimate corpora.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Evaluated accuracy and F1 metrics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Statistical probability calibration</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Local model execution without external APIs</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Phishing Heuristics & Spoofing</h3>
            <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
              Detects brand impersonation (PayPal, Microsoft, Netflix, Banks), psychological coercion, sensitive credential solicitations (passwords, OTPs, SSNs), and display name fraud.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Brand-to-sender domain mismatch detection</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Urgent deadline coercion recognition</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Transparent explainable threat reasons</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Safe Local URL Inspection</h3>
            <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
              Analyzes links extracted from email bodies completely offline. Flags raw IP hosts, URL shorteners, disposable TLDs, and misleading subdomain cloaking without ever visiting the link.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Zero network connection or payload execution</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Abused TLD and Punycode homograph check</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Explainable risk points assigned per anomaly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">System Workflow</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">How An Email Is Analyzed</p>
            <p className="mt-2 text-slate-400 text-sm">Four systematic phases from raw message input to actionable defense insight.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs font-mono font-bold text-indigo-400 mb-2">PHASE 01</div>
              <h4 className="font-semibold text-white text-base">Input & Parsing</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Subject, body, sender, and links are parsed, normalized, and sanitized to prevent injection attacks while preserving forensic tokens.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs font-mono font-bold text-indigo-400 mb-2">PHASE 02</div>
              <h4 className="font-semibold text-white text-base">Static Extraction</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                URLs are extracted and inspected for raw IP addresses, shorteners, punycode, and domain anomalies without visiting malicious sites.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs font-mono font-bold text-indigo-400 mb-2">PHASE 03</div>
              <h4 className="font-semibold text-white text-base">Hybrid Scoring</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                The TF-IDF classifier generates statistical class probabilities, merged with heuristic penalties to compute an explainable composite risk score.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs font-mono font-bold text-indigo-400 mb-2">PHASE 04</div>
              <h4 className="font-semibold text-white text-base">Report & Audit</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                A granular threat card with reasons and recommendations is presented to the user, and securely logged into the SQLite audit store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
              <Lock className="w-4 h-4" />
              <span>Data Protection & Privacy Notice</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Your Credentials and Inboxes Stay Safe</h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              This detection system never asks for email account passwords or API tokens. 
              All analysis runs locally in your environment. Links are never fetched or executed, eliminating any risk of drive-by malware downloads.
            </p>
          </div>
          <Link
            to="/security"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-sm font-medium transition-colors"
          >
            <span>Read Security Guidelines</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
