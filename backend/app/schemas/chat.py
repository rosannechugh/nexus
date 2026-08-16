from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: int = Field(
        ...,
        description="Research session associated with this query",
    )

    query: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Research question for NEXUS",
    )

    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of evidence chunks to retrieve",
    )


class Source(BaseModel):
    chunk_id: str
    document_id: int
    page_number: int
    chunk_index: int
    distance: float
    content: str


class Verification(BaseModel):
    claim: str
    status: str
    supporting_sources: list[int]
    explanation: str


class ChatResponse(BaseModel):
    query: str
    query_type: str
    reasoning: str
    answer: str
    sources: list[Source]
    verification: list[Verification]