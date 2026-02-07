import json
import textwrap
from app.utils.markdown import parse_markdown_performance

def test_markdown_parsing_with_image_row():
    md_content = """---
title: 테스트 작업명
year: 2024
job_main_category: 고사목제거
job_sub_category: 고사목
site_type: 공공기관
site_location: 성남시청
client: 성남시청
category: 나무병원
thumbnail_url: /uploads/thumb.jpg
---

이것은 첫 번째 텍스트 블록입니다.

![이미지1](/uploads/img1.jpg)
![이미지2](/uploads/img2.jpg)

이것은 두 번째 텍스트 블록입니다.

![단독이미지](/uploads/img3.jpg)

마지막 텍스트입니다.
"""
    result = parse_markdown_performance(md_content)
    
    # 메타데이터 검증
    assert result["metadata"]["title"] == "테스트 작업명"
    assert result["metadata"]["year"] == 2024
    
    # 본문 블록 검증
    blocks = json.loads(result["content_json"])
    
    # 블록 개수 확인: 텍스트1, 이미지로우1, 텍스트2, 이미지1, 텍스트3
    assert len(blocks) == 5
    
    # 첫 번째 블록 (텍스트)
    assert blocks[0]["type"] == "text"
    assert "첫 번째 텍스트" in blocks[0]["value"]
    
    # 두 번째 블록 (이미지 로우)
    assert blocks[1]["type"] == "image_row"
    row_images = json.loads(blocks[1]["value"])
    assert len(row_images) == 2
    
    # 네 번째 블록 (단독 이미지)
    assert blocks[3]["type"] == "image"
    img_data = json.loads(blocks[3]["value"])
    assert img_data["url"] == "/uploads/img3.jpg"
    assert img_data["alt"] == "단독이미지"

def test_markdown_parsing_plain_text():
    md_content = """---
title: 간단한 글
---
순수 텍스트만 있는 글입니다.
줄바꿈도 있습니다.
"""
    result = parse_markdown_performance(md_content)
    blocks = json.loads(result["content_json"])
    assert len(blocks) == 1
    assert blocks[0]["type"] == "text"
    assert "줄바꿈도 있습니다." in blocks[0]["value"]