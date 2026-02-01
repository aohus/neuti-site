import frontmatter
import re
import json
from typing import List, Dict, Any

def parse_markdown_performance(content: str) -> Dict[str, Any]:
    """
    마크다운 문자열을 파싱하여 메타데이터와 블로그 형태의 본문(JSON)을 반환합니다.
    """
    post = frontmatter.loads(content.strip())
    metadata = post.metadata
    body = post.content.strip()

    blocks = []
    
    # 이미지 정규식: ![alt](url)
    # 줄의 시작과 끝이 이미지 형식을 갖추고 있는지 확인
    img_pattern = re.compile(r'^!\[.*?\]\((.*?)\)\s*$')
    
    lines = body.splitlines()
    current_text = []
    
    def flush_text():
        if current_text:
            text_value = '\n'.join(current_text).strip()
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
        if img_match:
            flush_text()
            
            row_images = [img_match.group(1)]
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                if not next_line:
                    j += 1
                    continue
                
                next_img_match = img_pattern.match(next_line)
                if next_img_match:
                    row_images.append(next_img_match.group(1))
                    j += 1
                else:
                    break
            
            if len(row_images) > 1:
                blocks.append({"type": "image_row", "value": json.dumps(row_images, ensure_ascii=False)})
                i = j
            else:
                blocks.append({"type": "image", "value": row_images[0]})
                i += 1
        else:
            current_text.append(line_raw)
            i += 1
            
    flush_text()

    return {
        "metadata": metadata,
        "content_json": json.dumps(blocks, ensure_ascii=False)
    }
