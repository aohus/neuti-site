"""시공사례 본문(JSON 블록 문자열)에서 평문 요약을 뽑는 순수 함수."""

import json
import re

DEFAULT_SUMMARY_LENGTH = 150
ELLIPSIS = "…"

_IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
_LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_TABLE_SEPARATOR_RE = re.compile(r"^\s*\|?[\s:\-|]+\|?\s*$")
_HEADING_RE = re.compile(r"^\s{0,3}#{1,6}\s")
_LIST_RE = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s+")
_QUOTE_RE = re.compile(r"^\s*>\s?")
_EMPHASIS_RE = re.compile(r"(\*\*|__|\*|_|~~|`)")
_WHITESPACE_RE = re.compile(r"\s+")


def _is_table_separator(line: str) -> bool:
    return "|" in line and bool(_TABLE_SEPARATOR_RE.match(line))


def _strip_markdown(text: str) -> str:
    # 소제목("공사 개요")과 표 머리행("구분 | 내용")은 라벨일 뿐이라 요약 첫머리를 낭비한다.
    source = text.splitlines()
    lines = []
    for i, line in enumerate(source):
        if _is_table_separator(line) or _HEADING_RE.match(line):
            continue
        if i + 1 < len(source) and _is_table_separator(source[i + 1]):
            continue
        line = _IMAGE_RE.sub("", line)
        line = _LINK_RE.sub(r"\1", line)
        line = _QUOTE_RE.sub("", line)
        line = _LIST_RE.sub("", line)
        line = line.replace("|", " ")
        line = _EMPHASIS_RE.sub("", line)
        lines.append(line)
    return "\n".join(lines)


def _extract_text(content: str) -> str:
    try:
        blocks = json.loads(content)
    except (ValueError, TypeError):
        blocks = None

    if isinstance(blocks, list):
        parts = [
            b["value"]
            for b in blocks
            if isinstance(b, dict) and b.get("type") == "text" and isinstance(b.get("value"), str)
        ]
        raw = "\n\n".join(parts)
    else:
        # JSON 블록이 아닌 레거시/관리자 입력 본문은 평문(HTML 가능)으로 본다.
        raw = _HTML_TAG_RE.sub(" ", content)
    return _WHITESPACE_RE.sub(" ", _strip_markdown(raw)).strip()


def _truncate(text: str, max_length: int) -> str:
    if len(text) <= max_length:
        return text
    cut = text[: max_length + 1]
    boundary = cut.rfind(" ")
    head = cut[:boundary] if boundary > 0 else text[:max_length]
    return head.rstrip() + ELLIPSIS


def summarize_content(
    content: str | None,
    fallback: str | None = None,
    max_length: int = DEFAULT_SUMMARY_LENGTH,
) -> str | None:
    """text 블록만 모아 마크다운을 걷어낸 요약을 돌려준다.

    본문에 텍스트가 없으면 fallback(부제목 등)을, 그것도 없으면 None.
    max_length 를 넘으면 단어 경계에서 자르고 말줄임표를 붙인다.
    """
    text = _extract_text(content) if content else ""
    if not text:
        return _WHITESPACE_RE.sub(" ", fallback).strip() or None if fallback else None
    return _truncate(text, max_length)
