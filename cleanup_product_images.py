import json
from pathlib import Path

PRODUCTS_DIR = Path("data/products")
IMAGES_DIR = Path("product_images")

existing_images = set(p.name for p in IMAGES_DIR.glob("*.png"))

for json_file in PRODUCTS_DIR.glob("*.json"):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "images" in data:
        original = data["images"]
        cleaned = [img for img in original if img in existing_images]

        if cleaned != original:
            data["images"] = cleaned
            print(f"Cleaned {json_file.name}: {len(original)} → {len(cleaned)}")

            with open(json_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

print("Image cleanup complete.")
