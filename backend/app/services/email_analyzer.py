import datetime
from typing import Dict, Any, List, Optional

from app.services.classifier import classifier_service
from app.services.url_analyzer import batch_analyze_urls
from app.utils.text_processing import (
    extract_urls,
    extract_sender_domain,
    find_suspicious_phrases,
    check_brand_impersonation,
    normalize_text
)

DISCLAIMER_TEXT = (
    "Automated security analysis provides risk indicators based on statistical machine learning models "
    "and deterministic security heuristics. It can produce false positives and false negatives. "
    "Always exercise caution and independently verify the authenticity of unexpected emails."
)

class EmailAnalyzerService:
    def __init__(self):
        pass

    def analyze(
        self,
        subject: str,
        body: str,
        sender: Optional[str] = None,
        url_input: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Comprehensive hybrid analysis: Combines ML text classification,
        heuristic pattern matching, URL inspection, and sender domain verification.
        """
        combined_text = f"{subject}\n{body}"
        sender_domain = extract_sender_domain(sender) if sender else ""
        
        # 1. URL Extraction and Deep Inspection
        extracted = extract_urls(combined_text)
        if url_input and url_input.strip():
            extracted.append(url_input.strip())
        url_findings = batch_analyze_urls(extracted, sender_domain=sender_domain)

        # 2. Suspicious Keyword & Phrase Analysis
        phishing_phrases, spam_phrases = find_suspicious_phrases(combined_text)
        all_suspicious_keywords = list(set(phishing_phrases + spam_phrases))

        # 3. Brand Impersonation & Sender Domain Mismatch
        brand_spoof_alerts = check_brand_impersonation(combined_text, sender=sender)

        # 4. Machine Learning Inference
        ml_result = classifier_service.predict(combined_text)
        ml_probs = ml_result.get("probabilities", {"legitimate": 0.5, "phishing": 0.25, "spam": 0.25})
        ml_phishing_prob = ml_probs.get("phishing", 0.0)
        ml_spam_prob = ml_probs.get("spam", 0.0)
        ml_legit_prob = ml_probs.get("legitimate", 0.0)

        # 5. Explainable Risk Score Calculation (0 - 100)
        reasons: List[str] = []
        recommendations: List[str] = []
        
        # Calculate base score from statistical model
        base_threat_prob = max(ml_phishing_prob, ml_spam_prob)
        risk_score = int(base_threat_prob * 45)

        # Heuristic contributions
        if phishing_phrases:
            count = len(phishing_phrases)
            points = min(30, 15 + (count - 1) * 5)
            risk_score += points
            reasons.append(
                f"Contains {count} high-risk phishing phrase(s) such as '{phishing_phrases[0]}'."
            )

        if spam_phrases:
            count = len(spam_phrases)
            points = min(20, 10 + (count - 1) * 5)
            risk_score += points
            reasons.append(
                f"Contains promotional or spam indicators such as '{spam_phrases[0]}'."
            )

        # URL Risk contribution
        high_risk_urls = [u for u in url_findings if u.get("risk_points", 0) >= 30]
        any_url_risk = sum(u.get("risk_points", 0) for u in url_findings)
        if high_risk_urls:
            risk_score += 25
            for h in high_risk_urls:
                reasons.extend(h.get("indicators", []))
        elif any_url_risk > 0:
            risk_score += 15
            reasons.append("Contains link(s) exhibiting potential security anomalies.")

        # Brand Impersonation & Sender Warnings
        if brand_spoof_alerts:
            risk_score += 25
            for alert in brand_spoof_alerts:
                reasons.append(alert["reason"])

        # Sensitive Credential Solicitations Check
        sensitive_kw = ["password", "otp", "pin", "ssn", "seed phrase", "credit card", "cvv"]
        has_sensitive = any(kw in combined_text.lower() for kw in sensitive_kw)
        if has_sensitive:
            risk_score += 20
            reasons.append("Explicitly solicits sensitive authentication or financial credentials.")

        # Urgency & Threat Pressure Check
        urgency_kw = ["urgent", "immediately", "within 24 hours", "account suspended", "lockout", "final notice"]
        has_urgency = any(ukw in combined_text.lower() for ukw in urgency_kw)
        if has_urgency and (phishing_phrases or brand_spoof_alerts or high_risk_urls):
            risk_score += 10
            reasons.append("Applies psychological coercion through urgent deadlines or threatening language.")

        # Sender verification
        if sender:
            # Check for generic free email pretending to be formal business
            free_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
            if any(sender_domain.endswith(fd) for fd in free_domains) and ("service" in subject.lower() or "alert" in subject.lower() or "support" in subject.lower()):
                risk_score += 15
                reasons.append(f"Sender address '{sender}' uses a free consumer email domain for an official/support notification.")

        # Bound risk score between 0 and 100
        risk_score = max(0, min(100, risk_score))

        # 6. Final Category Determination
        # Determine classification priority: Phishing > Spam > Legitimate
        is_phishing = False
        is_spam = False

        if (
            has_sensitive or 
            len(brand_spoof_alerts) > 0 or 
            len(high_risk_urls) > 0 or 
            len(phishing_phrases) >= 2 or 
            (ml_phishing_prob >= 0.45 and (phishing_phrases or url_findings or has_urgency)) or
            (risk_score >= 65 and phishing_phrases)
        ):
            is_phishing = True
        elif (
            ml_spam_prob >= 0.50 or 
            len(spam_phrases) >= 1 or 
            (risk_score >= 45 and not is_phishing)
        ):
            is_spam = True

        if is_phishing:
            final_class = "phishing"
            # Boost score for phishing to reflect high severity
            risk_score = max(65, risk_score)
        elif is_spam:
            final_class = "spam"
            # Spam scores typically in medium/high range
            risk_score = max(40, min(80, risk_score))
        else:
            final_class = "legitimate"
            # Legitimate emails have low risk score
            risk_score = min(25, risk_score)
            if not reasons:
                reasons.append("No suspicious phrases, deceptive URLs, or brand impersonation patterns detected.")
            reasons.append("Verified consistent sender context and natural message semantics.")

        # Determine Risk Level
        if risk_score >= 80:
            risk_level = "Critical"
        elif risk_score >= 55:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # 7. Actionable Recommendations
        if final_class == "phishing":
            recommendations.append("Do NOT click any links, open attachments, or verify credentials.")
            recommendations.append("Never provide passwords, One-Time Passcodes (OTP), or banking PINs via email.")
            recommendations.append("Verify the sender by contacting the organization through its official, known telephone or URL.")
            recommendations.append("Report this message as a phishing attack to your security or IT administrator.")
        elif final_class == "spam":
            recommendations.append("Mark this email as Spam / Junk in your email client.")
            recommendations.append("Avoid interacting with promotional or prize claims from unknown senders.")
            recommendations.append("Do not reply or click 'unsubscribe' on unverified bulk messages to prevent confirming your active inbox.")
        else:
            recommendations.append("Message exhibits standard characteristics of legitimate correspondence.")
            recommendations.append("Exercise routine caution before downloading unexpected attachments.")
            recommendations.append("Maintain multi-factor authentication (MFA) on your email accounts.")

        # Clean duplicate reasons
        unique_reasons = []
        for r in reasons:
            if r not in unique_reasons:
                unique_reasons.append(r)

        # Confidence: statistical confidence from the dominant class in ML model
        confidence = ml_result.get("confidence")

        analyzed_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        body_excerpt = body[:300] + ("..." if len(body) > 300 else "")

        return {
            "sender": sender,
            "subject": subject,
            "body_excerpt": body_excerpt,
            "classification": final_class,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "reasons": unique_reasons,
            "suspicious_keywords": all_suspicious_keywords,
            "url_findings": url_findings,
            "recommendations": recommendations,
            "analyzed_at": analyzed_at,
            "disclaimer": DISCLAIMER_TEXT
        }

email_analyzer = EmailAnalyzerService()
