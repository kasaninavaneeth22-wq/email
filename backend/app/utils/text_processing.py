import re
import urllib.parse
from typing import List, Tuple, Dict, Set

# Compiled regular expressions for text cleaning and extraction
URL_REGEX = re.compile(
    r'(?:https?:\/\/|www\.)[^\s<>"\'{}|\\^`]+',
    re.IGNORECASE
)

EMAIL_REGEX = re.compile(
    r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
    re.IGNORECASE
)

PHISHING_PATTERNS: Dict[str, str] = {
    "account_suspended": r"(?:account\s+(?:has\s+been\s+)?(?:suspended|locked|paused|restricted|closed))",
    "verify_identity": r"(?:verify\s+(?:your\s+)?(?:identity|account|credentials|password|email|card))",
    "unauthorized_access": r"(?:unauthorized\s+(?:access|login|sign-in|activity|charges?|attempts?))",
    "urgent_action": r"(?:(?:urgent|immediate)\s+(?:action|response|verification)\s+required|act\s+(?:now|immediately)|within\s+(?:24|48)\s+hours)",
    "password_expired": r"(?:password\s+(?:is\s+set\s+to\s+)?expire|mandatory\s+(?:password|mfa|duo)\s+(?:update|upgrade|reset))",
    "sensitive_credentials": r"(?:enter\s+(?:your\s+)?(?:password|pin|one-time\s+passcode|otp|ssn|social\s+security|seed\s+phrase|credit\s+card\s+number|cvv))",
    "security_alert": r"(?:security\s+(?:alert|warning|department|notice|notification))",
    "wire_transfer_demand": r"(?:process\s+(?:an?\s+)?urgent\s+(?:overseas\s+)?wire\s+transfer|wire\s+(?:funds|money)\s+immediately)",
    "fake_invoice_scam": r"(?:an?\s+order\s+for\s+\$[\d,.]+\s+was\s+placed|if\s+you\s+did\s+not\s+authorize\s+this\s+purchase)",
    "tax_refund_scam": r"(?:federal\s+tax\s+refund\s+of\s+\$[\d,.]+|submit\s+your\s+direct\s+deposit\s+routing)",
    "copyright_strike": r"(?:page\s+will\s+be\s+unpublished\s+for\s+copyright\s+infringement|appeal\s+within\s+24\s+hours)"
}

SPAM_PATTERNS: Dict[str, str] = {
    "lottery_winner": r"(?:congratulations!?\s+you\s+(?:have\s+)?won|selected\s+(?:in\s+our\s+monthly\s+shopper\s+)?sweepstakes|claim\s+your\s+\$[\d,]+\s+(?:gift\s+card|voucher))",
    "miracle_cure": r"(?:lose\s+\d+\s+lbs\s+in\s+\d+\s+weeks?|miracle\s+(?:weight\s+loss|fat\s+burn)|melt\s+belly\s+fat|keto\s+breakthrough)",
    "guaranteed_income": r"(?:double\s+your\s+bitcoin|guaranteed?\s+(?:high\s+yield|\d+%\s+weekly\s+return)|automated\s+algorithmic\s+trading\s+bot)",
    "preapproved_credit": r"(?:pre-approved\s+platinum\s+credit\s+card|no\s+credit\s+check|0%\s+apr\s+for\s+the\s+first)",
    "cheap_replicas": r"(?:cheap\s+luxury\s+(?:swiss\s+)?watches|replica\s+designer\s+watches|90%\s+off\s+retail)",
    "seo_blast": r"(?:boost\s+your\s+website\s+to\s+#1\s+on\s+google|automated\s+seo\s+backlink)",
    "casino_bonus": r"(?:exclusive\s+casino\s+bonus|\d+\s+free\s+spins|deposit\s+match\s+bonus|royal\s+spin\s+casino)",
    "unclaimed_funds": r"(?:unclaimed\s+(?:funds|estate|inheritance)\s+of\s+\$[\d,.]+\s+usd|next\s+of\s+kin)",
    "discount_clearance": r"(?:clearance\s+sale\s+\d+%\s+discount|final\s+winter\s+blowout\s+sale)",
    "auto_warranty": r"(?:vehicle\s+extended\s+warranty\s+has\s+expired|out\s+of\s+pocket\s+for\s+expensive\s+mechanical)",
    "work_from_home": r"(?:earn\s+\$[\d,]+\s+weekly\s+working\s+from\s+home|remote\s+data\s+entry\s+and\s+review)"
}

TARGETED_BRANDS = [
    {"name": "PayPal", "domains": ["paypal.com"], "keywords": ["paypal"]},
    {"name": "Microsoft", "domains": ["microsoft.com", "office.com", "office365.com", "live.com"], "keywords": ["microsoft", "office 365", "o365", "outlook"]},
    {"name": "Google", "domains": ["google.com", "accounts.google.com"], "keywords": ["google workspace", "google account", "gmail"]},
    {"name": "Apple", "domains": ["apple.com", "icloud.com"], "keywords": ["apple id", "icloud", "apple support"]},
    {"name": "Netflix", "domains": ["netflix.com"], "keywords": ["netflix"]},
    {"name": "Amazon", "domains": ["amazon.com"], "keywords": ["amazon", "prime"]},
    {"name": "Wells Fargo", "domains": ["wellsfargo.com"], "keywords": ["wells fargo"]},
    {"name": "Bank of America", "domains": ["bankofamerica.com", "bofa.com"], "keywords": ["bank of america", "bofa"]},
    {"name": "Chase Bank", "domains": ["chase.com"], "keywords": ["chase bank", "jpmorgan chase"]},
    {"name": "DHL Express", "domains": ["dhl.com", "dhl.de"], "keywords": ["dhl express", "dhl package", "dhl tracking"]},
    {"name": "USPS", "domains": ["usps.com"], "keywords": ["usps delivery", "united states postal service"]},
    {"name": "Coinbase", "domains": ["coinbase.com"], "keywords": ["coinbase wallet", "coinbase"]},
    {"name": "Dropbox", "domains": ["dropbox.com"], "keywords": ["dropbox"]},
    {"name": "IRS", "domains": ["irs.gov"], "keywords": ["internal revenue service", "irs"]}
]

def normalize_text(text: str) -> str:
    """Normalize text by converting to lowercase and stripping extra whitespaces."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_urls(text: str) -> List[str]:
    """Extract all distinct URLs found in given text."""
    if not text:
        return []
    matches = URL_REGEX.findall(text)
    cleaned = []
    for m in matches:
        # Strip trailing punctuation if accidentally captured
        m = re.sub(r'[.,;!?)\]}>]+$', '', m)
        if m and m not in cleaned:
            cleaned.append(m)
    return cleaned

def extract_sender_domain(sender: str) -> str:
    """Extract domain part from sender email address."""
    if not sender:
        return ""
    match = EMAIL_REGEX.search(sender)
    if match:
        full_email = match.group(0)
        parts = full_email.split('@')
        if len(parts) > 1:
            return parts[1].lower().strip()
    # If raw domain or string provided
    if '@' in sender:
        return sender.split('@')[-1].replace('>', '').lower().strip()
    return sender.lower().strip()

def find_suspicious_phrases(text: str) -> Tuple[List[str], List[str]]:
    """Scan text for phishing and spam phrases and return matched keywords."""
    norm = normalize_text(text)
    phishing_found = []
    spam_found = []

    for label, pattern in PHISHING_PATTERNS.items():
        match = re.search(pattern, norm, re.IGNORECASE)
        if match:
            matched_phrase = match.group(0).strip()
            if matched_phrase not in phishing_found:
                phishing_found.append(matched_phrase)

    for label, pattern in SPAM_PATTERNS.items():
        match = re.search(pattern, norm, re.IGNORECASE)
        if match:
            matched_phrase = match.group(0).strip()
            if matched_phrase not in spam_found:
                spam_found.append(matched_phrase)

    return phishing_found, spam_found

def check_brand_impersonation(text: str, sender: str = None) -> List[Dict[str, str]]:
    """
    Detect if message mentions known high-value targets (banks, tech giants)
    while the sender address comes from an untrusted or mismatched domain.
    """
    findings = []
    norm = normalize_text(text)
    sender_domain = extract_sender_domain(sender) if sender else ""
    is_free_mail = any(sender_domain.endswith(free_domain) for free_domain in [
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "protonmail.com"
    ]) if sender_domain else False

    for brand in TARGETED_BRANDS:
        brand_name = brand["name"]
        legit_domains = brand["domains"]
        
        # Check if brand is mentioned
        mentioned = any(kw in norm for kw in brand["keywords"])
        if mentioned:
            if sender_domain:
                # If sender domain does not end with official domain
                is_legit_domain = any(sender_domain == d or sender_domain.endswith('.' + d) for d in legit_domains)
                if not is_legit_domain:
                    reason = f"Email mentions {brand_name}, but sender domain '{sender_domain}' is not an authorized domain ({', '.join(legit_domains)})."
                    if is_free_mail:
                        reason += " Notice: sender is using a public consumer email provider."
                    findings.append({
                        "brand": brand_name,
                        "sender_domain": sender_domain,
                        "reason": reason
                    })
    return findings
