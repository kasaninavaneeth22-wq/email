from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.email import (
    EmailAnalysisRequest,
    EmailAnalysisResponse,
    FeedbackRequest,
    FeedbackResponse,
    HistoryListResponse,
    HistoryItem,
    DashboardStatsResponse
)
from app.services.email_analyzer import email_analyzer
from app.services.classifier import classifier_service
from app.database import models

router = APIRouter()

@router.get("/health", tags=["System"])
def health_check():
    """Returns application status, machine learning model details, and DB health."""
    return {
        "status": "healthy",
        "service": "Email Spam and Phishing Detection System",
        "classifier": {
            "is_trained": classifier_service.is_trained,
            "metrics": classifier_service.evaluation_metrics
        }
    }

@router.post("/analyze", response_model=EmailAnalysisResponse, status_code=status.HTTP_201_CREATED, tags=["Analysis"])
def analyze_email(payload: EmailAnalysisRequest):
    """
    Analyzes an email for spam and phishing characteristics, calculates an explainable
    risk score, stores the record in SQLite database, and returns the classification.
    """
    # 1. Execute detection analysis
    result = email_analyzer.analyze(
        subject=payload.subject,
        body=payload.body,
        sender=payload.sender,
        url_input=payload.url_input
    )

    # 2. Persist analysis to database
    record_id = models.insert_analysis({
        "sender": result["sender"],
        "subject": result["subject"],
        "body": payload.body,
        "url_input": payload.url_input,
        "classification": result["classification"],
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "confidence": result["confidence"],
        "reasons": result["reasons"],
        "suspicious_keywords": result["suspicious_keywords"],
        "url_findings": result["url_findings"],
        "recommendations": result["recommendations"],
        "analyzed_at": result["analyzed_at"]
    })

    result["id"] = record_id
    return result

@router.get("/history", response_model=HistoryListResponse, tags=["History"])
def get_history(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term across subject, sender, or body"),
    classification: Optional[str] = Query(None, description="Filter: 'spam', 'phishing', 'legitimate', or 'all'"),
    sort_by: str = Query("analyzed_at", description="Field to sort by: analyzed_at, risk_score, classification"),
    sort_order: str = Query("desc", description="Sort order: 'asc' or 'desc'")
):
    """Returns paginated, filterable, and searchable analysis history from the database."""
    data = models.list_analyses(
        page=page,
        page_size=page_size,
        search=search,
        classification=classification,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return data

@router.get("/history/{analysis_id}", response_model=HistoryItem, tags=["History"])
def get_analysis_detail(analysis_id: int):
    """Retrieves full details of a specific stored analysis record."""
    item = models.get_analysis_by_id(analysis_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID {analysis_id} not found."
        )
    return item

@router.delete("/history/{analysis_id}", tags=["History"])
def delete_single_history(analysis_id: int):
    """Deletes a specific history record from the database."""
    deleted = models.delete_analysis_by_id(analysis_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID {analysis_id} could not be found."
        )
    return {"success": True, "message": f"Analysis #{analysis_id} successfully deleted."}

@router.delete("/history", tags=["History"])
def clear_history():
    """Clears all stored analysis history from the database."""
    deleted_count = models.clear_all_analyses()
    return {"success": True, "message": "All analysis history has been permanently cleared.", "count": deleted_count}

@router.post("/feedback", response_model=FeedbackResponse, tags=["Feedback"])
def submit_feedback(payload: FeedbackRequest):
    """Submits user correction/validation feedback regarding an email classification."""
    existing = models.get_analysis_by_id(payload.analysis_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID {payload.analysis_id} not found."
        )

    models.save_feedback(
        analysis_id=payload.analysis_id,
        feedback_type=payload.feedback_type,
        suggested_classification=payload.suggested_classification,
        comments=payload.comments
    )
    return {
        "success": True,
        "message": "Thank you! Your feedback has been recorded for model evaluation."
    }

@router.get("/dashboard/stats", response_model=DashboardStatsResponse, tags=["Dashboard"])
def get_dashboard_statistics():
    """Returns real-time analytics and metrics computed directly from persistent database records."""
    stats = models.get_dashboard_stats()
    return stats
