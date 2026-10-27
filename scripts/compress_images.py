#!/usr/bin/env python3
# 사진(JPEG)을 장변 기준으로 줄이고 다시 압축한다. 파일 이름·확장자는 그대로 둔다.
#
# 기준:
#   frontend/public/images  장변 2560px, q85  (next/image 가 폭별로 다시 변환)
#   backend/uploads         장변 1600px, q82  (썸네일 API·상세 원본으로 나간다)
#
# 사용 (Pillow 가 있는 backend 가상환경으로 실행):
#   PY=backend/.venv/bin/python
#   $PY scripts/compress_images.py frontend/public/images \
#       --max-edge 2560 --quality 85 --dry-run
#   $PY scripts/compress_images.py backend/uploads/<공사명> --max-edge 1600 --quality 82
#
# - EXIF 회전을 픽셀에 반영한 뒤 EXIF(촬영 위치 등)는 버린다. ICC 색 프로파일은
#   유지한다 (iPhone 사진의 Display P3 를 버리면 색이 바랜다).
# - 결과가 원본의 90% 이상이면 원본을 둔다. 기준 이하인 작은 파일은 건드리지 않는다.
# - PNG·WEBP 등 JPEG 가 아닌 파일은 건너뛴다 (로고·투명 배경).

import argparse
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps

JPEG_SUFFIXES = {".jpg", ".jpeg"}
# 이보다 작고 장변도 기준 이하인 파일은 이미 압축된 것으로 보고 건너뛴다.
SKIP_BELOW_BYTES = 400 * 1024
# 이만큼도 줄지 않으면 재인코딩으로 화질만 한 번 더 깎이므로 원본을 둔다.
MIN_SAVING_RATIO = 0.9


def recompress(path: Path, max_edge: int, quality: int) -> bytes | None:
    """다시 압축한 바이트를 돌려준다. 이득이 없으면 None."""
    original_size = path.stat().st_size
    with Image.open(path) as image:
        if max(image.size) <= max_edge and original_size < SKIP_BELOW_BYTES:
            return None
        # CMYK·흑백 프로파일을 RGB 픽셀에 붙이면 색이 틀어진다. RGB 원본만 유지한다.
        icc_profile = image.info.get("icc_profile") if image.mode == "RGB" else None
        oriented = ImageOps.exif_transpose(image).convert("RGB")
    oriented.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    buffer = BytesIO()
    save_kwargs = {"quality": quality, "optimize": True, "progressive": True}
    if icc_profile:
        save_kwargs["icc_profile"] = icc_profile
    oriented.save(buffer, "JPEG", **save_kwargs)
    data = buffer.getvalue()
    return data if len(data) < original_size * MIN_SAVING_RATIO else None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("roots", nargs="+", type=Path)
    parser.add_argument("--max-edge", type=int, required=True)
    parser.add_argument("--quality", type=int, required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    before = after = changed = 0
    for root in args.roots:
        for path in sorted(root.rglob("*")):
            if path.suffix.lower() not in JPEG_SUFFIXES or not path.is_file():
                continue
            size = path.stat().st_size
            data = recompress(path, args.max_edge, args.quality)
            before += size
            after += len(data) if data else size
            if data is None:
                continue
            changed += 1
            print(f"{size // 1024:>6}KB → {len(data) // 1024:>5}KB  {path}")
            if not args.dry_run:
                path.write_bytes(data)

    mode = " (dry-run, 파일은 그대로)" if args.dry_run else ""
    print(f"{changed}개 변경: {before / 2**20:.1f}MB → {after / 2**20:.1f}MB{mode}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
