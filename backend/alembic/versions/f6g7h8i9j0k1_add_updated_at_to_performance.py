"""Add updated_at to performance

Revision ID: f6g7h8i9j0k1
Revises: e5f6g7h8i9j0
Create Date: 2026-10-27 00:00:00.000000

사이트맵 lastmod / RSS 의 실제 수정일용. 기존 행은 created_at 으로 백필한다.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "f6g7h8i9j0k1"
down_revision: Union[str, Sequence[str], None] = "e5f6g7h8i9j0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "performance",
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
    )
    op.execute("UPDATE performance SET updated_at = COALESCE(created_at, now())")
    op.alter_column("performance", "updated_at", nullable=False)


def downgrade() -> None:
    op.drop_column("performance", "updated_at")
