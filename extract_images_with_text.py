import fitz
import os
from PIL import Image

# Product page mapping (0-indexed)
products = {
    'mcd': (1, 2, 3),
    'mcha': (4, 5, 6),
    'swha': (7, 8, 9),
    'uwha': (10, 11, 12),
    'hawhisk-s': (13, 14, 15),
    'cad': (16, 17, 18),
    'had': (19, 20, 21),
    'hadel': (22, 23, 24),
    'atcp': (25, 26, 27),
    'ssbtcp': (28, 29, 30),
    'swbtcp': (31, 32, 33),
    'utcp': (34, 35, 36),
    'ttcp': (37, 38, 39),
    's1bcp': (40, 41, 42),
    'u1bcp': (43, 44, 45)
}

pdf_path = r'C:\Users\Juyong\inbiomat\VIEW-Rev00-EXTERNAL-Specs-Tradeshow-Interactive-COMPRESSED.pdf'
output_dir = r'C:\Users\Juyong\inbiomat\product_images'

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Open PDF
doc = fitz.open(pdf_path)

print(f"Processing {len(products)} products from PDF with {len(doc)} pages...")

# DPI setting for high-resolution rendering
dpi = 300
zoom = dpi / 72  # 72 is the default DPI
matrix = fitz.Matrix(zoom, zoom)

def find_image_bbox_with_text(page, expand_bottom_pct=0.15):
    """
    Find the bounding box of the main image area and expand it to include text below.
    """
    # Get all image rectangles
    image_list = page.get_images()

    if not image_list:
        # If no images, use the full page
        return page.rect

    # Get bounding boxes of all images
    all_rects = []
    for img_index, img in enumerate(image_list):
        try:
            # Get image rectangle
            img_rects = page.get_image_rects(img[0])
            if img_rects:
                all_rects.extend(img_rects)
        except:
            pass

    if not all_rects:
        # Fallback: use full page
        return page.rect

    # Find the union of all image rectangles
    combined_rect = all_rects[0]
    for rect in all_rects[1:]:
        combined_rect = combined_rect | rect  # Union operation

    # Expand bottom to include text overlays (scale bars, catalog numbers, etc.)
    height = combined_rect.height
    expanded_rect = fitz.Rect(
        combined_rect.x0,
        combined_rect.y0,
        combined_rect.x1,
        combined_rect.y1 + (height * expand_bottom_pct)
    )

    # Make sure we don't exceed page bounds
    page_rect = page.rect
    expanded_rect = expanded_rect & page_rect  # Intersection with page

    return expanded_rect

def render_and_crop_page(page, crop_rect, output_path):
    """
    Render a page at high DPI and crop to the specified rectangle.
    """
    # Render the full page at 300 DPI
    pix = page.get_pixmap(matrix=matrix, alpha=False)

    # Convert to PIL Image
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    # Calculate crop coordinates (scale by zoom factor)
    crop_box = (
        int(crop_rect.x0 * zoom),
        int(crop_rect.y0 * zoom),
        int(crop_rect.x1 * zoom),
        int(crop_rect.y1 * zoom)
    )

    # Crop the image
    cropped_img = img.crop(crop_box)

    # Save as PNG
    cropped_img.save(output_path, "PNG", quality=95)

    return cropped_img.size

# Process each product
for product_id, page_indices in products.items():
    main_page_idx, square_page_idx, wide_page_idx = page_indices

    print(f"\nProcessing {product_id}...")

    # Page 1: Main page - render full page or main content area
    print(f"  - Main page (page {main_page_idx + 1})...")
    main_page = doc[main_page_idx]
    main_output = os.path.join(output_dir, f"{product_id}_main.png")

    # For main page, use the full page content
    main_rect = main_page.rect
    main_size = render_and_crop_page(main_page, main_rect, main_output)
    print(f"    Saved: {main_output} ({main_size[0]}x{main_size[1]})")

    # Page 2: Square image with text
    print(f"  - Square image (page {square_page_idx + 1})...")
    square_page = doc[square_page_idx]
    square_output = os.path.join(output_dir, f"{product_id}_square.png")

    # Find image area and expand to include text below
    square_rect = find_image_bbox_with_text(square_page, expand_bottom_pct=0.15)
    square_size = render_and_crop_page(square_page, square_rect, square_output)
    print(f"    Saved: {square_output} ({square_size[0]}x{square_size[1]})")

    # Page 3: Wide image with text
    print(f"  - Wide image (page {wide_page_idx + 1})...")
    wide_page = doc[wide_page_idx]
    wide_output = os.path.join(output_dir, f"{product_id}_wide.png")

    # Find image area and expand to include text below
    wide_rect = find_image_bbox_with_text(wide_page, expand_bottom_pct=0.15)
    wide_size = render_and_crop_page(wide_page, wide_rect, wide_output)
    print(f"    Saved: {wide_output} ({wide_size[0]}x{wide_size[1]})")

doc.close()

print("\n" + "="*60)
print("Extraction complete!")
print(f"Total images extracted: {len(products) * 3}")
print(f"Output directory: {output_dir}")
print("="*60)
