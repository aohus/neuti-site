"""Create estimate_request table

Revision ID: c3d4e5f6g7h8
Revises: b2c3d4e5f6g7
Create Date: 2026-02-13 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6g7h8'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6g7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create estimate_request table."""
    op.create_table(
        'estimaterequest',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('org_type', sa.String(), nullable=False),
        sa.Column('org_name', sa.String(), nullable=False),
        sa.Column('contact_name', sa.String(), nullable=False),
        sa.Column('contact_phone', sa.String(), nullable=False),
        sa.Column('contact_email', sa.String(), nullable=True),
        sa.Column('work_type', sa.String(), nullable=False),
        sa.Column('work_location', sa.String(), nullable=False),
        sa.Column('desired_date', sa.String(), nullable=True),
        sa.Column('budget_range', sa.String(), nullable=True),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_estimaterequest_id'), 'estimaterequest', ['id'], unique=False)


def downgrade() -> None:
    """Drop estimate_request table."""
    op.drop_index(op.f('ix_estimaterequest_id'), table_name='estimaterequest')
    op.drop_table('estimaterequest')
