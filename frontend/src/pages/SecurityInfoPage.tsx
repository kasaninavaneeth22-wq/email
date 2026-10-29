import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  KeyRound, 
  Link as LinkIcon, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Eye,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export const SecurityInfoPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Lock className="w-4 h-4" />
          <span>Cybersecurity Awareness</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Email Threat Education & Safety Guide</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Understanding the tactical distinction between unwanted marketing spam and malicious phishing campaigns, 
          and how modern threat actors exploit psychological pressure and deceptive links.
        </p>
      </div>

      {/* Section 1: Spam vs Phishing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spam Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">What is Email Spam?</h3>
              <p className="text-xs text-amber-400/90 font-medium">Unsolicited Bulk Marketing & Scams</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Spam refers to unwanted, unrequested messages sent simultaneously to mass recipient lists. 
            While usually commercial or promotional (e.g. miracle supplements, fake diplomas, sweepstakes, loan consolidation), 
            spam wastes bandwidth and can lead to financial fraud.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs">
            <span className="font-semibold text-slate-200 block">Common Indicators:</span>
            <ul className="space-y-1 text-slate-400">
              <li>• Unrealistic promises: "Double your Bitcoin in 24 hours"</li>
              <li>• Sweepstakes wins you never entered: "Walmart $1000 Card"</li>
              <li>• Mass BCC recipients and generic non-personalized greetings</li>
            </ul>
          </div>
        </div>

        {/* Phishing Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">What is Phishing?</h3>
              <p className="text-xs text-rose-400/90 font-medium">Deceptive Social Engineering & Credential Theft</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Phishing is a malicious social engineering attack where an adversary masquerades as a reputable brand, 
            financial institution, university IT helpdesk, or corporate executive to deceive victims into handing over passwords, 
            one-time codes, or credit card numbers.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs">
            <span className="font-semibold text-slate-200 block">Common Tactics:</span>
            <ul className="space-y-1 text-slate-400">
              <li>• Brand impersonation (spoofed PayPal, Microsoft 365, Bank logos)</li>
              <li>• Artificially induced urgency: "Account suspended in 24 hours"</li>
              <li>• Clone login pages designed to harvest credentials in real time</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: How Phishing Attacks Work (Anatomy of an Attack) */}
      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-400" />
          <span>The 4 Stages of a Phishing Attack</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-mono font-bold text-xs">STEP 01</span>
            <h4 className="font-semibold text-white text-sm">Target Recon & Spoof</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attacker registers lookalike domains (e.g. <code className="text-indigo-300">paypal-support.xyz</code>) and drafts urgent alerts.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-mono font-bold text-xs">STEP 02</span>
            <h4 className="font-semibold text-white text-sm">Coercive Delivery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Victim receives email claiming unauthorized access or immediate account termination to trigger anxiety and bypass logic.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-mono font-bold text-xs">STEP 03</span>
            <h4 className="font-semibold text-white text-sm">Credential Harvest</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Victim clicks link and enters password and 2FA passcode into a malicious proxy page mimicking the genuine portal.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-mono font-bold text-xs">STEP 04</span>
            <h4 className="font-semibold text-white text-sm">Account Compromise</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attacker takes over account, steals personal or banking data, or pivots deeper into corporate networks.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Recognizing Suspicious URLs */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-400" />
          <span>Forensic Guide: How to Spot Suspicious URLs</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Phishers disguise hyperlinks using subtle structural modifications. Always inspect the exact domain name 
          rather than trusting the friendly text displayed in the email body.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Example 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Misleading Subdomain Cloaking</span>
            </div>
            <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded">
              http://<strong className="text-indigo-300">paypal.com</strong>.<span className="text-rose-400">auth-verify.xyz</span>/login
            </p>
            <p className="text-[11px] text-slate-400">
              The real domain is <strong>auth-verify.xyz</strong>. The brand name "paypal.com" is merely a deceptive subdomain prefix.
            </p>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Direct IP Address Links</span>
            </div>
            <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded">
              http://<span className="text-rose-400">192.168.1.100</span>/secure/account
            </p>
            <p className="text-[11px] text-slate-400">
              Legitimate enterprise services never use naked IP addresses in place of registered DNS domains.
            </p>
          </div>

          {/* Example 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Homoglyph & Typo-Squatting</span>
            </div>
            <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded">
              https://<span className="text-rose-400">micros0ft</span>-portal.com
            </p>
            <p className="text-[11px] text-slate-400">
              Subtle character substitution (e.g. numeral '0' replacing letter 'o') to trick quick visual inspection.
            </p>
          </div>

          {/* Example 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Obscured Shortener Services</span>
            </div>
            <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded">
              https://<span className="text-amber-400">bit.ly</span>/bank-alert-update
            </p>
            <p className="text-[11px] text-slate-400">
              Shortened URLs completely conceal destination addresses until redirected.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Critical Golden Rule - NEVER Share OTPs or Passwords */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">The Golden Rule: Never Disclose Passwords or OTPs</h3>
            <p className="text-xs text-rose-300">No genuine support team will ever request your secret credentials.</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          One-Time Passcodes (OTPs) and multi-factor authentication codes are strictly confidential keys designed exclusively for your eyes. 
          Legitimate banking personnel, university professors, Google administrators, or IT helpdesk technicians possess backend administrative access 
          and will <strong>NEVER</strong> demand your OTP, password, or security PIN over email or telephone.
        </p>
      </div>

      {/* Section 5: Best Practices Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Daily Inbox Hygiene Checklist</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Always check sender email domain, not just the displayed contact name.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Navigate to websites by typing the official address directly into your browser.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Enable Hardware Security Keys or App-based Authenticator MFA on all critical accounts.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Report suspicious messages to your organizational security team immediately.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
