from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.user import User
from app.schemas.document import (
    DocumentDetail,
    DocumentResponse,
    DocumentUploadResponse,
)
from app.services.document_service import (
    chunk_text,
    extract_text_from_pdf,
    save_uploaded_file,
)
from app.services.indexing_service import index_document


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
)
def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are currently supported.",
        )

    file_path = save_uploaded_file(file)

    pages = extract_text_from_pdf(file_path)

    chunks = chunk_text(pages)

    document = Document(
        user_id=user.id,
        name=file.filename,
        file_path=file_path,
        document_type="pdf",
        status="ready",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    for index, chunk in enumerate(chunks):
        document_chunk = DocumentChunk(
            document_id=document.id,
            content=chunk["content"],
            page_number=chunk["page_number"],
            chunk_index=index,
        )

        db.add(document_chunk)

    db.commit()

    try:
        index_document(document.id)
    except Exception as exc:
        document.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Document indexing failed: {exc}",
        )

    return {
        "message": "Document uploaded successfully.",
        "document_id": document.id,
        "filename": document.name,
        "pages": len(pages),
        "chunks": len(chunks),
        "status": "ready",
    }


@router.get(
    "",
    response_model=list[DocumentResponse],
)
def get_documents(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    documents = db.scalars(
        select(Document)
        .where(
            Document.user_id == user.id
        )
        .order_by(
            Document.created_at.desc()
        )
    ).all()

    return documents


@router.get(
    "/{document_id}",
    response_model=DocumentDetail,
)
def get_document(
    document_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.scalar(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == user.id,
        )
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    return document


@router.delete(
    "/{document_id}",
)
def delete_document(
    document_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.scalar(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == user.id,
        )
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully.",
        "document_id": document_id,
    }