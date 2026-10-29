import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.database.connection import init_db
from app.services.classifier import classifier_service
from app.services.email_analyzer import email_analyzer
from app.database import models

def seed():
    print("Initializing database and classifier...")
    init_db()
    classifier_service.initialize()

    # Predefined realistic seed emails
    sample_emails = [
        {
            "sender": "support@paypal-security-alert.xyz",
            "subject": "URGENT: Your PayPal Account Has Been Temporarily Suspended",
            "body": "Dear customer, we detected unauthorized login attempts on your PayPal account. You must verify your identity immediately or your account will be permanently closed. Please click the link below to confirm your password and billing credentials: http://192.168.1.100/paypal-verify. Action required within 24 hours.",
            "url_input": "http://192.168.1.100/paypal-verify"
        },
        {
            "sender": "rewards@super-deals-sweepstakes.net",
            "subject": "Congratulations! You Have Won a $1,000 Walmart Gift Card",
            "body": "Dear Winner, Your email address was selected in our monthly shopper sweepstakes! You are eligible to receive a complimentary $1,000 Walmart Gift Card today. Click here to claim your exclusive prize before it expires: http://super-deals-rewards.com/claim-card. No purchase necessary!",
            "url_input": "http://super-deals-rewards.com/claim-card"
        },
        {
            "sender": "prof.sharma@university.edu",
            "subject": "Capstone Project Review Meeting Agenda - Thursday at 3:00 PM",
            "body": "Hi team, Please find attached the agenda for our upcoming capstone project review scheduled for Thursday at 3:00 PM in Seminar Hall B. We will go through the frontend components, API performance, and machine learning evaluation metrics. Push your commits by noon. Best regards, Dr. K. Sharma.",
            "url_input": "https://university.edu/student-portal"
        },
        {
            "sender": "alerts@micros0ft-login-auth.com",
            "subject": "Security Alert: Office 365 Password Expiration Notice",
            "body": "Your Microsoft 365 corporate password is set to expire in 24 hours. To retain access to your mailbox and company files without disruption, verify your credentials here: https://micros0ft-login-auth.com/renew. Failure to renew will result in account termination.",
            "url_input": "https://micros0ft-login-auth.com/renew"
        },
        {
            "sender": "crypto-yield@high-roi-invest.com",
            "subject": "Double Your Bitcoin in 24 Hours! Guaranteed High Yield Crypto",
            "body": "Discover the automated algorithmic trading bot that guarantees 500% weekly return on your cryptocurrency investment. Over 10,000 members making passive income daily. Deposit as low as $100 today: http://crypto-mega-yield-invest.com/start.",
            "url_input": "http://crypto-mega-yield-invest.com/start"
        },
        {
            "sender": "noreply@github.com",
            "subject": "[GitHub] Pull request #42 opened: Add SQLite database repository",
            "body": "User alex-dev opened pull request #42 'Add SQLite database repository and indexes' on repository email-security-system. You can review the code changes and merge on GitHub at https://github.com/project/pulls/42.",
            "url_input": "https://github.com/project/pulls/42"
        },
        {
            "sender": "admin@dhl-tracking-express-customs.link",
            "subject": "DHL Express: Package On Hold - Incomplete Delivery Address",
            "body": "Your parcel #DHL-894726-US cannot be delivered due to missing apartment details and unpaid custom duties of $2.45. Update your delivery address and credit card information at http://dhl-tracking-express-customs.link/pay to avoid return to sender.",
            "url_input": "http://dhl-tracking-express-customs.link/pay"
        },
        {
            "sender": "wellness@miracle-keto-burn-fast.com",
            "subject": "LOSE 20 LBS IN 2 WEEKS! Miracle Weight Loss Pill As Seen on TV",
            "body": "Revolutionary keto breakthrough melting belly fat while you sleep! Doctor recommended formula with 100% natural ingredients. Special 70% discount for today only. Order now: http://miracle-keto-burn-fast.com/order.",
            "url_input": "http://miracle-keto-burn-fast.com/order"
        },
        {
            "sender": "academics@university.edu",
            "subject": "University Semester Fee Payment Receipt and Acknowledgement",
            "body": "Dear Student, Your tuition fee payment of INR 45,000 for the Fall 2026 academic semester has been successfully processed. The transaction reference number is TXN-99382109. You can download the official stamped receipt by logging into the student ERP portal.",
            "url_input": "https://studenterp.university.edu/receipts"
        },
        {
            "sender": "security@bankofamerica-fraud-response.top",
            "subject": "Bank of America: Immediate Action Required - Verify Your Card",
            "body": "Our fraud prevention algorithm flagged a pending international transfer of $850.00. Enter your one-time passcode (OTP) and card security code (CVV) here to stop the transaction: http://bankofamerica-fraud-response.top/verify.",
            "url_input": "http://bankofamerica-fraud-response.top/verify"
        }
    ]

    print(f"Seeding {len(sample_emails)} sample analyses...")
    for item in sample_emails:
        res = email_analyzer.analyze(
            subject=item["subject"],
            body=item["body"],
            sender=item["sender"],
            url_input=item["url_input"]
        )
        rec_id = models.insert_analysis({
            "sender": res["sender"],
            "subject": res["subject"],
            "body": item["body"],
            "url_input": item["url_input"],
            "classification": res["classification"],
            "risk_score": res["risk_score"],
            "risk_level": res["risk_level"],
            "confidence": res["confidence"],
            "reasons": res["reasons"],
            "suspicious_keywords": res["suspicious_keywords"],
            "url_findings": res["url_findings"],
            "recommendations": res["recommendations"],
            "analyzed_at": res["analyzed_at"]
        })
        print(f"Inserted ID #{rec_id}: [{res['classification'].upper()}] - {res['subject'][:40]} (Score: {res['risk_score']})")

    stats = models.get_dashboard_stats()
    print("\nDatabase seeded successfully!")
    print(f"Total Analyzed: {stats['total_analyzed']}")
    print(f"Phishing: {stats['phishing_count']} | Spam: {stats['spam_count']} | Legitimate: {stats['legitimate_count']}")

if __name__ == "__main__":
    seed()

