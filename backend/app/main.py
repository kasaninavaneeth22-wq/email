import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import router as api_router
from app.database.connection import init_db
from app.services.classifier import classifier_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing database...")
    init_db()
    logger.info("Initializing ML classification engine...")
    classifier_service.initialize()
    logger.info("System startup completed successfully.")
    yield
    # Shutdown sequence
    logger.info("Shutting down application...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Explainable Email Spam and Phishing Threat Detection API with Hybrid ML and Rule-Based Forensics.",
    lifespan=lifespan
)

# Configure CORS for local development and specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/", tags=["Root"])
def root():
    return {
        "title": settings.APP_NAME,
        "version": settings.VERSION,
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
