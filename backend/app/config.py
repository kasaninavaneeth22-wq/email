import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    APP_NAME: str = "Email Spam and Phishing Detection System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", str(BASE_DIR / "email_security.db"))
    DATASET_PATH: str = os.getenv("DATASET_PATH", str(DATA_DIR / "train_dataset.csv"))
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(DATA_DIR / "model.joblib"))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

settings = Settings()
