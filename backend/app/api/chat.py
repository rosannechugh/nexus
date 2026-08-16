from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.agents.orchestrator import execute_query
from app.core.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.message import Message
from app.models.research_session import ResearchSession
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. Verify that the session belongs to the
    # authenticated user.
    session = db.scalar(
        select(ResearchSession).where(
            ResearchSession.id == request.session_id,
            ResearchSession.user_id == user.id,
        )
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Research session not found.",
        )

    # 2. Save the user's question.
    user_message = Message(
        session_id=session.id,
        role="user",
        content=request.query,
    )

    db.add(user_message)
    db.commit()

    # 3. Run the NEXUS research pipeline.
    result = execute_query(
        query=request.query,
        user_id=user.id,
        top_k=request.top_k,
    )

    # 4. Save NEXUS's answer.
    assistant_message = Message(
        session_id=session.id,
        role="assistant",
        content=result["answer"],
        research_metadata={
        "reasoning": result.get("reasoning"),
        "sources": result.get("sources", []),
        "verification": result.get("verification", []),
        "query_type": result.get("query_type"),
        },
    )

    db.add(assistant_message)

    # 5. Update the session timestamp.
    session.updated_at = datetime.now(timezone.utc)

    db.commit()

    return result