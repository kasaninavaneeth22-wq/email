import re
import urllib.parse
from typing import Dict, Any, List

SUSPICIOUS_TLDS = {
    "xyz", "top", "click", "tk", "ml", "ga", "cf", "gq", "cc", "club", 
    "work", "online", "site", "vip", "link", "info", "buzz", "rest", "fit", "surf"
}

KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "t.co", "is.gd", 
    "buff.ly", "adf.ly", "bit.do", "cutt.ly", "rebrand.ly", "rb.gy"
}

POPULAR_BRANDS_SUBSTR = [
    "paypal", "netflix", "microsoft", "apple", "amazon", "google", 
    "bankofamerica", "chase", "wellsfargo", "dhl", "usps", "coinbase", "docusign"
]

IPV4_PATTERN = re.compile(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::\d+)?$')

def analyze_url(url: str, sender_domain: str = None) -> Dict[str, Any]:
    """
    Performs purely local, non-interactive static security analysis on a URL.
    Never connects, visits, or downloads from the URL.
    Returns detected risk indicators and explainable points.
    """
    findings = {
        "url": url,
        "domain": "",
        "is_ip_address": False,
        "is_shortener": False,
        "is_suspicious_tld": False,
        "has_brand_spoof": False,
        "is_http": False,
        "is_punycode_or_encoded": False,
        "excessive_subdomains": False,
        "suspicious_port": False,
        "domain_mismatch": False,
        "risk_points": 0,
        "indicators": []
    }

    # Ensure protocol for urllib parsing
    target = url.strip()
    if not (target.startswith("http://") or target.startswith("https://")):
        target_parsed = urllib.parse.urlparse("http://" + target)
    else:
        target_parsed = urllib.parse.urlparse(target)

    # 1. Scheme check (HTTP vs HTTPS)
    if url.strip().startswith("http://"):
        findings["is_http"] = True
        findings["risk_points"] += 10
        findings["indicators"].append("Uses insecure plaintext HTTP protocol instead of HTTPS encryption.")
    elif not url.strip().startswith("https://") and not url.strip().startswith("http://"):
        findings["indicators"].append("Missing explicit secure HTTPS protocol scheme.")

    netloc = target_parsed.netloc.lower()
    # Strip port if present for domain analysis
    host = netloc.split(":")[0]
    port = netloc.split(":")[1] if ":" in netloc else None
    findings["domain"] = host

    # 2. Unusual port check
    if port and port not in ["80", "443"]:
        findings["suspicious_port"] = True
        findings["risk_points"] += 15
        findings["indicators"].append(f"Connects through a non-standard port (:{port}), which is commonly associated with unauthorized proxy or phishing servers.")

    # 3. IP address host check
    if IPV4_PATTERN.match(host):
        findings["is_ip_address"] = True
        findings["risk_points"] += 35
        findings["indicators"].append(f"Host '{host}' is a raw IP address rather than a registered domain name. Legitimate corporate services rarely use direct IP links.")

    # 4. Known URL Shortener check
    if host in KNOWN_SHORTENERS:
        findings["is_shortener"] = True
        findings["risk_points"] += 15
        findings["indicators"].append(f"Uses a link shortening service ({host}) that obscures the actual destination server.")

    # Domain parts analysis
    parts = host.split('.')
    if len(parts) >= 2 and not findings["is_ip_address"]:
        tld = parts[-1]
        
        # 5. Suspicious / Abused TLD check
        if tld in SUSPICIOUS_TLDS:
            findings["is_suspicious_tld"] = True
            findings["risk_points"] += 20
            findings["indicators"].append(f"Registered under high-risk top-level domain '.{tld}', frequently exploited for temporary disposable phishing campaigns.")

        # 6. Excessive subdomains (deep nesting, e.g. login.secure.bank.verification.domain.com)
        if len(parts) > 3:
            findings["excessive_subdomains"] = True
            findings["risk_points"] += 15
            findings["indicators"].append(f"Deeply nested subdomain structure ({len(parts)} levels) often used to conceal real root domain identity.")

        # 7. Brand spoofing / Misleading subdomains
        # Check if a known brand keyword appears in host, but not in root domain
        # Example: paypal.com.security-verify.xyz (root is security-verify.xyz, but paypal is present)
        root_domain = f"{parts[-2]}.{parts[-1]}"
        for brand in POPULAR_BRANDS_SUBSTR:
            if brand in host:
                # If brand is in the subdomain or hyphenated string but not the authentic official company
                is_authentic = (host == f"{brand}.com" or host.endswith(f".{brand}.com") or 
                                host == f"{brand}.org" or host.endswith(f".{brand}.org") or
                                host == f"{brand}.gov" or host.endswith(f".{brand}.gov"))
                if not is_authentic:
                    findings["has_brand_spoof"] = True
                    findings["risk_points"] += 30
                    findings["indicators"].append(f"Host '{host}' contains brand name '{brand.capitalize()}' on an unverified domain, indicative of brand impersonation.")
                    break

    # 8. Suspicious URL encoding / Punycode (e.g. xn--, %20, %2f obfuscation)
    if "xn--" in host:
        findings["is_punycode_or_encoded"] = True
        findings["risk_points"] += 25
        findings["indicators"].append("Punycode (IDN homograph) detected in hostname, which can visually mimic legitimate character glyphs.")
    
    if "%" in target_parsed.path or "%" in target_parsed.query:
        if target_parsed.path.count("%") > 3 or target_parsed.query.count("%") > 5:
            findings["is_punycode_or_encoded"] = True
            findings["risk_points"] += 10
            findings["indicators"].append("Excessive hexadecimal URL percent-encoding detected, often utilized to evade simple signature filters.")

    # 9. Domain mismatch between sender and URL
    if sender_domain and host and not findings["is_shortener"] and not findings["is_ip_address"]:
        clean_sender_domain = sender_domain.lower().strip()
        # If both are distinct non-empty domains
        if clean_sender_domain and host:
            # Check if neither is subdomain of the other
            if (host != clean_sender_domain and 
                not host.endswith("." + clean_sender_domain) and 
                not clean_sender_domain.endswith("." + host)):
                # If email claims to be official from sender but links elsewhere
                findings["domain_mismatch"] = True
                findings["risk_points"] += 15
                findings["indicators"].append(f"Destination domain '{host}' does not match sender domain '{clean_sender_domain}'.")

    # Cap risk points at 100
    findings["risk_points"] = min(100, findings["risk_points"])

    return findings

def batch_analyze_urls(urls: List[str], sender_domain: str = None) -> List[Dict[str, Any]]:
    """Analyzes a list of URLs and returns unique findings."""
    results = []
    seen = set()
    for u in urls:
        clean = u.strip()
        if clean and clean not in seen:
            seen.add(clean)
            results.append(analyze_url(clean, sender_domain))
    return results
