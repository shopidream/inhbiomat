import json
import os
from pathlib import Path
from collections import defaultdict

# Paths
PRODUCT_IMAGES_DIR = Path("product_images")
PRODUCTS_DIR = Path("data/products")

# Get all image files organized by product ID
product_images = defaultdict(list)

for img_file in sorted(PRODUCT_IMAGES_DIR.glob("*.png")):
    # Extract product ID and index from filename (e.g., u1bcp_1.png)
    filename = img_file.name
    parts = filename.rsplit("_", 1)
    if len(parts) == 2:
        product_id = parts[0]
        index = parts[1].replace(".png", "")
        product_images[product_id].append((int(index), filename))

# Sort images by index
for product_id in product_images:
    product_images[product_id].sort(key=lambda x: x[0])
    product_images[product_id] = [img[1] for img in product_images[product_id]]

# Update each product JSON file
updated_products = []
for json_file in PRODUCTS_DIR.glob("*.json"):
    product_id = json_file.stem

    with open(json_file, "r", encoding="utf-8") as f:
        product_data = json.load(f)

    # Add images field if product has images
    if product_id in product_images:
        product_data["images"] = product_images[product_id]
        updated_products.append(product_id)

        # Write back to file
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(product_data, f, indent=2, ensure_ascii=False)

        print(f"Updated {product_id}.json with {len(product_images[product_id])} images")
    else:
        print(f"Warning: No images found for {product_id}")

print(f"\nTotal products updated: {len(updated_products)}")
print(f"Products: {', '.join(sorted(updated_products))}")

# Print example from first updated product
if updated_products:
    example_id = sorted(updated_products)[0]
    example_file = PRODUCTS_DIR / f"{example_id}.json"
    with open(example_file, "r", encoding="utf-8") as f:
        example_data = json.load(f)

    print(f"\nExample JSON snippet from {example_id}.json:")
    print(json.dumps({"images": example_data.get("images", [])}, indent=2))
