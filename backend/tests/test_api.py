import os
import pytest
from fastapi.testclient import TestClient

# Set temporary test database
os.environ["DATABASE_PATH"] = "test_email_security.db"

from app.main import app
from app.database.connection import init_db
from app.services.url_analyzer import analyze_url
from app.services.classifier import classifier_service

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    # Initialize DB and ML model
    init_db()
    classifier_service.initialize()
    yield
    # Cleanup test database file after session
    if os.path.exists("test_email_security.db"):
        try:
            os.remove("test_email_security.db")
        except Exception:
            pass

def test_health_check():
    """Verify health endpoint returns status and classifier metrics."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "classifier" in data
    assert data["classifier"]["is_trained"] is True

def test_analyze_legitimate_email():
    """Verify legitimate college email is categorized as legitimate with low risk score."""
    payload = {
        "sender": "rahul.faculty@university.edu",
        "subject": "Capstone Project Review Schedule - Room 302",
        "body": "Hi team, please find attached the schedule for our capstone presentation tomorrow at 3 PM in Room 302. Please ensure your slide deck is uploaded.",
        "url_input": "https://university.edu/portal"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["classification"] == "legitimate"
    assert data["risk_score"] < 40
    assert data["risk_level"] == "Low"
    assert "disclaimer" in data
    assert data["id"] is not None

def test_analyze_phishing_email():
    """Verify phishing email with credential theft and urgent threat triggers high risk and phishing class."""
    payload = {
        "sender": "support@paypal-security-alert.xyz",
        "subject": "URGENT: Your PayPal Account Has Been Suspended",
        "body": "Dear customer, we detected unauthorized login attempts. You must verify your identity immediately or your account will be permanently closed. Confirm your password and credit card number at the link below within 24 hours.",
        "url_input": "http://192.168.1.105/paypal-auth/login.php"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["classification"] == "phishing"
    assert data["risk_score"] >= 65
    assert data["risk_level"] in ["High", "Critical"]
    assert len(data["reasons"]) > 0
    assert len(data["suspicious_keywords"]) > 0
    # URL findings check
    assert len(data["url_findings"]) > 0
    assert any(u["is_ip_address"] for u in data["url_findings"])

def test_analyze_spam_email():
    """Verify promotional sweepstakes spam email triggers spam classification."""
    payload = {
        "sender": "promotions@mega-prizes-global.net",
        "subject": "Congratulations! You won a $1,000 Walmart Gift Card",
        "body": "Dear lucky shopper, you have won a complimentary $1000 Walmart gift card! Claim your prize now with no purchase necessary. Limited offer only for today.",
        "url_input": "http://super-deals-rewards.com/claim-card"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["classification"] == "spam"
    assert data["risk_score"] >= 40
    assert len(data["reasons"]) > 0

def test_url_analyzer_local_heuristics():
    """Verify URL analyzer detects IP host, shorteners, insecure HTTP, and abused TLDs."""
    # Test raw IP address
    ip_result = analyze_url("http://45.33.32.156/bank-login")
    assert ip_result["is_ip_address"] is True
    assert ip_result["is_http"] is True
    assert ip_result["risk_points"] >= 40

    # Test shortener
    shortener_result = analyze_url("https://bit.ly/my-secret-link")
    assert shortener_result["is_shortener"] is True

    # Test suspicious TLD
    tld_result = analyze_url("https://security-account-update.xyz")
    assert tld_result["is_suspicious_tld"] is True

    # Test brand spoofing in subdomain
    brand_spoof_result = analyze_url("https://paypal.com.verify-identity.top/auth")
    assert brand_spoof_result["has_brand_spoof"] is True

def test_validation_errors():
    """Verify missing required fields triggers 422 Unprocessable Entity."""
    # Empty subject and body
    response = client.post("/api/analyze", json={"subject": "", "body": ""})
    assert response.status_code == 422

def test_history_and_pagination():
    """Verify history listing returns records with pagination."""
    response = client.get("/api/history?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 3

def test_get_analysis_detail():
    """Verify fetching single record detail."""
    # Create an analysis record
    res = client.post("/api/analyze", json={
        "subject": "Meeting notes",
        "body": "Here are the notes from our discussion yesterday."
    })
    rec_id = res.json()["id"]

    detail_res = client.get(f"/api/history/{rec_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == rec_id

def test_feedback_submission():
    """Verify submitting user feedback on classification."""
    # Create record
    res = client.post("/api/analyze", json={
        "subject": "Doctor Appointment Reminder",
        "body": "Reminder of dental checkup tomorrow at 4:30 PM."
    })
    rec_id = res.json()["id"]

    fb_res = client.post("/api/feedback", json={
        "analysis_id": rec_id,
        "feedback_type": "correct",
        "suggested_classification": "legitimate",
        "comments": "Properly recognized as legitimate clinic reminder."
    })
    assert fb_res.status_code == 200
    assert fb_res.json()["success"] is True

def test_dashboard_stats():
    """Verify dashboard stats aggregate from real database records."""
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_analyzed"] >= 3
    assert stats["spam_count"] >= 1
    assert stats["phishing_count"] >= 1
    assert stats["legitimate_count"] >= 1
    assert "risk_distribution" in stats
    assert "trend_by_date" in stats

def test_delete_single_and_clear_history():
    """Verify deletion of a record and clearing history."""
    # Create a record to delete
    res = client.post("/api/analyze", json={
        "subject": "Temporary disposable test",
        "body": "This record will be deleted."
    })
    rec_id = res.json()["id"]

    del_res = client.delete(f"/api/history/{rec_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Check that deleted record returns 404
    not_found = client.get(f"/api/history/{rec_id}")
    assert not_found.status_code == 404
