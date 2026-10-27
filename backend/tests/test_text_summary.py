import json

from app.utils.text_summary import summarize_content


def _blocks(*blocks: dict) -> str:
    return json.dumps(list(blocks), ensure_ascii=False)


def _text(value: str) -> dict:
    return {"type": "text", "value": value}


def test_제목_표_강조_링크_목록_기호를_걷어낸다():
    content = _blocks(
        _text(
            "## 공사 개요\n\n| 구분 | 내용 |\n|---|---|\n| 발주처 | 성남시 |\n\n"
            "- **소나무** 전정\n1. [상세](http://x.y) 확인"
        )
    )
    result = summarize_content(content)
    for ch in ("#", "|", "**", "](", "---"):
        assert ch not in result
    assert "발주처 성남시" in result
    assert "소나무 전정" in result
    assert "상세 확인" in result


def test_이미지_블록과_본문_속_이미지_문법은_무시한다():
    content = _blocks(
        {"type": "image", "value": json.dumps({"url": "/uploads/a.jpg", "alt": "캡션"})},
        _text("![대체텍스트](/uploads/b.jpg)\n\n본문 문장"),
        {"type": "image_row", "value": json.dumps([{"url": "/u/c.jpg", "alt": "전"}])},
    )
    result = summarize_content(content)
    assert result == "본문 문장"


def test_공백은_하나로_합쳐진다():
    assert summarize_content(_blocks(_text("가나\n\n\n  다라\t마바"))) == "가나 다라 마바"



def test_빈_콘텐츠는_부제목으로_대체한다():
    assert summarize_content("", fallback="부제") == "부제"
    assert summarize_content("[]", fallback="부제") == "부제"
    assert summarize_content(None, fallback="부제") == "부제"
    assert summarize_content(_blocks(_text("   ")), fallback="부제") == "부제"


def test_본문도_부제목도_없으면_None():
    assert summarize_content("") is None
    assert summarize_content(None, fallback=None) is None


def test_JSON이_아닌_레거시_본문은_태그를_걷어_평문으로_취급한다():
    assert summarize_content("<p>Test <b>Content</b></p>") == "Test Content"


def test_길면_단어_경계에서_자르고_말줄임표를_붙인다():
    words = " ".join(["가나다라마"] * 100)
    result = summarize_content(_blocks(_text(words)), max_length=150)
    assert result.endswith("…")
    body = result[:-1]
    assert len(body) <= 150
    assert all(w == "가나다라마" for w in body.split(" "))


def test_공백_없는_긴_문자열은_하드컷한다():
    result = summarize_content(_blocks(_text("가" * 500)), max_length=150)
    assert result == "가" * 150 + "…"


def test_정확히_한도_길이면_말줄임표가_없다():
    assert summarize_content(_blocks(_text("가" * 150)), max_length=150) == "가" * 150


def test_텍스트_블록_여러_개를_이어_붙인다():
    result = summarize_content(_blocks(_text("첫째"), _text("둘째")))
    assert result == "첫째 둘째"


def test_소제목과_표_머리행은_요약에서_뺀다():
    # 검색 결과 설명문이 "공사 개요 구분 내용 …" 같은 라벨로 시작하지 않게 한다
    content = _blocks(
        _text("## 공사 개요\n\n| 구분 | 내용 |\n|---|---|\n| 대상지 | 성남시 순환로 |\n\n## 작업 과정\n\n새벽에 살포했다.")
    )
    assert summarize_content(content) == "대상지 성남시 순환로 새벽에 살포했다."
