"""썸네일 캐시 자동 정리 테스트.

원본을 같은 이름으로 교체하거나 지우면 이전 버전의 썸네일이 캐시에 남는다.
사람이 볼륨을 직접 정리하지 않아도 되도록 백엔드가 기동 시와 주기적으로
'현재 원본 버전에 해당하지 않는' 캐시와 죽은 프로세스가 남긴 임시 파일을 지운다.
"""

import os
import time
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.utils.thumbnail import (
    STALE_TMP_SECONDS,
    get_or_create_thumbnail,
    prune_thumbnail_cache,
)


def _write_jpeg(path: Path, size: tuple[int, int] = (800, 600)) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", size, (34, 139, 34)).save(path, "JPEG")
    return path.resolve()


@pytest.fixture
def dirs(tmp_path: Path) -> tuple[Path, Path]:
    upload_dir = tmp_path / "uploads"
    cache_dir = tmp_path / "thumb-cache"
    upload_dir.mkdir()
    cache_dir.mkdir()
    return upload_dir, cache_dir


def test_현재_원본의_썸네일은_남긴다(dirs):
    upload_dir, cache_dir = dirs
    source = _write_jpeg(upload_dir / "현장" / "a.jpg")
    kept = {get_or_create_thumbnail(source, w, cache_dir) for w in (480, 960)}

    removed = prune_thumbnail_cache(upload_dir, cache_dir)

    assert removed == 0
    assert set(cache_dir.iterdir()) == kept


def test_원본이_지워지면_그_썸네일을_지운다(dirs):
    upload_dir, cache_dir = dirs
    source = _write_jpeg(upload_dir / "a.jpg")
    get_or_create_thumbnail(source, 480, cache_dir)
    source.unlink()

    removed = prune_thumbnail_cache(upload_dir, cache_dir)

    assert removed == 1
    assert list(cache_dir.iterdir()) == []


def test_원본이_교체되면_이전_버전_썸네일만_지운다(dirs):
    upload_dir, cache_dir = dirs
    source = _write_jpeg(upload_dir / "a.jpg", size=(800, 600))
    old = get_or_create_thumbnail(source, 480, cache_dir)
    _write_jpeg(upload_dir / "a.jpg", size=(600, 800))
    current = get_or_create_thumbnail(source, 480, cache_dir)
    assert old != current

    removed = prune_thumbnail_cache(upload_dir, cache_dir)

    assert removed == 1
    assert list(cache_dir.iterdir()) == [current]


def test_오래된_임시_파일은_지우고_생성_중인_임시_파일은_남긴다(dirs):
    upload_dir, cache_dir = dirs
    stale = cache_dir / "dead.tmp"
    fresh = cache_dir / "writing.tmp"
    stale.write_bytes(b"x")
    fresh.write_bytes(b"x")
    old = time.time() - STALE_TMP_SECONDS - 60
    os.utime(stale, (old, old))

    removed = prune_thumbnail_cache(upload_dir, cache_dir)

    assert removed == 1
    assert list(cache_dir.iterdir()) == [fresh]


def test_알_수_없는_이름의_파일은_지운다(dirs):
    # 이전 형식(경로·mtime 전체를 해시한 이름) 캐시도 이걸로 함께 정리된다.
    upload_dir, cache_dir = dirs
    (cache_dir / ("0" * 64 + ".webp")).write_bytes(b"x")

    assert prune_thumbnail_cache(upload_dir, cache_dir) == 1


def test_캐시_디렉터리가_없으면_아무것도_하지_않는다(tmp_path: Path):
    assert prune_thumbnail_cache(tmp_path, tmp_path / "missing") == 0


def test_앱이_기동하면_썸네일_캐시를_정리한다():
    from app.main import app

    with (
        patch("app.main.prune_thumbnail_cache", return_value=0) as prune,
        TestClient(app),
    ):
        deadline = time.time() + 2
        while not prune.called and time.time() < deadline:
            time.sleep(0.01)

    prune.assert_called_once()


def test_정리_시작_후_만들어진_썸네일은_남긴다(dirs):
    # 스냅샷 뒤에 올라온 원본의 썸네일을 요청이 막 만들었을 수 있다.
    upload_dir, cache_dir = dirs
    fresh = cache_dir / "made_during_prune.webp"
    fresh.write_bytes(b"x")
    future = time.time() + 60
    os.utime(fresh, (future, future))

    assert prune_thumbnail_cache(upload_dir, cache_dir) == 0
    assert fresh.exists()


def test_정리_중_사라진_파일이_있어도_나머지는_정리한다(dirs, monkeypatch):
    upload_dir, cache_dir = dirs
    (cache_dir / "orphan.webp").write_bytes(b"x")
    vanished = cache_dir / "renamed.tmp"
    vanished.write_bytes(b"x")
    real_stat = Path.stat

    def flaky_stat(self, *args, **kwargs):
        if self == vanished:
            raise FileNotFoundError(self)
        return real_stat(self, *args, **kwargs)

    monkeypatch.setattr(Path, "stat", flaky_stat)

    assert prune_thumbnail_cache(upload_dir, cache_dir) == 1
    assert not (cache_dir / "orphan.webp").exists()
