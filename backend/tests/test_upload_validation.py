import io

import pytest
from fastapi import HTTPException, UploadFile

from app.utils.upload import (
    MAX_IMAGE_BYTES,
    has_image_magic,
    save_upload_image,
    validate_image_extension,
)

JPEG_MAGIC = b"\xff\xd8\xff\xe0\x00\x10JFIF"
PNG_MAGIC = b"\x89PNG\r\n\x1a\n\x00\x00\x00\x0d"
WEBP_MAGIC = b"RIFF\x24\x00\x00\x00WEBPVP8 "
HTML_PAYLOAD = b"<script>alert(1)</script>"


def _upload(filename: str, content: bytes) -> UploadFile:
    return UploadFile(filename=filename, file=io.BytesIO(content))


# --- 확장자 검증 ---


@pytest.mark.parametrize("filename", ["a.jpg", "a.jpeg", "a.png", "a.webp"])
def test_허용된_확장자는_소문자로_정규화되어_통과한다(filename):
    assert validate_image_extension(filename) == filename[filename.rindex(".") :]


def test_대문자_확장자도_허용한다():
    assert validate_image_extension("PHOTO.JPG") == ".jpg"


@pytest.mark.parametrize("filename", ["evil.html", "evil.svg", "evil.php", "noext", ""])
def test_허용되지_않은_확장자는_400_을_던진다(filename):
    with pytest.raises(HTTPException) as exc_info:
        validate_image_extension(filename)
    assert exc_info.value.status_code == 400


def test_파일명이_없으면_400_을_던진다():
    with pytest.raises(HTTPException):
        validate_image_extension(None)


# --- 매직바이트 검증 ---


@pytest.mark.parametrize("head", [JPEG_MAGIC, PNG_MAGIC, WEBP_MAGIC])
def test_이미지_시그니처를_인식한다(head):
    assert has_image_magic(head) is True


@pytest.mark.parametrize("head", [HTML_PAYLOAD, b"", b"RIFFxxxxNOTW"])
def test_이미지가_아닌_시그니처는_거부한다(head):
    assert has_image_magic(head) is False


# --- 저장 ---


async def test_정상_이미지는_uuid_파일명으로_저장된다(tmp_path):
    # Arrange
    image = _upload("photo.png", PNG_MAGIC + b"rest-of-file")

    # Act
    url = await save_upload_image(image, upload_dir=tmp_path, prefix="estimate_")

    # Assert
    assert url.startswith("/uploads/estimate_")
    assert url.endswith(".png")
    saved = tmp_path / url.removeprefix("/uploads/")
    assert saved.read_bytes() == PNG_MAGIC + b"rest-of-file"


async def test_원본_파일명은_저장_경로에_쓰이지_않는다(tmp_path):
    image = _upload("../../etc/passwd.jpg", JPEG_MAGIC)

    url = await save_upload_image(image, upload_dir=tmp_path, prefix="")

    assert ".." not in url
    assert "passwd" not in url


async def test_jpg_로_위장한_HTML_은_거부되고_디스크에_남지_않는다(tmp_path):
    # Arrange — 확장자만 검사하면 통과해버리는 저장형 XSS 시도
    image = _upload("payload.jpg", HTML_PAYLOAD)

    # Act
    with pytest.raises(HTTPException) as exc_info:
        await save_upload_image(image, upload_dir=tmp_path, prefix="estimate_")

    # Assert
    assert exc_info.value.status_code == 400
    assert list(tmp_path.iterdir()) == []


async def test_html_확장자는_거부된다(tmp_path):
    image = _upload("payload.html", HTML_PAYLOAD)

    with pytest.raises(HTTPException):
        await save_upload_image(image, upload_dir=tmp_path)

    assert list(tmp_path.iterdir()) == []


async def test_크기_상한을_넘으면_413_이고_부분_파일이_남지_않는다(tmp_path):
    # Arrange
    oversized = JPEG_MAGIC + b"\x00" * (MAX_IMAGE_BYTES + 1)
    image = _upload("big.jpg", oversized)

    # Act
    with pytest.raises(HTTPException) as exc_info:
        await save_upload_image(image, upload_dir=tmp_path)

    # Assert
    assert exc_info.value.status_code == 413
    assert list(tmp_path.iterdir()) == []


async def test_상한_이하_이미지는_저장된다(tmp_path):
    content = JPEG_MAGIC + b"\x00" * 1024
    image = _upload("ok.jpg", content)

    url = await save_upload_image(image, upload_dir=tmp_path)

    assert (tmp_path / url.removeprefix("/uploads/")).read_bytes() == content


async def test_업로드_디렉터리가_없으면_생성한다(tmp_path):
    target = tmp_path / "nested" / "uploads"
    image = _upload("ok.jpg", JPEG_MAGIC)

    await save_upload_image(image, upload_dir=target)

    assert target.is_dir()
