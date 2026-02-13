"""Add client_type to performance

Revision ID: b2c3d4e5f6g7
Revises: a1b2c3d4e5f6
Create Date: 2026-02-13 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6g7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add client_type column to performance table."""
    op.add_column('performance', sa.Column('client_type', sa.String(), nullable=True))


def downgrade() -> None:
    """Remove client_type column from performance table."""
    op.drop_column('performance', 'client_type')
