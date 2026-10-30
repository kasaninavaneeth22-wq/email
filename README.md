# Email Spam and Phishing Detection System

An enterprise-grade, explainable cybersecurity web application designed to inspect, analyze, and classify email messages into **Spam Email**, **Phishing Email**, or **Legitimate Email (Ham)**. Engineered for academic presentations, viva demonstrations, and production-like security operations.

---

## 1. Project Overview

Email remains the predominant attack vector for social engineering, identity theft, and corporate network intrusion. Traditional defense systems often fail when adversaries exploit zero-day domains, lookalike characters (homoglyphs), and urgency coercion. Furthermore, black-box AI models fail to explain *why* an email is suspicious.

This system provides:
- **Hybrid Threat Intelligence Engine**: Combines a trained **scikit-learn** TF-IDF machine learning model with deterministic security rules.
- **Deep URL Forensics**: Identifies IP hosts, URL shorteners, brand spoofing in subdomains, and suspicious TLDs locally without visiting malicious links.
- **Explainable Scoring**: Calculates a composite risk score (0–100) mapped to four severity tiers (Low, Medium, High, Critical) with clear rationales.
- **Persistent Audit Logging**: SQLite database with Write-Ahead Logging (WAL) for storing historical audits, telemetry, and user feedback.
- **Cybersecurity Operations Center (SOC) Dashboard**: Visual telemetry with Recharts showing classification distributions, risk severity breakdowns, and timeline trends.

---

## 2. Key Features

- **Interactive Threat Scanner**: Real-time analysis of Sender Address, Subject, Body, and URLs.
- **One-Click Viva Demos**: Pre-loaded simulated demonstration scenarios:
  1. *Phishing*: Simulated PayPal account lockout & credential harvesting.
  2. *Spam*: $1,000 Walmart prize sweepstakes promotion.
  3. *Legitimate*: Academic capstone project review meeting schedule.
- **Local Static URL Forensics**: Fully non-interactive URL parsing (zero network calls, no drive-by download risks).
- **Searchable Audit History**: Filter by threat category, sort by date or risk score, paginate, and inspect full forensic breakdown.
- **Feedback & Model Validation**: Users can flag classifications as correct or incorrect to assist ongoing model refinement.
- **Interactive Academic Documentation**: Built-in viva metadata editor for student names, roll numbers, guide names, and college details.
- **Educational Defense Center**: Best practices guide explaining phishing mechanics, deceptive URL anatomy, and why OTPs/passwords must never be disclosed.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Cyber SaaS theme)
- **Icons**: Lucide React
- **Charts**: Recharts (PieChart, BarChart, AreaChart)
- **Routing**: React Router v7 (`react-router-dom`)

### Backend
- **Framework**: Python 3.11+ with FastAPI
- **Data Validation**: Pydantic v2
- **Server**: Uvicorn with asynchronous ASGI loop
- **Testing**: Pytest & HTTPX TestClient

### Detection & AI Pipeline
- **Machine Learning**: Scikit-Learn (`TfidfVectorizer`, `LogisticRegression` with balanced class weights)
- **Evaluation**: Accuracy: **93.3%**, Precision: **94.4%**, Recall: **93.3%**, F1-Score: **93.3%**
- **Model Serialization**: Joblib (`model.joblib`)
- **Heuristic Engine**: Brand impersonation checks, urgency regex, sensitive credential solicitations, and sender domain matching.

### Database
- **Storage**: SQLite 3 with Write-Ahead Logging (WAL mode)
- **Tables**: `email_analyses` (audit history) and `user_feedback` (validation records)

---

## 4. Project Folder Structure

```
d:\email\
├── backend\
│   ├── app\
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI entrypoint, CORS, lifespan
│   │   ├── config.py                  # Environment and application settings
│   │   ├── api\
│   │   │   ├── __init__.py
│   │   │   └── routes.py              # REST API route handlers
│   │   ├── services\
│   │   │   ├── __init__.py
│   │   │   ├── classifier.py          # Scikit-learn TF-IDF pipeline & evaluation
│   │   │   ├── email_analyzer.py      # Hybrid scoring and explainability engine
│   │   │   └── url_analyzer.py        # Offline static URL forensics
│   │   ├── database\
│   │   │   ├── __init__.py
│   │   │   ├── connection.py          # SQLite connection and migrations
│   │   │   └── models.py              # Database repository and CRUD queries
│   │   ├── schemas\
│   │   │   ├── __init__.py
│   │   │   └── email.py               # Pydantic request/response schemas
│   │   ├── utils\
│   │   │   ├── __init__.py
│   │   │   └── text_processing.py     # Tokenization, brand detection, regex
│   │   └── data\
│   │       ├── train_dataset.csv      # 60 curated emails for model training
│   │       └── model.joblib           # Trained and serialized ML model
│   ├── tests\
│   │   ├── __init__.py
│   │   └── test_api.py                # 11 automated test cases with pytest
│   ├── requirements.txt               # Backend Python dependencies
│   └── run.py                         # Backend startup script
├── frontend\
│   ├── src\
│   │   ├── components\
│   │   │   ├── Navbar.tsx             # Navigation header with health ping
│   │   │   ├── Footer.tsx             # Academic footer & security notice
│   │   │   ├── RiskBadge.tsx          # Threat level and classification badges
│   │   │   ├── StatCard.tsx           # Dashboard metric card
│   │   │   └── ConfirmModal.tsx       # Deletion confirmation modal
│   │   ├── pages\
│   │   │   ├── LandingPage.tsx        # Hero, features, and workflow
│   │   │   ├── DashboardPage.tsx      # Telemetry, distribution charts, trends
│   │   │   ├── AnalyzerPage.tsx       # Threat scanner with viva demo presets
│   │   │   ├── HistoryPage.tsx        # Searchable audit table with pagination
│   │   │   ├── HistoryDetailPage.tsx  # Forensic drilldown report
│   │   │   ├── SecurityInfoPage.tsx   # Educational security guide
│   │   │   └── AboutPage.tsx          # Academic information with editable fields
│   │   ├── services\
│   │   │   └── api.ts                 # Centralized API service
│   │   ├── types\
│   │   │   └── index.ts               # TypeScript interface definitions
│   │   ├── App.tsx                    # React router routes
│   │   ├── main.tsx                   # React root entry point
│   │   └── index.css                  # Cyber dark theme styles
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript compiler settings
│   ├── vite.config.ts                 # Vite bundler & reverse proxy config
│   └── tailwind.config.js             # Tailwind CSS theme configuration
├── seed_database.py                   # Script to populate SQLite with demo records
├── start_backend.bat                  # One-click Windows backend launcher
├── start_frontend.bat                 # One-click Windows frontend launcher
├── start_all.bat                      # One-click dual server launcher
├── .env.example                       # Environment configuration template
└── README.md                          # Comprehensive documentation
```

---

## 5. How Classification Works

The system implements an explainable **hybrid multi-stage pipeline**:

```
                       Incoming Email
           (Sender, Subject, Body, Extracted URLs)
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ Natural Language ]             [ Static Heuristics ]
    TF-IDF Vectorizer                 - Brand Impersonation
    Logistic Regression               - Urgent Coercion Language
    Class Probabilities               - Credential Solicitations
   (Spam vs Phish vs Ham)             - Sender Domain Mismatch
            │                                 │
            └────────────────┬────────────────┘
                             ▼
                 [ Static URL Forensics ]
                  - Raw IP address links
                  - Known URL shorteners
                  - High-risk / disposable TLDs
                  - Subdomain brand cloaking
                             │
                             ▼
            [ Composite Risk Score (0-100) ]
            Low (0-29)  | Medium (30-54)
            High (55-79)| Critical (80-100)
                             │
                             ▼
            [ Final Threat Categorization ]
                 Spam | Phishing | Ham
```

### Risk Scoring Matrix
- **Statistical Base Score**: Up to 45 points derived from ML probabilities.
- **Credential Solicitations**: +20 points (requests for password, PIN, OTP, SSN, seed phrase).
- **Phishing Heuristic Signatures**: +15 to +30 points for urgent deadlines ("within 24 hours", "account suspended").
- **High-Risk URL Findings**: +25 to +35 points for raw IP addresses, shorteners, or abused TLDs.
- **Brand Impersonation**: +25 points when an email claims to be PayPal, Microsoft, or a Bank, but the sender domain does not match.

---

## 6. Installation & Setup Instructions

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: v18 or higher (tested on v24)
- **NPM**: v9 or higher

### Option A: One-Click Startup (Windows)
Double-click `start_all.bat` in the root directory. This will automatically open two terminal windows:
1. Backend API on `http://127.0.0.1:8000`
2. Frontend UI on `http://localhost:5173`

---

### Option B: Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# On Windows (Command Prompt / PowerShell):
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend tests
python -m pytest tests -v

# Start backend server
```
Backend API will be accessible at:
- **API URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/health`

#### 2. Seed Initial Database (Optional)
In a separate terminal:
```bash
backend\venv\Scripts\python seed_database.py
```

#### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser and navigate to:
- **Web App**: `http://localhost:5173`

---

## 7. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, ML model status, and evaluation metrics |
| `POST` | `/api/analyze` | Analyzes email subject, body, sender, and URLs; saves to SQLite |
| `GET` | `/api/history` | Paginated, filterable, and searchable analysis history |
| `GET` | `/api/history/{id}` | Detailed forensic record by ID |
| `DELETE` | `/api/history/{id}` | Deletes a specific audit record |
| `DELETE` | `/api/history` | Clears all audit records from database |
| `POST` | `/api/feedback` | Records user accuracy feedback for model evaluation |
| `GET` | `/api/dashboard/stats` | Telemetry metrics, distribution data, and trend aggregates |

---

## 8. Automated Testing

The project includes an automated test suite verifying edge cases, invalid inputs, ML inference, URL forensics, database persistence, and feedback:

```bash
# Run pytest from the backend directory
cd backend
venv\Scripts\python -m pytest tests -v
```

**Test Coverage Summary:**
- `test_health_check`: Validates API health and model availability.
- `test_analyze_legitimate_email`: Verifies academic/business email results in Low risk.
- `test_analyze_phishing_email`: Verifies credential theft & IP URLs result in High/Critical risk.
- `test_analyze_spam_email`: Verifies sweepstakes and miracle cure emails trigger Spam class.
- `test_url_analyzer_local_heuristics`: Tests raw IP addresses, shorteners, and brand spoofing.
- `test_validation_errors`: Asserts 422 Unprocessable Entity on empty or malformed inputs.
- `test_history_and_pagination`: Tests pagination and search filtering.
- `test_get_analysis_detail`: Tests fetching single record forensic breakdown.
- `test_feedback_submission`: Validates model feedback storage.
- `test_dashboard_stats`: Validates SQLite statistical aggregations.
- `test_delete_single_and_clear_history`: Tests record deletion and audit trail purge.

---

## 9. Security & Privacy Considerations

- **Untrusted Input Sanitation**: All email content and URLs are treated as untrusted strings. Input length bounds prevent buffer exhaustion or DOS.
- **Zero-Network URL Analysis**: URLs submitted or extracted from text are analyzed exclusively via static string and syntax parsing. The server **never** connects to or downloads payloads from target URLs.
- **Zero Credential Collection**: The application does not store email passwords, API keys, or mail server credentials.
- **No Browser Injection**: Output fields use standard React text nodes rather than `dangerouslySetInnerHTML`, eliminating XSS vectors.

---

## 10. Academic Project Information

- **Degree**: Bachelor of Technology (B.Tech)
- **Domain**: Cybersecurity / Machine Learning / Full-Stack Web Engineering
- **Configurable Academic Details**: Visit the **About Project** page (`/about`) and click **"Edit Placeholders"** to customize your Institution Name, Department, Academic Year, Project Guide Name, and Team Member details for your viva presentation.

---

## 11. Limitations & Future Scope

### Current Limitations
1. Encrypted email formats (PGP, S/MIME) cannot be inspected without recipient keys.
2. Static URL inspection cannot detect dynamic payload cloaking activated post-inspection.
3. Password-protected ZIP or PDF attachments cannot be examined via body text parsing.

### Future Enhancements
1. Integrating contextual Large Language Model (LLM) embeddings (e.g. RoBERTa or DeBERTa).
2. Deep file attachment disassembler for macros and embedded PDF scripts.
3. Live SPF, DKIM, and DMARC cryptographic email header verification.
4. Browser extension to analyze emails directly inside webmail clients (Gmail, Outlook).

