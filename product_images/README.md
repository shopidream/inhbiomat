# Product Images - Extraction Summary

## Overview
This folder contains all product images extracted from the PDF specification document for website use.

**Source PDF:** `VIEW-Rev00-EXTERNAL-Specs-Tradeshow-Interactive-COMPRESSED.pdf`
**Extraction Date:** 2026-02-07
**Total Images:** 92 PNG files

## File Structure

```
product_images/
├── README.md                 # This file
├── image_mapping.json        # Detailed mapping (JSON format)
├── image_mapping.csv         # Detailed mapping (CSV format)
└── [product_id]_[n].png     # Individual product images
```

## Products and Image Counts

| Product ID | Product Name | Image Count | Pages |
|------------|--------------|-------------|-------|
| atcp | Alpha-tricalcium phosphate | 6 | 26-28 |
| cad | Calcium Deficient HA Discs | 6 | 17-19 |
| had | Dense HA Discs | 7 | 20-22 |
| hadel | Enamel-like HA Discs | 6 | 23-25 |
| hawhisk-s | Hydroxyapatite Whiskers | 7 | 14-16 |
| mcd | MCD Apatitic Abrasive | 5 | 2-4 |
| mcha | Hydroxyapatite (MC-Type) | 7 | 5-7 |
| s1bcp | Biphasic Calcium Phosphate Sintered | 6 | 41-43 |
| ssbtcp | Beta-TCP (Solid-State) | 7 | 29-31 |
| swbtcp | Beta-TCP (Wet Chemical) | 6 | 32-34 |
| swha | Hydroxyapatite (SW-Type) | 6 | 8-10 |
| ttcp | Tetracalcium Phosphate | 6 | 38-40 |
| u1bcp | Biphasic Calcium Phosphate Unsintered | 5 | 44-46 |
| utcp | Tricalcium Phosphate Unsintered | 6 | 35-37 |
| uwha | Hydroxyapatite Unsintered | 6 | 11-13 |

## Naming Convention

Images are named using the pattern: `{product_id}_{sequence}.png`

Examples:
- `u1bcp_1.png` - First image for U1BCP product
- `u1bcp_2.png` - Second image for U1BCP product
- `s1bcp_1.png` - First image for S1BCP product

## Image Details

All images have been:
- ✅ Extracted from PDF at original resolution
- ✅ Converted to PNG format for web compatibility
- ✅ Filtered to exclude small icons/logos (min 100x100 pixels)
- ✅ Organized by product ID
- ✅ Numbered sequentially per product

## Mapping Files

### image_mapping.json
Complete metadata including:
- Filename
- Source PDF page number
- Image dimensions (width, height)
- Total pixel size
- Original format

### image_mapping.csv
Spreadsheet-friendly format with columns:
- Product ID
- Product Name
- Image Filename
- Page
- Width
- Height
- Size (pixels)
- Original Format

## Usage for Website

### Integration with Product JSON Files

Each product JSON file (in `data/products/`) references images using the `image` field:

```json
{
  "productId": "u1bcp",
  "overview": {
    "image": "u1bcp.png"
  }
}
```

### Recommended Website Structure

```
website/
├── images/
│   └── products/
│       ├── u1bcp_1.png    # Main product image (SEM microscopy)
│       ├── u1bcp_2.png    # Additional images
│       ├── s1bcp_1.png
│       └── ...
```

### Selecting Main Product Image

For each product, the **first image** (e.g., `u1bcp_1.png`) is typically the largest and represents the main SEM (Scanning Electron Microscopy) image. This should be used as the primary product image on the website.

Additional images (_2, _3, etc.) can be used for:
- Product galleries
- Technical documentation sections
- Comparison charts
- Size reference diagrams

## Image Types Found

Based on the extraction, images typically include:
1. **Main SEM Image** - High-resolution microscopy photo (usually the largest)
2. **Product Photos** - Physical product appearance
3. **Technical Diagrams** - Size specifications, particle distributions
4. **Comparison Charts** - Visual comparisons between products

## Notes

- All images maintain their original quality from the PDF
- Small decorative elements and logos were filtered out
- Images smaller than 100x100 pixels were excluded
- All images are in PNG format for maximum web compatibility
