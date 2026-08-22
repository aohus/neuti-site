import pytest
from fastapi import HTTPException

from app.utils.antispam import MIN_FILL_MS, spam_guard


def test_통과_사람이_충분한_시간을_들여_작성한_경우():
    # Arrange
    elapsed_ms = MIN_FILL_MS + 1

    # Act / Assert — 예외가 나지 않으면 통과
    assert spam_guard(website=None, elapsed_ms=elapsed_ms) is None


def test_차단_허니팟_필드가_채워진_경우():
    # Arrange — 사람 눈에 보이지 않는 필드라 사람은 채울 수 없다
    honeypot_value = "http://spam.example.com"

    # Act
    with pytest.raises(HTTPException) as exc_info:
        spam_guard(website=honeypot_value, elapsed_ms=MIN_FILL_MS + 1)

    # Assert
    assert exc_info.value.status_code == 400


def test_차단_허니팟이_채워지면_작성시간이_충분해도_거부한다():
    with pytest.raises(HTTPException):
        spam_guard(website="x", elapsed_ms=60_000)


def test_차단_작성_시간이_최소치_미만인_경우():
    # Arrange
    too_fast = MIN_FILL_MS - 1

    # Act
    with pytest.raises(HTTPException) as exc_info:
        spam_guard(website=None, elapsed_ms=too_fast)

    # Assert
    assert exc_info.value.status_code == 400


def test_통과_작성_시간이_정확히_최소치인_경우():
    assert spam_guard(website=None, elapsed_ms=MIN_FILL_MS) is None


def test_통과_빈_문자열_허니팟은_채워진_것으로_보지_않는다():
    # 브라우저는 빈 input 도 폼에 포함시켜 보낸다
    assert spam_guard(website="", elapsed_ms=MIN_FILL_MS) is None


def test_통과_elapsed_ms_가_없으면_지금은_기록만_하고_통과시킨다():
    # 캐시된 구버전 프론트를 끊지 않기 위한 현재 정책.
    # 스팸이 계속되면 차단으로 바꾼다.
    assert spam_guard(website=None, elapsed_ms=None) is None
