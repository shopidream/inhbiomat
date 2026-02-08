import shutil
import os

# Product IDs
product_ids = [
    'mcd', 'mcha', 'swha', 'uwha', 'hawhisk-s',
    'cad', 'had', 'hadel', 'atcp', 'ssbtcp',
    'swbtcp', 'utcp', 'ttcp', 's1bcp', 'u1bcp'
]

# Image types
image_types = ['main', 'square', 'wide']

source_dir = r'C:\Users\Juyong\inbiomat\product_images'
dest_dir = r'C:\Users\Juyong\inbiomat\prototype\product_images'

print("Copying newly extracted images to prototype directory...")
print("="*60)

copied_count = 0
for product_id in product_ids:
    for img_type in image_types:
        filename = f"{product_id}_{img_type}.png"
        source_path = os.path.join(source_dir, filename)
        dest_path = os.path.join(dest_dir, filename)

        if os.path.exists(source_path):
            shutil.copy2(source_path, dest_path)
            file_size = os.path.getsize(dest_path)
            print(f"Copied: {filename} ({file_size / 1024 / 1024:.2f} MB)")
            copied_count += 1
        else:
            print(f"Warning: {filename} not found in source directory")

print("="*60)
print(f"Total files copied: {copied_count} / 45")
print(f"Destination: {dest_dir}")
