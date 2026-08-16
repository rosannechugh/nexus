from app.rag.embeddings import generate_embedding
from app.rag.vector_store import search_chunks


def semantic_search(query: str, top_k: int = 5):
    query_embedding = generate_embedding(query)

    results = search_chunks(
        query_embedding=query_embedding,
        top_k=top_k,
    )

    return results


if __name__ == "__main__":
    query = input("Enter your research question: ")

    results = semantic_search(query)

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    print("\n--- NEXUS SEARCH RESULTS ---\n")

    for index, (document, metadata, distance) in enumerate(
        zip(documents, metadatas, distances),
        start=1,
    ):
        print(f"Result {index}")
        print(f"Page: {metadata['page_number']}")
        print(f"Chunk: {metadata['chunk_index']}")
        print(f"Distance: {distance:.4f}")
        print(f"\n{document[:500]}")
        print("\n" + "-" * 60)