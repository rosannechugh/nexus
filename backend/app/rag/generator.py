import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)


MODEL_NAME = "openrouter/free"


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

When making a claim based on a source, cite it using exactly:

[Source X, Page Y]

Keep the answer clear, concise, and academically useful.

USER QUESTION:
{question}

EVIDENCE:
{evidence}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0,
    )

    return response.choices[0].message.content