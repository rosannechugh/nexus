from app.db.session import SessionLocal

from app.models.user import User
from app.models.document import Document
from app.models.document_chunk import DocumentChunk


db = SessionLocal()

try:
    user = User(
        name="Test User",
        email="test@nexus.local",
        password_hash="temporary",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    print(f"Test user created with ID: {user.id}")

finally:
    db.close()