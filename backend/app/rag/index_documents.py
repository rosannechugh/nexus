from app.db.session import SessionLocal

# Import all related models so SQLAlchemy registers
# their relationships before querying.
from app.models.user import User
from app.models.document_chunk import DocumentChunk
from app.models.document import Document

from app.rag.vector_store import add_chunks


def index_document_chunks(document_id: int):
    db = SessionLocal()

    try:
        document = (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            print(f"Document {document_id} not found.")
            return

        chunks = (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document_id
            )
            .order_by(DocumentChunk.chunk_index)
            .all()
        )

        if not chunks:
            print(
                f"No chunks found for document {document_id}."
            )
            return

        print(
            f"Found {len(chunks)} chunks "
            f"for document {document_id}."
        )

        texts = [
            chunk.content
            for chunk in chunks
        ]

        chunk_ids = [
            chunk.id
            for chunk in chunks
        ]

        metadatas = [
            {
                "user_id": document.user_id,
                "document_id": document.id,
                "page_number": chunk.page_number or 0,
                "chunk_index": chunk.chunk_index,
            }
            for chunk in chunks
        ]

        print("Indexing chunks into Qdrant...")

        add_chunks(
            chunk_ids=chunk_ids,
            texts=texts,
            metadatas=metadatas,
        )

        print(
            f"Successfully indexed "
            f"{len(chunks)} chunks into Qdrant."
        )

    finally:
        db.close()