import chromadb

from app.core.config import settings


CHROMA_PATH = settings.CHROMA_PATH


client = chromadb.PersistentClient(
    path=CHROMA_PATH
)


collection = client.get_or_create_collection(
    name="nexus_documents"
)


def add_chunks(
    chunk_ids: list[str],
    texts: list[str],
    metadatas: list[dict],
    embeddings: list[list[float]],
):
    """
    Add document chunks and their embeddings to ChromaDB.
    """

    collection.add(
        ids=chunk_ids,
        documents=texts,
        metadatas=metadatas,
        embeddings=embeddings,
    )


def search_chunks(
    query_embedding: list[float],
    user_id: int,
    top_k: int = 5,
):
    """
    Search only the authenticated user's documents.
    """

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={
            "user_id": user_id
        },
    )

    return results