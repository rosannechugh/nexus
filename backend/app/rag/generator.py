from langchain_ollama import ChatOllama


llm = ChatOllama(
    model="llama3.2",
    temperature=0,
)


def generate_answer(
    question: str,
    retrieved_documents: list[str],
    retrieved_metadata: list[dict],
) -> str:

    evidence_parts = []

    for index, (document, metadata) in enumerate(
        zip(retrieved_documents, retrieved_metadata),
        start=1,
    ):
        evidence_parts.append(
            f"""
SOURCE {index}
Page: {metadata.get("page_number", "Unknown")}
Chunk: {metadata.get("chunk_index", "Unknown")}

{document}
"""
        )

    evidence = "\n".join(evidence_parts)

    prompt = f"""
You are NEXUS, a citation-grounded research assistant.

Answer the user's question using ONLY the evidence provided below.

If the evidence does not contain enough information to answer the question,
say that the available sources do not provide enough evidence.

Do not invent facts.

When making a claim based on a source, cite it using:

[Source X, Page Y]

Keep the answer clear, concise, and academically useful.

USER QUESTION:
{question}

EVIDENCE:
{evidence}
"""

    response = llm.invoke(prompt)

    return response.content