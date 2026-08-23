import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)


MODEL_NAME = "openrouter/free"


def synthesize_answer(
    question: str,
    verified_claims: list[dict],
    evidence: list[dict],
) -> str:

    verified_evidence = []

    for claim in verified_claims:

        if claim["status"] == "UNSUPPORTED":
            continue

        sources = claim.get("supporting_sources", [])

        source_text = []

        for source_number in sources:
            if 1 <= source_number <= len(evidence):
                source = evidence[source_number - 1]

                source_text.append(
                    f"""
Source {source_number}
Page: {source["page_number"]}
Chunk: {source["chunk_index"]}

{source["content"]}
"""
                )

        verified_evidence.append(
            f"""
CLAIM:
{claim["claim"]}

VERIFICATION:
{claim["status"]}

EXPLANATION:
{claim["explanation"]}

SUPPORTING EVIDENCE:
{"".join(source_text)}
"""
        )

    evidence_block = "\n".join(verified_evidence)

    prompt = f"""
You are the Synthesis Agent for NEXUS.

Create the final answer to the user's question using ONLY
claims that have been verified against the provided evidence.

Rules:

1. Never include UNSUPPORTED claims.
2. Preserve the meaning of SUPPORTED claims.
3. Be careful with PARTIALLY_SUPPORTED claims.
4. Do not introduce new facts.
5. Do not use outside knowledge.
6. Cite claims using:
   [Source X, Page Y]
7. If the available evidence is insufficient, explicitly say so.
8. Write a clear, concise, academically useful answer.

USER QUESTION:

{question}

VERIFIED CLAIMS AND EVIDENCE:

{evidence_block}
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

    content = response.choices[0].message.content

    if not content:
        raise ValueError(
            "Synthesis agent returned an empty response."
        )

    return content