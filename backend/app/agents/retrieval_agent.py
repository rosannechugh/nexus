from pydantic import BaseModel

from app.rag.embeddings import generate_embedding
from app.rag.vector_store import search_chunks


class RetrievedEvidence(BaseModel):
    chunk_id: str
    content: str
    document_id: int
    page_number: int
    chunk_index: int
    distance: float


def retrieve_evidence(
    query: str,
    user_id: int,
    top_k: int = 5,
) -> list[RetrievedEvidence]:

    query_embedding = generate_embedding(query)

    results = search_chunks(
        query_embedding=query_embedding,
        user_id=user_id,
        top_k=top_k,
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]
    ids = results["ids"][0]

    evidence = []

    for document, metadata, distance, chunk_id in zip(
        documents,
        metadatas,
        distances,
        ids,
    ):
        evidence.append(
            RetrievedEvidence(
                chunk_id=chunk_id,
                content=document,
                document_id=int(metadata["document_id"]),
                page_number=int(metadata["page_number"]),
                chunk_index=int(metadata["chunk_index"]),
                distance=float(distance),
            )
        )

    return evidence