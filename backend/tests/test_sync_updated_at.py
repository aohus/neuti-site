"""md 동기화가 내용이 바뀐 때만 updated_at 을 올리는지 검증한다."""

import uuid

import pytest

import app.sync_md as sync_md
from app.repositories.performance_repo import performance_repo

MD = """---
title: {title}
subtitle: 부제
year: 2026
construction_date: 2026-03-04
thumbnail_url: t.jpg
---

## 개요

{body}
"""


@pytest.fixture
def md_env(tmp_path, monkeypatch, db_session):
    stem = f"synctest_{uuid.uuid4().hex[:8]}"
    path = tmp_path / f"{stem}.md"
    monkeypatch.setattr(sync_md, "DATA_DIR", tmp_path)
    return stem, path


@pytest.mark.asyncio
async def test_내용이_같으면_updated_at이_그대로고_바뀌면_올라간다(md_env, db_session):
    stem, path = md_env
    title = f"동기화테스트 {stem}"
    path.write_text(MD.format(title=title, body="첫 본문"), encoding="utf-8")
    try:
        await sync_md.sync_single_file(path)
        db_session.expire_all()
        row = await performance_repo.get_by_source_file(db_session, source_file=stem)
        first = row.updated_at

        await sync_md.sync_single_file(path)
        db_session.expire_all()
        row = await performance_repo.get_by_source_file(db_session, source_file=stem)
        assert row.updated_at == first

        path.write_text(MD.format(title=title, body="바뀐 본문"), encoding="utf-8")
        await sync_md.sync_single_file(path)
        db_session.expire_all()
        row = await performance_repo.get_by_source_file(db_session, source_file=stem)
        assert row.updated_at > first
    finally:
        row = await performance_repo.get_by_source_file(db_session, source_file=stem)
        if row:
            await performance_repo.remove(db_session, id=row.id)
