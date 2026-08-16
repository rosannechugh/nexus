from datetime import datetime

from pydantic import BaseModel, Field


class ResearchSessionCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )


class MessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    research_metadata: dict | None = None
    created_at: datetime


class ResearchSessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime


class ResearchSessionDetail(ResearchSessionResponse):
    messages: list[MessageResponse]