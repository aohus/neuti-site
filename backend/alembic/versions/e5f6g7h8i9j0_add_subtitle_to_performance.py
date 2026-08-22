"""Add subtitle and source_file to performance

Revision ID: e5f6g7h8i9j0
Revises: d4e5f6g7h8i9
Create Date: 2026-08-22 00:00:00.000000

`source_file` 은 data/performances/<name>.md 에서 동기화된 행을 표시한다.
이 값이 있으면 sync_md 가 제목 대신 파일명으로 행을 찾으므로, 제목을 바꿔도
중복 행이 생기지 않고 md 를 지우면 해당 행도 함께 사라진다.

기존 행에는 이 컬럼이 없으므로, 컬럼 추가 직후 '제목 개편 이전 제목' 기준으로
한 번 백필해 둔다. 백필되지 않은 행(관리자 UI 등록분)은 NULL 로 남아
동기화·정리 대상에서 영구히 제외된다.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5f6g7h8i9j0'
down_revision: Union[str, Sequence[str], None] = 'd4e5f6g7h8i9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# 2026-08 제목 개편 이전 title -> 마크다운 파일명(stem)
LEGACY_TITLE_TO_SOURCE_FILE: dict[str, str] = {
    "[과천] 정부과천청사의 품격을 높이는 소나무 정밀 전정 및 수형 관리": "과천청사_소나무전정",
    "금곡공원 수목 생태 관리 및 경관 고도화 작업 (전정 및 예제초)": "금곡공원_관리",
    "녹지대 관리공사": "녹지대_관리공사",
    "2024 단대·양지공원 수목 병해충 방제 사후 예찰 및 생태 건강성 진단": "단대_양지공원_병해충방제공사_예찰_및_효과분석",
    "[동부검찰청] 소나무의 품격을 되찾는 정밀 전정: 수목 생리 기반의 조경 전략 컨설팅": "동부검찰청_관리",
    "50년의 역사를 옮기는 정교한 생명 이식, 상원초등학교 대형 수목 이식 프로젝트": "상원초등학교_시설관리",
    # 상원초등학교_작업.md 는 시설관리 편으로 병합되어 삭제되었다.
    # source_file 을 남겨 두면 동기화 시 고아 행으로 인식되어 자동 삭제된다.
    "[상원초등학교] 아이들의 꿈이 자라는 숲, 수목 이식 및 식재 전략 컨설팅": "상원초등학교_작업",
    "수정, 중원구 공원 계절꽃 식재 및 유지관리": "수정,_중원구_공원_계절꽃_식재_및_유지관리",
    "시청사 및 시청공원 잔디깎이": "시청사_및_시청공원_잔디깎이",
    "아트센트 수목 치료": "아트센트_수목_치료",
    "평택보성아파트 수목 정밀 진단 및 수세 회복 시공 사례": "평택보성아파트_관리",
    "도시의 표정을 바꾸는 생명의 색채, 하대원동 계절꽃 식재 프로젝트": "하대원동_계절꽃식재",
    "하대원동 소나무 고사목 제거 및 수목 방제: 도심 속 녹지의 생명력을 복원하다": "하대원동_소나무_고사목제거",
}


def upgrade() -> None:
    """Add subtitle / source_file columns and backfill source_file."""
    op.add_column('performance', sa.Column('subtitle', sa.String(), nullable=True))
    op.add_column('performance', sa.Column('source_file', sa.String(), nullable=True))
    op.create_index(
        op.f('ix_performance_source_file'), 'performance', ['source_file'], unique=False
    )

    performance = sa.table(
        'performance',
        sa.column('title', sa.String),
        sa.column('source_file', sa.String),
    )
    conn = op.get_bind()
    for legacy_title, source_file in LEGACY_TITLE_TO_SOURCE_FILE.items():
        conn.execute(
            performance.update()
            .where(performance.c.title == legacy_title)
            .values(source_file=source_file)
        )


def downgrade() -> None:
    """Remove subtitle / source_file columns."""
    op.drop_index(op.f('ix_performance_source_file'), table_name='performance')
    op.drop_column('performance', 'source_file')
    op.drop_column('performance', 'subtitle')
