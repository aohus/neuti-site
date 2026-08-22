"""공개 폼(견적 요청·수목진단 의뢰)의 봇 제출 차단.

2026-02-16 ~ 2026-08-22 사이 견적 폼에 접수된 62건이 전부 봇이었다. 모든 자유
입력란이 무작위 영숫자였고, 전화번호는 한국 형식이 아닌 10자리였으며, 며칠 간격으로
20~30분 안에 2건씩 들어왔다.

주 고객이 지자체 공무원이라 CAPTCHA 는 이탈을 유발한다. 대신 사람 눈에 보이지 않는
허니팟 필드와 최소 작성 시간으로 거른다.
"""

import logging

from fastapi import Form, HTTPException

logger = logging.getLogger(__name__)

# 사람이 8개 필드를 이 시간 안에 채울 수는 없다.
MIN_FILL_SECONDS = 3
MIN_FILL_MS = MIN_FILL_SECONDS * 1000

# 봇에게 차단 사유를 알려주지 않는다.
_REJECTION_DETAIL = "요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요."


def spam_guard(
    website: str | None = Form(None, include_in_schema=False),
    elapsed_ms: int | None = Form(None, include_in_schema=False),
) -> None:
    """허니팟이 채워졌거나 사람이 쓰기엔 너무 빠른 제출을 차단한다.

    `website` 는 화면에서 감춰진 필드라 사람은 절대 채울 수 없다.
    `elapsed_ms` 는 폼이 화면에 뜬 뒤 제출까지 걸린 시간이다.
    """
    if website:
        logger.warning("스팸 차단: 허니팟 필드가 채워짐")
        raise HTTPException(status_code=400, detail=_REJECTION_DETAIL)

    if elapsed_ms is None:
        # 우리 폼은 항상 elapsed_ms 를 보낸다. 값이 없다는 건 폼을 거치지 않은
        # 직접 호출이라는 뜻이지만, 캐시된 구버전 프론트일 가능성도 있어 지금은
        # 통과시키고 기록만 남긴다. 스팸이 계속되면 이 분기를 차단으로 바꾼다.
        logger.warning("스팸 의심: elapsed_ms 없이 제출됨")
        return

    if elapsed_ms < MIN_FILL_MS:
        logger.warning("스팸 차단: 작성 시간 %sms", elapsed_ms)
        raise HTTPException(status_code=400, detail=_REJECTION_DETAIL)
