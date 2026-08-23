from app.rag.vector_store import search_chunks


def semantic_search(
    query: str,
    user_id: int,
    top_k: int = 5,
):
    """
    Perform semantic search over the authenticated user's documents.

    Qdrant Cloud handles query embedding and vector similarity search.
    """

    results = search_chunks(
        query=query,
        user_id=user_id,
        top_k=top_k,
    )

    return results


if __name__ == "__main__":
    query = input("Enter your research question: ")
    user_id = int(input("Enter user ID: "))

    results = semantic_search(
        query=query,
        user_id=user_id,
    )

    print("\n--- NEXUS SEARCH RESULTS ---\n")

    for index, result in enumerate(results, start=1):
        payload = result.payload or {}

        score = float(result.score)
        distance = 1.0 - score

        print(f"Result {index}")
        print(f"Page: {payload.get('page_number', 'Unknown')}")
        print(f"Chunk: {payload.get('chunk_index', 'Unknown')}")
        print(f"Distance: {distance:.4f}")
        print(
            f"\n{payload.get('text', '')[:500]}"
        )
        print("\n" + "-" * 60)