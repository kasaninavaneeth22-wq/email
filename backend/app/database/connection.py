import sqlite3
import os
import json
import logging
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)

def get_db_connection() -> sqlite3.Connection:
    """Creates a thread-safe connection to the SQLite SQL database with row factory."""
    db_path = settings.DATABASE_PATH
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path, timeout=10.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode for high concurrency and performance
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    """Initializes SQL database tables and indexes from schema.sql."""
    conn = get_db_connection()
    try:
        schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
        if os.path.exists(schema_file):
            with open(schema_file, "r", encoding="utf-8") as f:
                conn.executescript(f.read())
            logger.info(f"Database schema executed from {schema_file}")
        else:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS email_analyses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender TEXT,
                    subject TEXT NOT NULL,
                    body TEXT NOT NULL,
                    url_input TEXT,
                    classification TEXT NOT NULL,
                    risk_score INTEGER NOT NULL,
                    risk_level TEXT NOT NULL,
                    confidence REAL,
                    reasons TEXT NOT NULL,
                    suspicious_keywords TEXT NOT NULL,
                    url_findings TEXT NOT NULL,
                    recommendations TEXT NOT NULL,
                    analyzed_at TEXT NOT NULL,
                    user_feedback TEXT
                );
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    analysis_id INTEGER NOT NULL,
                    feedback_type TEXT NOT NULL,
                    suggested_classification TEXT,
                    comments TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (analysis_id) REFERENCES email_analyses (id) ON DELETE CASCADE
                );
            """)
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_analyses_created ON email_analyses(analyzed_at DESC);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_analyses_classification ON email_analyses(classification);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_analyses_risk ON email_analyses(risk_score DESC);")

        conn.commit()
        logger.info(f"SQL Database initialized successfully at {settings.DATABASE_PATH}")
    finally:
        conn.close()
