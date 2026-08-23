from pydantic import BaseModel

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

    results = search_chunks(
        query=query,
        user_id=user_id,
        top_k=top_k,
    )

    evidence = []

    for result in results:
        payload = result.payload or {}

        # Qdrant returns cosine similarity as `score`
        # Chroma previously returned distance.
        # Convert it back to a distance-like value so
        # downstream NEXUS logic can remain unchanged.
        score = float(result.score)
        distance = 1.0 - score

        evidence.append(
            RetrievedEvidence(
                chunk_id=str(result.id),
                content=str(payload.get("text", "")),
                document_id=int(payload["document_id"]),
                page_number=int(payload.get("page_number", 0)),
                chunk_index=int(payload["chunk_index"]),
                distance=distance,
            )
        )

    return evidence