import json
import re
from typing import Any

import frontmatter


def normalize_img_url(url: str, post_dir: str = "") -> str:
    """
    이미지 경로를 웹 서버(FastAPI)가 서빙하는 /uploads/ 구조로 정규화합니다.
    """
    if not url:
        return ""

    # 이미 올바른 절대 경로인 경우 그대로 반환
    if url.startswith("/uploads/"):
        return url

    # 파일명만 추출
    filename = url.split("/")[-1]

    # 상위 폴더 정보(post_dir)가 있다면 해당 폴더를 포함한 경로 생성
    if post_dir:
        return f"/uploads/{post_dir}/{filename}"

    # 정보가 없으면 기본 uploads 경로 반환
    return f"/uploads/{filename}"


def parse_markdown_performance(content: str, post_dir: str = "") -> dict[str, Any]:
    """
    마크다운 문자열을 파싱하여 메타데이터와 본문을 반환합니다.
    """
    post = frontmatter.loads(content.strip())
    metadata = post.metadata
    body = post.content.strip()

    blocks = []
    # 정규표현식 수정: 명시적인 캡처 그룹 정의 (1) alt text, (2) url
    # ![alt](url) 형식을 정확히 매칭합니다.
    img_pattern = re.compile(r"^!\[(.*?)](.*?)\)\\s*$")

    lines = body.splitlines()
    current_text = []

    def flush_text():
        if current_text:
            text_value = "\n".join(current_text).strip()
            if text_value:
                blocks.append({"type": "text", "value": text_value})
            current_text.clear()

    i = 0
    while i < len(lines):
        line_raw = lines[i]
        line = line_raw.strip()

        if not line:
            if current_text:
                current_text.append("")
            i += 1
            continue

        img_match = img_pattern.match(line)
        if img_match and len(img_match.groups()) >= 2:
            flush_text()

            row_images = [
                {
                    "url": normalize_img_url(img_match.group(2), post_dir),
                    "alt": img_match.group(1),
                }
            ]
            j = i + 1
            while j < len(lines) and len(row_images) < 3:
                next_line = lines[j].strip()
                if not next_line:
                    j += 1
                    continue

                next_img_match = img_pattern.match(next_line)
                if next_img_match and len(next_img_match.groups()) >= 2:
                    row_images.append(
                        {
                            "url": normalize_img_url(
                                next_img_match.group(2),
                                post_dir
                            ),
                            "alt": next_img_match.group(1),
                        }
                    )
                    j += 1
                else:
                    break

            if len(row_images) > 1:
                blocks.append(
                    {
                        "type": "image_row",
                        "value": json.dumps(row_images, ensure_ascii=False),
                    }
                )
                i = j
            else:
                blocks.append(
                    {
                        "type": "image",
                        "value": json.dumps(row_images[0], ensure_ascii=False),
                    }
                )
                i += 1
        else:
            current_text.append(line_raw)
            i += 1

    flush_text()

    return {"metadata": metadata, "content_json": json.dumps(blocks, ensure_ascii=False)}
