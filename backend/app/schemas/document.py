from datetime import datetime

from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):
    message: str
    document_id: int
    filename: str
    pages: int
    chunks: int
    status: str


class DocumentResponse(BaseModel):
    id: int
    name: str
    document_type: str
    status: str
    created_at: datetime


class DocumentDetail(DocumentResponse):
    file_path: str