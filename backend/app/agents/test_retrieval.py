from app.agents.retrieval_agent import retrieve_evidence


if __name__ == "__main__":

    query = input("Research question: ")

    evidence = retrieve_evidence(
        query=query,
        top_k=5,
    )

    print("\n" + "=" * 70)
    print("NEXUS RETRIEVAL AGENT")
    print("=" * 70)

    for index, item in enumerate(evidence, start=1):

        print(f"\nRESULT {index}")
        print("-" * 70)

        print(f"Chunk ID: {item.chunk_id}")
        print(f"Document ID: {item.document_id}")
        print(f"Page: {item.page_number}")
        print(f"Chunk: {item.chunk_index}")
        print(f"Distance: {item.distance:.4f}")

        print("\nCONTENT:")
        print(item.content[:700])