import frontmatter
import re
import json
from pathlib import Path
from typing import List, Dict, Any

def normalize_img_url(url: str) -> str:
    """
    이미지 파일명을 기반으로 uploads 폴더 내에서 실제 경로를 찾아 자동으로 보정합니다.
    """
    if not url:
        return ""
        
    # 1. 파일명 추출 (예: 20241104_144706.jpg)
    filename = url.split('/')[-1]
    
    # 2. uploads 폴더 내에서 해당 파일의 실제 위치 검색
    uploads_root = Path("uploads")
    if not uploads_root.exists():
        uploads_root = Path("backend/uploads") # 로컬 실행 환경 대응
        
    if uploads_root.exists():
        for found_path in uploads_root.rglob(filename):
            if 'uploads' in found_path.parts:
                idx = found_path.parts.index('uploads')
                return '/' + '/'.join(found_path.parts[idx:])

    # 3. 파일을 찾지 못한 경우 (최후의 수단으로 uploads/파일명 반환)
    if 'uploads/' in url:
        return '/uploads/' + url.split('uploads/')[-1]
    return url

def parse_markdown_performance(content: str) -> Dict[str, Any]:
    """
    마크다운 문자열을 파싱하여 메타데이터와 블로그 형태의 본문(JSON)을 반환합니다.
    """
    post = frontmatter.loads(content.strip())
    metadata = post.metadata
    body = post.content.strip()

    blocks = []
    img_pattern = re.compile(r'^!\[(.*?)\]\((.*?)\)\s*$')
    
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
            
            row_images = [{"url": normalize_img_url(img_match.group(2)), "alt": img_match.group(1)}]
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                if not next_line:
                    j += 1
                    continue
                
                next_img_match = img_pattern.match(next_line)
                if next_img_match:
                    row_images.append({"url": normalize_img_url(next_img_match.group(2)), "alt": next_img_match.group(1)})
                    j += 1
                else:
                    break
            
            if len(row_images) > 1:
                blocks.append({"type": "image_row", "value": json.dumps(row_images, ensure_ascii=False)})
                i = j
            else:
                blocks.append({"type": "image", "value": json.dumps(row_images[0], ensure_ascii=False)})
                i += 1
        else:
            current_text.append(line_raw)
            i += 1
            
    flush_text()

    return {
        "metadata": metadata,
        "content_json": json.dumps(blocks, ensure_ascii=False)
    }