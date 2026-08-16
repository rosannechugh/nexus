from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.message import Message
from app.models.research_session import ResearchSession
from app.models.user import User
from app.schemas.research import (
    MessageResponse,
    ResearchSessionCreate,
    ResearchSessionDetail,
    ResearchSessionResponse,
)


router = APIRouter(
    prefix="/api/research",
    tags=["Research"],
)


@router.post(
    "/sessions",
    response_model=ResearchSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    request: ResearchSessionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = ResearchSession(
        user_id=user.id,
        title=request.title,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get(
    "/sessions",
    response_model=list[ResearchSessionResponse],
)
def get_sessions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = db.scalars(
        select(ResearchSession)
        .where(
            ResearchSession.user_id == user.id
        )
        .order_by(
            ResearchSession.updated_at.desc()
        )
    ).all()

    return sessions


@router.get(
    "/sessions/{session_id}",
    response_model=ResearchSessionDetail,
)
def get_session(
    session_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = db.scalar(
        select(ResearchSession).where(
            ResearchSession.id == session_id,
            ResearchSession.user_id == user.id,
        )
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Research session not found.",
        )

    messages = db.scalars(
        select(Message)
        .where(
            Message.session_id == session.id
        )
        .order_by(Message.created_at)
    ).all()

    return {
        "id": session.id,
        "title": session.title,
        "created_at": session.created_at,
        "updated_at": session.updated_at,
        "messages": messages,
    }


@router.get(
    "/sessions/{session_id}/messages",
    response_model=list[MessageResponse],
)
def get_messages(
    session_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = db.scalar(
        select(ResearchSession).where(
            ResearchSession.id == session_id,
            ResearchSession.user_id == user.id,
        )
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Research session not found.",
        )

    messages = db.scalars(
        select(Message)
        .where(
            Message.session_id == session_id
        )
        .order_by(Message.created_at)
    ).all()

    return messages