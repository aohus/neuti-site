"""실패 횟수 기반 시도 제한 (비밀글 비밀번호 대입 방어).

백엔드는 uvicorn 단일 프로세스라 메모리에 둔다. 재기동하면 기록이 사라지지만,
대입 공격을 수 분 단위로 늦추는 목적에는 충분하다.
"""

import time
from collections import deque
from collections.abc import Callable

from fastapi import HTTPException, status

# IP 를 바꿔 가며 두드려도 메모리가 한없이 늘지 않게 하는 키 상한
DEFAULT_MAX_KEYS = 10_000


class AttemptLimiter:
    def __init__(
        self,
        *,
        max_failures: int,
        window_seconds: float,
        clock: Callable[[], float] = time.monotonic,
        max_keys: int = DEFAULT_MAX_KEYS,
    ) -> None:
        self._max_failures = max_failures
        self._window_seconds = window_seconds
        self._clock = clock
        self._max_keys = max_keys
        self._failures: dict[str, deque[float]] = {}

    def _recent(self, key: str) -> deque[float]:
        cutoff = self._clock() - self._window_seconds
        stamps = self._failures.get(key)
        if stamps is None:
            return deque()
        while stamps and stamps[0] <= cutoff:
            stamps.popleft()
        if not stamps:
            del self._failures[key]
        return stamps

    def ensure_allowed(self, key: str) -> None:
        """창 안의 실패가 한도에 닿았으면 429."""
        if len(self._recent(key)) >= self._max_failures:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="비밀번호를 여러 번 틀렸습니다. 잠시 후 다시 시도해주세요.",
            )

    def record_failure(self, key: str) -> None:
        if key not in self._failures and len(self._failures) >= self._max_keys:
            self._evict()
        self._failures.setdefault(key, deque()).append(self._clock())

    def acquire(self, key: str) -> None:
        """검사와 차감을 한 번에 한다. 검증(await) 전에 호출해야 병렬 요청이 한도를 넘지 못한다.

        검증에 성공하면 reset, 실패로 셀 일이 아니면(404 등) release 로 되돌린다.
        """
        self.ensure_allowed(key)
        self.record_failure(key)

    def release(self, key: str) -> None:
        stamps = self._failures.get(key)
        if stamps:
            stamps.pop()
            if not stamps:
                del self._failures[key]

    def tracked_keys(self) -> int:
        return len(self._failures)

    def _evict(self) -> None:
        # 만료된 기록부터 지우고, 그래도 가득 차 있으면 가장 오래된 기록을 버린다
        for key in list(self._failures):
            self._recent(key)
        while len(self._failures) >= self._max_keys:
            oldest = min(self._failures, key=lambda k: self._failures[k][-1])
            del self._failures[oldest]

    def reset(self, key: str) -> None:
        self._failures.pop(key, None)

    def clear(self) -> None:
        self._failures.clear()
