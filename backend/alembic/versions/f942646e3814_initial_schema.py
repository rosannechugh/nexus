"""initial schema

Revision ID: f942646e3814
Revises:
Create Date: 2026-08-15 00:37:11.075053

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "f942646e3814"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "users",
        sa.Column(
            "id",
            sa.INTEGER(),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.VARCHAR(length=100),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "email",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "password_hash",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.PrimaryKeyConstraint(
            "id",
            name=op.f("users_pkey"),
        ),
    )

    op.create_index(
        op.f("ix_users_id"),
        "users",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_users_email"),
        "users",
        ["email"],
        unique=True,
    )

    op.create_table(
        "documents",
        sa.Column(
            "id",
            sa.INTEGER(),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.INTEGER(),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "file_path",
            sa.VARCHAR(length=500),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "document_type",
            sa.VARCHAR(length=50),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.VARCHAR(length=50),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("documents_user_id_fkey"),
        ),
        sa.PrimaryKeyConstraint(
            "id",
            name=op.f("documents_pkey"),
        ),
    )

    op.create_index(
        op.f("ix_documents_user_id"),
        "documents",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_documents_id"),
        "documents",
        ["id"],
        unique=False,
    )

    op.create_table(
        "document_chunks",
        sa.Column(
            "id",
            sa.INTEGER(),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column(
            "document_id",
            sa.INTEGER(),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "content",
            sa.TEXT(),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "page_number",
            sa.INTEGER(),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "chunk_index",
            sa.INTEGER(),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "section",
            sa.TEXT(),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "embedding_id",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["documents.id"],
            name=op.f("document_chunks_document_id_fkey"),
        ),
        sa.PrimaryKeyConstraint(
            "id",
            name=op.f("document_chunks_pkey"),
        ),
    )

    op.create_index(
        op.f("ix_document_chunks_id"),
        "document_chunks",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_document_chunks_document_id"),
        "document_chunks",
        ["document_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_document_chunks_document_id"),
        table_name="document_chunks",
    )

    op.drop_index(
        op.f("ix_document_chunks_id"),
        table_name="document_chunks",
    )

    op.drop_table("document_chunks")

    op.drop_index(
        op.f("ix_documents_user_id"),
        table_name="documents",
    )

    op.drop_index(
        op.f("ix_documents_id"),
        table_name="documents",
    )

    op.drop_table("documents")

    op.drop_index(
        op.f("ix_users_email"),
        table_name="users",
    )

    op.drop_index(
        op.f("ix_users_id"),
        table_name="users",
    )

    op.drop_table("users")