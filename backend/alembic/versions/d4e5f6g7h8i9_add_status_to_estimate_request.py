"""add status to estimate_request

Revision ID: d4e5f6g7h8i9
Revises: c3d4e5f6g7h8
Create Date: 2026-02-13

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d4e5f6g7h8i9"
down_revision = "c3d4e5f6g7h8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "estimaterequest",
        sa.Column("status", sa.String(), nullable=False, server_default="new"),
    )


def downgrade() -> None:
    op.drop_column("estimaterequest", "status")
