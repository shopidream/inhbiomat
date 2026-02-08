Next Task: Integrate extracted product images into the website.

Context:
- Product images are already extracted and organized in:
  C:\Users\Juyong\inbiomat\product_images\
- Image naming format: {productId}_{index}.png
  (e.g. u1bcp_1.png, u1bcp_2.png)
- Product data exists in: data/products/*.json
- image_mapping.csv and README.md already exist — do NOT regenerate them.

Instructions:
1. For each product JSON file, add an "images" field if it does not exist.
2. Populate "images" with the corresponding image filenames for that product, ordered by index.
   Example:
   "images": [
     "u1bcp_1.png",
     "u1bcp_2.png",
     "u1bcp_3.png"
   ]
3. Do NOT modify any existing fields (text, translations, specs, etc.).
4. Update the product detail page UI:
   - Display the first image as the main product image.
   - Display remaining images as a simple gallery or thumbnails.
5. Assume images are served from /product_images/.
6. Ensure the implementation works with the existing language switch (EN / KO).
7. After completion, provide a concise summary:
   - Products updated
   - Example JSON snippet
   - Which file(s) were modified
