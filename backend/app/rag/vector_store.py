from qdrant_client import QdrantClient, models

from app.core.config import settings


client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
    cloud_inference=True,
)

COLLECTION_NAME = settings.QDRANT_COLLECTION

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def ensure_collection() -> None:
    """
    Create the Qdrant collection if it does not exist
    and create the required payload index.
    """

    collections = client.get_collections().collections

    collection_exists = any(
        collection.name == COLLECTION_NAME
        for collection in collections
    )

    if not collection_exists:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=384,
                distance=models.Distance.COSINE,
            ),
        )

        # Required for filtering by authenticated user.
        client.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="user_id",
            field_schema=models.PayloadSchemaType.INTEGER,
            wait=True,
        )


def add_chunks(
    chunk_ids: list[int],
    texts: list[str],
    metadatas: list[dict],
) -> None:
    """
    Add document chunks to Qdrant.
    Qdrant Cloud generates the embeddings.
    """

    ensure_collection()

    points = []

    for chunk_id, text, metadata in zip(
        chunk_ids,
        texts,
        metadatas,
    ):
        points.append(
            models.PointStruct(
                id=chunk_id,
                vector=models.Document(
                    text=text,
                    model=EMBEDDING_MODEL,
                ),
                payload={
                    **metadata,
                    "text": text,
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
        wait=True,
    )


def search_chunks(
    query: str,
    user_id: int,
    top_k: int = 5,
):
    """
    Search only the authenticated user's documents.
    """

    ensure_collection()

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=models.Document(
            text=query,
            model=EMBEDDING_MODEL,
        ),
        query_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="user_id",
                    match=models.MatchValue(
                        value=user_id,
                    ),
                ),
            ],
        ),
        limit=top_k,
        with_payload=True,
    )

    return results.points