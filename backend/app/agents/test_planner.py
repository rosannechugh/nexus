from app.agents.planner import plan_query


if __name__ == "__main__":

    queries = [
        "What neural network models were used in this paper?",
        "Compare the methodologies used in these two papers.",
        "What are the major research gaps in Parkinson's disease detection?",
        "What is machine learning?",
    ]

    for query in queries:

        print("\n" + "=" * 70)
        print("QUERY:")
        print(query)

        result = plan_query(query)

        print("\nQUERY TYPE:")
        print(result.query_type)

        print("\nREQUIRES RETRIEVAL:")
        print(result.requires_retrieval)

        print("\nMULTIPLE SOURCES:")
        print(result.requires_multiple_sources)

        print("\nREASONING:")
        print(result.reasoning)