from app.rag.index_documents import index_document_chunks


def index_document(document_id: int):
    """
    Index a document's chunks into Qdrant.
    """

    index_document_chunks(document_id)