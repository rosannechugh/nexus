from fastapi import FastAPI

from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.research import router as research_router
app = FastAPI(
    title="NEXUS API",
    description="Multi-Agent Knowledge & Research Intelligence Platform",
    version="0.1.0",
)


app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(research_router)
@app.get("/")
def root():
    return {
        "name": "NEXUS",
        "message": "NEXUS API is running",
        "version": "0.1.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }