from app.rag.rag_pipeline import answer_question


if __name__ == "__main__":
    question = input("Ask NEXUS a question: ")

    result = answer_question(question)

    print("\n" + "=" * 70)
    print("NEXUS")
    print("=" * 70)

    print("\nANSWER:\n")
    print(result["answer"])

    print("\nSOURCES:\n")

    for source in result["sources"]:
        print(
            f"Page: {source.get('page_number')} | "
            f"Chunk: {source.get('chunk_index')}"
        )