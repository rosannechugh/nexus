from app.rag.index_documents import index_document_chunks


def index_document(document_id: int):
    """
    Generate embeddings and index a document's chunks
    into ChromaDB.
    """

    index_document_chunks(document_id)