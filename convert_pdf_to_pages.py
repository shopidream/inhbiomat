import fitz
import json
import os
from pathlib import Path

# Configuration
pdf_path = r"C:\Users\Juyong\Inbiomat\VIEW-Rev00-EXTERNAL-Specs-Tradeshow-Interactive-COMPRESSED.pdf"
output_dir = r"C:\Users\Juyong\Inbiomat\prototype\product_images\pages"
mapping_output = r"C:\Users\Juyong\Inbiomat\product_page_mapping.json"

# Product page mapping
product_pages = {
    "mcd": [2, 3, 4],
    "mcha": [5, 6, 7],
    "swha": [8, 9, 10],
    "uwha": [11, 12, 13],
    "hawhisk-s": [14, 15, 16],
    "cad": [17, 18, 19],
    "had": [20, 21, 22],
    "hadel": [23, 24, 25],
    "atcp": [26, 27, 28],
    "ssbtcp": [29, 30, 31],
    "swbtcp": [32, 33, 34],
    "utcp": [35, 36, 37],
    "ttcp": [38, 39, 40],
    "s1bcp": [41, 42, 43],
    "u1bcp": [44, 45, 46]
}

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

print(f"Opening PDF: {pdf_path}")
doc = fitz.open(pdf_path)

# 300 DPI setting
zoom = 300 / 72  # PDF default is 72 DPI
mat = fitz.Matrix(zoom, zoom)

print(f"\nConverting pages 2-46 to PNG images at 300 DPI...")
print(f"Output directory: {output_dir}\n")

file_sizes = {}

# Convert pages 2-46 (0-indexed: 1-45)
for page_num in range(1, 46):
    actual_page_number = page_num + 1  # Display page number (2-46)
    page = doc[page_num]
    pix = page.get_pixmap(matrix=mat)

    output_filename = f"page_{actual_page_number:02d}.png"
    output_path = os.path.join(output_dir, output_filename)

    pix.save(output_path)

    file_size = os.path.getsize(output_path)
    file_sizes[output_filename] = file_size

    print(f"Created: {output_filename} ({file_size / 1024 / 1024:.2f} MB)")

doc.close()

# Create product page mapping JSON
print(f"\nCreating product page mapping...")
page_mapping = {}

for product, pages in product_pages.items():
    page_mapping[product] = {
        "main": f"page_{pages[0]:02d}.png",
        "detail1": f"page_{pages[1]:02d}.png",
        "detail2": f"page_{pages[2]:02d}.png"
    }

# Save mapping to JSON
with open(mapping_output, 'w') as f:
    json.dump(page_mapping, f, indent=2)

print(f"Saved product page mapping to: {mapping_output}")

# Generate summary report
print("\n" + "="*60)
print("CONVERSION SUMMARY")
print("="*60)
print(f"Total pages converted: {len(file_sizes)}")
print(f"Total size: {sum(file_sizes.values()) / 1024 / 1024:.2f} MB")
print(f"Average size per page: {sum(file_sizes.values()) / len(file_sizes) / 1024 / 1024:.2f} MB")
print(f"\nOutput directory: {output_dir}")
print(f"Mapping file: {mapping_output}")
print("\nFiles created:")
for filename in sorted(file_sizes.keys()):
    print(f"  - {filename}")
print("\nProduct page mapping created for {0} products.".format(len(product_pages)))
print("="*60)
