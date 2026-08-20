from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.documents import router as documents_router
from app.api.research import router as research_router
from app.core.config import settings


app = FastAPI(
    title="NEXUS API",
    description="Multi-Agent Knowledge & Research Intelligence Platform",
    version="0.1.0",
)


cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(documents_router)
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
        "status": "healthy",
    }