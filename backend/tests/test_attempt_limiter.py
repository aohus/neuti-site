import pytest
from fastapi import HTTPException

from app.utils.attempt_limiter import AttemptLimiter


class FakeClock:
    def __init__(self) -> None:
        self.now = 1000.0

    def __call__(self) -> float:
        return self.now


def _limiter(clock: FakeClock) -> AttemptLimiter:
    return AttemptLimiter(max_failures=3, window_seconds=60, clock=clock)


def test_한도_미만의_실패는_통과시킨다():
    limiter = _limiter(FakeClock())
    for _ in range(2):
        limiter.record_failure("k")
    limiter.ensure_allowed("k")


def test_한도에_닿으면_429로_막는다():
    limiter = _limiter(FakeClock())
    for _ in range(3):
        limiter.record_failure("k")
    with pytest.raises(HTTPException) as exc:
        limiter.ensure_allowed("k")
    assert exc.value.status_code == 429


def test_창이_지나면_다시_허용한다():
    clock = FakeClock()
    limiter = _limiter(clock)
    for _ in range(3):
        limiter.record_failure("k")
    clock.now += 61
    limiter.ensure_allowed("k")


def test_성공하면_실패_기록을_지운다():
    limiter = _limiter(FakeClock())
    for _ in range(2):
        limiter.record_failure("k")
    limiter.reset("k")
    limiter.record_failure("k")
    limiter.ensure_allowed("k")


def test_키마다_따로_센다():
    limiter = _limiter(FakeClock())
    for _ in range(3):
        limiter.record_failure("a")
    limiter.ensure_allowed("b")


def test_acquire_는_검사와_차감을_한_번에_해_동시_요청도_한도를_넘지_못한다():
    # 비밀번호 검증(await) 전에 시도를 차감해야 병렬 요청이 한도를 우회하지 못한다
    limiter = _limiter(FakeClock())
    for _ in range(3):
        limiter.acquire("k")
    with pytest.raises(HTTPException) as exc:
        limiter.acquire("k")
    assert exc.value.status_code == 429


def test_release_는_실패가_아닌_시도의_차감을_되돌린다():
    limiter = _limiter(FakeClock())
    for _ in range(3):
        limiter.acquire("k")
    limiter.release("k")
    limiter.acquire("k")


def test_키가_상한을_넘으면_만료된_기록부터_지운다():
    clock = FakeClock()
    limiter = AttemptLimiter(max_failures=3, window_seconds=60, clock=clock, max_keys=2)
    limiter.acquire("old")
    clock.now += 61
    limiter.acquire("a")
    limiter.acquire("b")
    assert limiter.tracked_keys() <= 2
    assert "old" not in limiter._failures


def test_만료된_기록이_없어도_상한을_지킨다():
    limiter = AttemptLimiter(max_failures=3, window_seconds=60, clock=FakeClock(), max_keys=2)
    for key in ("a", "b", "c", "d"):
        limiter.acquire(key)
    assert limiter.tracked_keys() <= 2
