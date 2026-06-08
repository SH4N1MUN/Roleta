from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
Image.MAX_IMAGE_PIXELS = None

IMAGE_RULES = (
    ("fundo-", 1920, 82),
    ("", 1600, 80),
)


def rule_for(path: Path) -> tuple[int, int]:
    name = path.name.lower()
    for prefix, max_width, quality in IMAGE_RULES:
        if not prefix or name.startswith(prefix):
            return max_width, quality
    return 1600, 80


def optimize_jpeg(path: Path) -> tuple[int, int, str]:
    before = path.stat().st_size
    max_width, quality = rule_for(path)
    tmp = path.with_suffix(path.suffix + ".tmp")

    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        elif image.mode == "L":
            image = image.convert("RGB")

        width, height = image.size
        if width > max_width:
            ratio = max_width / width
            image = image.resize(
                (max_width, max(1, round(height * ratio))),
                Image.Resampling.LANCZOS,
            )

        image.save(tmp, "JPEG", quality=quality, optimize=True, progressive=True)

    after = tmp.stat().st_size
    if after < before:
        tmp.replace(path)
        status = "optimized"
    else:
        tmp.unlink(missing_ok=True)
        after = before
        status = "kept"
    return before, after, status


def main() -> None:
    total_before = 0
    total_after = 0
    changed = 0
    rows = []

    for path in sorted(ASSETS.rglob("*.jpg")):
        before, after, status = optimize_jpeg(path)
        total_before += before
        total_after += after
        if status == "optimized":
            changed += 1
        rows.append((path.relative_to(ROOT).as_posix(), before, after, status))

    for name, before, after, status in rows:
        saved = before - after
        print(
            f"{status:9} {name:45} "
            f"{before / 1024 / 1024:7.2f} MB -> {after / 1024 / 1024:7.2f} MB "
            f"saved {saved / 1024 / 1024:7.2f} MB"
        )

    print("")
    print(f"JPEGs changed: {changed}/{len(rows)}")
    print(
        f"Total JPEG: {total_before / 1024 / 1024:.2f} MB -> "
        f"{total_after / 1024 / 1024:.2f} MB"
    )


if __name__ == "__main__":
    main()
