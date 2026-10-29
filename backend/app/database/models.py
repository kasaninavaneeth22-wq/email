import json
import datetime
from typing import Dict, Any, List, Optional, Tuple
from app.database.connection import get_db_connection

def serialize_json(data: Any) -> str:
    """Safely serialize lists/dicts to JSON string."""
    try:
        return json.dumps(data)
    except Exception:
        return "[]"

def deserialize_json(raw: Optional[str]) -> Any:
    """Safely parse JSON string back to python object."""
    if not raw:
        return []
    try:
        return json.loads(raw)
    except Exception:
        return []

def row_to_dict(row) -> Dict[str, Any]:
    """Convert a SQLite row to dict with JSON fields unpacked."""
    d = dict(row)
    d["reasons"] = deserialize_json(d.get("reasons"))
    d["suspicious_keywords"] = deserialize_json(d.get("suspicious_keywords"))
    d["url_findings"] = deserialize_json(d.get("url_findings"))
    d["recommendations"] = deserialize_json(d.get("recommendations"))
    return d

def insert_analysis(data: Dict[str, Any]) -> int:
    """Inserts a new email analysis record and returns the generated primary key id."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO email_analyses (
                sender, subject, body, url_input, classification,
                risk_score, risk_level, confidence, reasons,
                suspicious_keywords, url_findings, recommendations,
                analyzed_at, user_feedback
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("sender"),
            data.get("subject", ""),
            data.get("body", "")[:10000],  # Bound stored text size
            data.get("url_input"),
            data.get("classification", "legitimate"),
            int(data.get("risk_score", 0)),
            data.get("risk_level", "Low"),
            data.get("confidence"),
            serialize_json(data.get("reasons", [])),
            serialize_json(data.get("suspicious_keywords", [])),
            serialize_json(data.get("url_findings", [])),
            serialize_json(data.get("recommendations", [])),
            data.get("analyzed_at", datetime.datetime.now(datetime.timezone.utc).isoformat()),
            None
        ))
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()

def get_analysis_by_id(analysis_id: int) -> Optional[Dict[str, Any]]:
    """Fetches a single analysis record by ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM email_analyses WHERE id = ?", (analysis_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return row_to_dict(row)
    finally:
        conn.close()

def list_analyses(
    page: int = 1,
    page_size: int = 10,
    search: Optional[str] = None,
    classification: Optional[str] = None,
    sort_by: str = "analyzed_at",
    sort_order: str = "desc"
) -> Dict[str, Any]:
    """Retrieves paginated, filtered, and sorted analysis history records."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = "SELECT * FROM email_analyses WHERE 1=1"
        params: List[Any] = []

        if search and search.strip():
            query += " AND (subject LIKE ? OR sender LIKE ? OR body LIKE ?)"
            s = f"%{search.strip()}%"
            params.extend([s, s, s])

        if classification and classification.strip().lower() != "all":
            query += " AND classification = ?"
            params.append(classification.strip().lower())

        # Safe sorting column mapping
        allowed_sort = {
            "analyzed_at": "analyzed_at",
            "risk_score": "risk_score",
            "classification": "classification",
            "subject": "subject"
        }
        col = allowed_sort.get(sort_by, "analyzed_at")
        order = "DESC" if sort_order.lower() == "desc" else "ASC"

        # Count total matches
        count_query = query.replace("SELECT *", "SELECT COUNT(*)", 1)
        cursor.execute(count_query, params)
        total = cursor.fetchone()[0]

        # Add pagination
        query += f" ORDER BY {col} {order} LIMIT ? OFFSET ?"
        offset = max(0, (page - 1) * page_size)
        params.extend([page_size, offset])

        cursor.execute(query, params)
        rows = cursor.fetchall()
        items = [row_to_dict(r) for r in rows]

        total_pages = max(1, (total + page_size - 1) // page_size) if total > 0 else 0

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    finally:
        conn.close()

def delete_analysis_by_id(analysis_id: int) -> bool:
    """Deletes an analysis record by ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM email_analyses WHERE id = ?", (analysis_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()

def clear_all_analyses() -> int:
    """Clears all stored email analysis history."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM user_feedback;")
        cursor.execute("DELETE FROM email_analyses;")
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()

def save_feedback(
    analysis_id: int,
    feedback_type: str,
    suggested_classification: Optional[str] = None,
    comments: Optional[str] = None
) -> bool:
    """Records user feedback and updates status on analysis record."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        cursor.execute("""
            INSERT INTO user_feedback (analysis_id, feedback_type, suggested_classification, comments, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (analysis_id, feedback_type, suggested_classification, comments, now))
        
        # Also update quick feedback indicator on email_analyses table
        cursor.execute("""
            UPDATE email_analyses
            SET user_feedback = ?
            WHERE id = ?
        """, (feedback_type, analysis_id))

        conn.commit()
        return True
    finally:
        conn.close()

def get_dashboard_stats() -> Dict[str, Any]:
    """Aggregates analytical metrics directly from persistent SQLite records."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Total counts by category
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN classification = 'spam' THEN 1 ELSE 0 END) as spam_count,
                SUM(CASE WHEN classification = 'phishing' THEN 1 ELSE 0 END) as phishing_count,
                SUM(CASE WHEN classification = 'legitimate' THEN 1 ELSE 0 END) as legit_count
            FROM email_analyses;
        """)
        row = cursor.fetchone()
        total_analyzed = row[0] or 0
        spam_count = row[1] or 0
        phishing_count = row[2] or 0
        legitimate_count = row[3] or 0

        # Risk level distribution
        cursor.execute("""
            SELECT risk_level, COUNT(*) as cnt
            FROM email_analyses
            GROUP BY risk_level;
        """)
        risk_dist = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        for r in cursor.fetchall():
            lvl = r[0]
            if lvl in risk_dist:
                risk_dist[lvl] = r[1]

        # Recent high risk messages (up to 5)
        cursor.execute("""
            SELECT * FROM email_analyses
            WHERE risk_level IN ('High', 'Critical') OR risk_score >= 60
            ORDER BY analyzed_at DESC
            LIMIT 5;
        """)
        recent_high_risk = [row_to_dict(r) for r in cursor.fetchall()]

        # Trends grouped by day (last 7 recorded days)
        cursor.execute("""
            SELECT 
                substr(analyzed_at, 1, 10) as day,
                SUM(CASE WHEN classification = 'spam' THEN 1 ELSE 0 END) as spam,
                SUM(CASE WHEN classification = 'phishing' THEN 1 ELSE 0 END) as phishing,
                SUM(CASE WHEN classification = 'legitimate' THEN 1 ELSE 0 END) as legitimate
            FROM email_analyses
            GROUP BY day
            ORDER BY day ASC
            LIMIT 14;
        """)
        trend_rows = cursor.fetchall()
        trend_by_date = []
        for tr in trend_rows:
            trend_by_date.append({
                "date": tr[0],
                "spam": tr[1] or 0,
                "phishing": tr[2] or 0,
                "legitimate": tr[3] or 0
            })

        return {
            "total_analyzed": total_analyzed,
            "spam_count": spam_count,
            "phishing_count": phishing_count,
            "legitimate_count": legitimate_count,
            "risk_distribution": risk_dist,
            "recent_high_risk": recent_high_risk,
            "trend_by_date": trend_by_date
        }
    finally:
        conn.close()
