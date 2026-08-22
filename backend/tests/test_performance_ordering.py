"""시공사례 목록 정렬 회귀 테스트.

`created_at`(DB 행 삽입 시각) 으로 정렬하면 md 기반 시공사례의 순서가
파일명 정렬 순서를 그대로 따라간다. `sync_all_performances()` 가 파일을
파일명 순으로 INSERT 하기 때문이다. 그 결과 `2026_` 접두사가 붙은 최신 글이
가장 먼저 INSERT 되어 `created_at DESC` 에서 꼴찌로 밀렸다.

목록의 의미는 "최근 **시공**한 사례" 이므로 정렬 기준은 `construction_date` 다.
"""

import uuid
from datetime import UTC, datetime

import pytest

from app.repositories.performance_repo import performance_repo

# 개발 DB 를 공유하므로, 이 테스트가 만든 행만 골라내는 표식을 제목에 넣는다.
MARKER = f"정렬테스트-{uuid.uuid4().hex[:8]}"


def _row(name: str, construction_date: datetime | None) -> dict:
    return {
        "title": f"{MARKER} {name}",
        "content": "<p>본문</p>",
        "construction_date": construction_date,
    }


@pytest.mark.asyncio
async def test_목록은_시공일_최신순으로_정렬된다(db_session):
    """삽입 순서와 시공일 순서를 어긋나게 넣어도 시공일 기준으로 나와야 한다."""
    # Arrange — 오래된 시공일을 먼저 넣어 created_at 순서와 반대로 만든다
    created = []
    for name, date in [
        ("옛날", datetime(2022, 3, 1, tzinfo=UTC)),
        ("최근", datetime(2026, 5, 1, tzinfo=UTC)),
        ("중간", datetime(2024, 7, 1, tzinfo=UTC)),
    ]:
        created.append(
            await performance_repo.create_from_markdown(
                db_session, data=_row(name, date)
            )
        )

    try:
        # Act
        rows = await performance_repo.get_multi_with_filters(
            db_session, skip=0, limit=100, q=MARKER
        )

        # Assert
        assert [r.title.split()[-1] for r in rows] == ["최근", "중간", "옛날"]
    finally:
        for row in created:
            await performance_repo.remove(db_session, id=row.id)


@pytest.mark.asyncio
async def test_시공일이_없는_행은_뒤로_밀린다(db_session):
    """관리자 UI 등록분 등 시공일이 비어도 최신 시공사례를 가리지 않아야 한다."""
    # Arrange — 시공일 없는 행을 가장 나중에(= created_at 가장 늦게) 넣는다
    created = [
        await performance_repo.create_from_markdown(
            db_session, data=_row("있음", datetime(2023, 1, 1, tzinfo=UTC))
        ),
        await performance_repo.create_from_markdown(
            db_session, data=_row("없음", None)
        ),
    ]

    try:
        # Act
        rows = await performance_repo.get_multi_with_filters(
            db_session, skip=0, limit=100, q=MARKER
        )

        # Assert
        assert [r.title.split()[-1] for r in rows] == ["있음", "없음"]
    finally:
        for row in created:
            await performance_repo.remove(db_session, id=row.id)
