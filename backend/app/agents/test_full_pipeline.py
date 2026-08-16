from app.agents.orchestrator import execute_query


if __name__ == "__main__":

    query = input("Ask NEXUS: ")

    print("\nRunning NEXUS agents...\n")

    result = execute_query(query)

    print("=" * 70)
    print("QUERY TYPE")
    print("=" * 70)

    print(result["query_type"])

    print("\n" + "=" * 70)
    print("FINAL ANSWER")
    print("=" * 70)

    print(result["answer"])

    print("\n" + "=" * 70)
    print("VERIFICATION")
    print("=" * 70)

    for claim in result["verification"]:

        print(f"\nClaim: {claim['claim']}")
        print(f"Status: {claim['status']}")
        print(
            f"Sources: "
            f"{claim['supporting_sources']}"
        )

    print("\n" + "=" * 70)
    print("SOURCES")
    print("=" * 70)

    for source in result["sources"]:

        print(
            f"\nPage: {source['page_number']} | "
            f"Chunk: {source['chunk_index']}"
        )