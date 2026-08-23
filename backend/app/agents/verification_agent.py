import json
import os
from enum import Enum

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field


load_dotenv()


class VerificationStatus(str, Enum):
    SUPPORTED = "SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    UNSUPPORTED = "UNSUPPORTED"


class VerifiedClaim(BaseModel):
    claim: str = Field(
        description="A factual claim from the generated answer"
    )

    status: VerificationStatus = Field(
        description="Whether the evidence supports the claim"
    )

    supporting_sources: list[int] = Field(
        description="Source numbers that support the claim"
    )

    explanation: str = Field(
        description="Brief explanation of the verification decision"
    )


class VerificationResult(BaseModel):
    claims: list[VerifiedClaim]


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)


MODEL_NAME = "openrouter/free"


def verify_claims(
    answer: str,
    evidence: list[dict],
) -> VerificationResult:

    evidence_text = []

    for index, item in enumerate(evidence, start=1):
        evidence_text.append(
            f"""
SOURCE {index}
Document ID: {item["document_id"]}
Page: {item["page_number"]}
Chunk: {item["chunk_index"]}

{item["content"]}
"""
        )

    evidence_block = "\n".join(evidence_text)

    prompt = f"""
You are the Verification Agent for NEXUS.

Your job is to verify factual claims in an AI-generated answer
against the supplied evidence.

IMPORTANT RULES:

1. Do NOT use outside knowledge.
2. Every claim must be evaluated only against the provided evidence.
3. SUPPORTED means the evidence clearly supports the claim.
4. PARTIALLY_SUPPORTED means the evidence supports only part of the claim
   or the claim is stronger than the evidence.
5. UNSUPPORTED means the evidence does not support the claim.
6. Identify the source numbers supporting each claim.
7. Do not invent sources.

Return ONLY valid JSON in this exact structure:

{{
    "claims": [
        {{
            "claim": "The factual claim",
            "status": "SUPPORTED",
            "supporting_sources": [1],
            "explanation": "Why the evidence supports the claim"
        }}
    ]
}}

GENERATED ANSWER:

{answer}

EVIDENCE:

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
        response_format={
            "type": "json_object",
        },
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError(
            "Verification agent returned an empty response."
        )

    data = json.loads(content)

    return VerificationResult.model_validate(data)