from __future__ import annotations

import csv
import hashlib
import math
import os
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PHOTOS = ROOT / "public" / "photos"
PHOTO_MASTERS = ROOT / "_photo-masters"
PHOTOS = PUBLIC_PHOTOS if PUBLIC_PHOTOS.exists() else PHOTO_MASTERS
OUTPUT = Path(os.environ.get("PHOTO_AUDIT_OUTPUT", ROOT / ".photo-audit"))
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}


def display_category(folder: str) -> str:
    return {
        "Events": "events",
        "Personnels": "personal",
        "REEL ESTATE": "real-estate",
        "Restaurants & Foods": "food",
        "Weddings": "weddings",
    }.get(folder, folder.lower())


def difference_hash(image: Image.Image, size: int = 16) -> str:
    sample = ImageOps.grayscale(image).resize((size + 1, size), Image.Resampling.LANCZOS)
    values = np.asarray(sample, dtype=np.int16)
    bits = values[:, 1:] > values[:, :-1]
    return f"{int(''.join('1' if bit else '0' for bit in bits.flat), 2):0{size * size // 4}x}"


def hamming(left: str, right: str) -> int:
    return (int(left, 16) ^ int(right, 16)).bit_count()


def sharpness_score(image: Image.Image) -> float:
    gray = np.asarray(ImageOps.grayscale(image).resize((512, 512), Image.Resampling.LANCZOS), dtype=np.float32)
    horizontal = np.diff(gray, axis=1)
    vertical = np.diff(gray, axis=0)
    return float((horizontal.var() + vertical.var()) / 2)


def quality_label(brightness: float, contrast: float, sharpness: float, clipped: float) -> str:
    concerns = 0
    if brightness < 38 or brightness > 220:
        concerns += 1
    if contrast < 25:
        concerns += 1
    if sharpness < 80:
        concerns += 1
    if clipped > 0.18:
        concerns += 1
    if concerns == 0:
        return "strong"
    if concerns == 1:
        return "good"
    return "review"


def inspect(path: Path) -> dict[str, object]:
    raw = path.read_bytes()
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        width, height = image.size
        sample = image.copy()
        sample.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
        gray = ImageOps.grayscale(sample)
        stats = ImageStat.Stat(gray)
        brightness = float(stats.mean[0])
        contrast = float(stats.stddev[0])
        pixels = np.asarray(gray, dtype=np.uint8)
        clipped = float(((pixels <= 5) | (pixels >= 250)).mean())
        sharpness = sharpness_score(sample)
        dhash = difference_hash(sample)

    folder = path.relative_to(PHOTOS).parts[0]
    orientation = "square" if width == height else "landscape" if width > height else "portrait"
    return {
        "file": path.name,
        "folder": folder,
        "category": display_category(folder),
        "relative_path": path.relative_to(ROOT).as_posix(),
        "width": width,
        "height": height,
        "orientation": orientation,
        "megapixels": round(width * height / 1_000_000, 2),
        "bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "dhash": dhash,
        "brightness": round(brightness, 1),
        "contrast": round(contrast, 1),
        "sharpness": round(sharpness, 1),
        "clipped_ratio": round(clipped, 4),
        "quality_signal": quality_label(brightness, contrast, sharpness, clipped),
        "exact_duplicate": "",
        "similar_candidates": "",
    }


def label_font(size: int) -> ImageFont.ImageFont:
    candidates = [
        Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / "segoeui.ttf",
        Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / "arial.ttf",
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def make_contact_sheets(rows: list[dict[str, object]]) -> None:
    sheets = OUTPUT / "sheets"
    sheets.mkdir(parents=True, exist_ok=True)
    font = label_font(22)
    small = label_font(17)
    columns = 4
    tile_width, tile_height = 420, 360
    image_box = (400, 285)
    grouped: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in rows:
        grouped[str(row["folder"])].append(row)

    for folder, items in grouped.items():
        for page, offset in enumerate(range(0, len(items), 20), start=1):
            batch = items[offset : offset + 20]
            rows_count = math.ceil(len(batch) / columns)
            canvas = Image.new("RGB", (columns * tile_width, rows_count * tile_height), "#151515")
            draw = ImageDraw.Draw(canvas)
            for index, item in enumerate(batch):
                col, row_number = index % columns, index // columns
                x, y = col * tile_width, row_number * tile_height
                path = ROOT / str(item["relative_path"])
                with Image.open(path) as source:
                    image = ImageOps.exif_transpose(source).convert("RGB")
                    thumb = ImageOps.contain(image, image_box, Image.Resampling.LANCZOS)
                    thumb = ImageEnhance.Sharpness(thumb).enhance(1.1)
                tx = x + (tile_width - thumb.width) // 2
                ty = y + 8 + (image_box[1] - thumb.height) // 2
                canvas.paste(thumb, (tx, ty))
                draw.text((x + 10, y + 300), str(item["file"]), fill="white", font=font)
                details = f'{item["width"]}x{item["height"]} · {item["orientation"]} · {item["quality_signal"]}'
                draw.text((x + 10, y + 330), details, fill="#b9b0a4", font=small)
            safe = "".join(character if character.isalnum() else "-" for character in folder).strip("-").lower()
            canvas.save(sheets / f"{safe}-{page:02d}.jpg", quality=88, optimize=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    inventory_path = OUTPUT / "photo-inventory.csv"
    if os.environ.get("PHOTO_AUDIT_SHEETS_ONLY") == "1" and inventory_path.exists():
        with inventory_path.open("r", newline="", encoding="utf-8-sig") as handle:
            rows = list(csv.DictReader(handle))
        make_contact_sheets(rows)
        print(f"Rendered {len(rows)} files into {OUTPUT / 'sheets'}")
        return

    files = sorted(path for path in PHOTOS.rglob("*") if path.suffix.lower() in SUPPORTED)
    rows = [inspect(path) for path in files]

    by_sha: dict[str, list[dict[str, object]]] = defaultdict(list)
    by_folder: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in rows:
        by_sha[str(row["sha256"])].append(row)
        by_folder[str(row["folder"])].append(row)
    for duplicate_rows in by_sha.values():
        if len(duplicate_rows) > 1:
            names = "; ".join(str(row["file"]) for row in duplicate_rows)
            for row in duplicate_rows:
                row["exact_duplicate"] = names
    for items in by_folder.values():
        for left_index, left in enumerate(items):
            similar: list[str] = []
            for right in items[left_index + 1 :]:
                distance = hamming(str(left["dhash"]), str(right["dhash"]))
                if distance <= 24:
                    similar.append(f'{right["file"]} (d={distance})')
            left["similar_candidates"] = "; ".join(similar)

    fields = list(rows[0].keys())
    with inventory_path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    make_contact_sheets(rows)
    print(f"Audited {len(rows)} files into {OUTPUT}")


if __name__ == "__main__":
    main()
