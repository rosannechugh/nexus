from app.agents.orchestrator import execute_query


if __name__ == "__main__":

    query = input("Ask NEXUS: ")

    result = execute_query(query)

    print("\n" + "=" * 70)
    print("NEXUS QUERY EXECUTION")
    print("=" * 70)

    print("\nQUERY:")
    print(result["query"])

    print("\nPLAN:")
    print(result["plan"])

    print("\nEVIDENCE:")

    for index, evidence in enumerate(
        result["evidence"],
        start=1,
    ):
        print(
            f"\n{index}. "
            f"Page {evidence.page_number} | "
            f"Distance {evidence.distance:.4f}"
        )

        print(evidence.content[:500])