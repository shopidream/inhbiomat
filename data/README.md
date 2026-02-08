# Product Data Structure

This directory contains normalized JSON files for all Himed biomaterial products, suitable for static site generation on Cloudflare Pages.

## File Structure

```
data/
├── README.md                    # This file
├── products-index.json          # Master index of all products
├── categories.json              # Category taxonomy and filters
└── products/                    # Individual product JSON files
    ├── mcd.json                # MCD Apatitic Abrasive
    ├── mcha.json               # Hydroxyapatite (MC-Type)
    ├── swha.json               # Hydroxyapatite (Precipitated + Sintered)
    ├── uwha.json               # Hydroxyapatite (Precipitated + Unsintered)
    ├── hawhisk-s.json          # Hydroxyapatite Whiskers
    ├── cad.json                # Calcium Deficient HA Discs
    ├── had.json                # Dense HA Discs
    ├── hadel.json              # Enamel-like HA Discs
    ├── atcp.json               # Alpha-tricalcium phosphate
    ├── ssbtcp.json             # Beta-TCP (Solid-State Sintered)
    ├── swbtcp.json             # Beta-TCP (Precipitated + Sintered)
    ├── utcp.json               # Tricalcium phosphate (Unsintered)
    ├── ttcp.json               # Tetracalcium phosphate
    ├── s1bcp.json              # Biphasic Calcium Phosphate (Sintered)
    └── u1bcp.json              # Biphasic Calcium Phosphate (Unsintered)
```

## Product Statistics

- **Total Products**: 15
- **Total SKUs**: 96
- **Categories**: 5 major categories
- **Source**: Himed VIEW-Rev00-EXTERNAL-Specs PDF (46 pages)

### Product Breakdown by Category

| Category | Products | SKUs |
|----------|----------|------|
| MATRIX® System | 1 | 6 |
| Hydroxyapatite (HA) | 7 | 27 |
| Tricalcium Phosphate (TCP) | 4 | 21 |
| Tetracalcium Phosphate (TTCP) | 1 | 2 |
| Biphasic Calcium Phosphate (BCP) | 2 | 40 |

## JSON Schema

### Product File Schema

Each product JSON file follows this structure:

```json
{
  "productId": "string",              // Unique identifier (kebab-case)
  "productName": "string",            // Full product name
  "shortName": "string",              // Product abbreviation (e.g., "MCHA")
  "category": "string",               // Main category
  "subCategory": "string",            // Sub-category
  "processingMethod": "string",       // Manufacturing process
  "formFactor": "string",             // Physical form (Powder, Disc, etc.)
  "applications": ["string"],         // Array of use cases
  "mktCode": "string",                // Marketing code (e.g., "MKT-HM-0018")
  "revision": "string",               // Document revision
  "effectiveDate": "string",          // ISO date (YYYY-MM-DD)
  "pdfPages": [number],               // Source PDF page numbers

  "overview": {
    "summary": "string",              // Product description
    "manufacturing": "string",        // Manufacturing details
    "keyFeatures": ["string"],        // Bullet points
    "image": "string"                 // SEM image filename
  },

  "properties": {
    "physical": {
      "appearance": "string",
      "density": {
        "value": "string",            // e.g., "3.12 ± 0.08 g/cc"
        "method": "string"            // e.g., "gas pycnometry"
      }
      // ... other physical properties
    },
    "chemical": {
      "chemicalFormula": "string",    // Using subscript notation
      "synonyms": ["string"],
      "composition": {
        "method": "string",           // e.g., "XRD", "ICP"
        "components": [
          {
            "name": "string",
            "percentage": "string"    // e.g., "≥ 96%"
          }
        ]
      },
      "traceElements": {
        "standard": "string",         // e.g., "ASTM F1185"
        "elements": {
          "arsenic": "string",        // e.g., "< 3 ppm"
          // ... other elements
        }
      }
    }
  },

  "skus": [
    {
      "catalogNumber": "string",      // e.g., "MCHA15"
      "sizeRange": "string",          // e.g., "20-63 μm"
      "processing": "string",         // Optional (e.g., "jet milled")
      // For discs:
      "diameter": "string",
      "thickness": "string",
      "tolerance": {
        "diameter": "string",
        "thickness": "string"
      }
    }
  ],

  "relatedProducts": [
    {
      "id": "string",                 // Product ID
      "name": "string",               // Product name
      "relationship": "string"        // e.g., "alternative", "component"
    }
  ],

  "relatedProcesses": ["string"],     // Related manufacturing processes
  "notes": ["string"]                 // Additional notes
}
```

### BCP Products (Special Case)

BCP products have an additional `compositions` array for multiple HA/b-TCP ratios:

```json
{
  "compositions": [
    {
      "ratio": "60/40",
      "ha": 60,
      "bTcp": 40,
      "skus": [
        {
          "catalogNumber": "S1BCP60/4020",
          "sizeRange": "< 53 μm"
        }
      ]
    }
  ]
}
```

## Usage Examples

### Static Site Generation

#### 11ty (Eleventy)

```javascript
// _data/products.js
module.exports = async function() {
  const fs = require('fs').promises;
  const path = require('path');

  // Load product index
  const indexPath = path.join(__dirname, '../data/products-index.json');
  const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));

  // Load all product details
  const products = await Promise.all(
    index.products.map(async (p) => {
      const productPath = path.join(__dirname, '../data/products', p.jsonFile);
      return JSON.parse(await fs.readFile(productPath, 'utf8'));
    })
  );

  return products;
};
```

#### Astro

```astro
---
// src/pages/products/[id].astro
import { getCollection } from 'astro:content';
import productsIndex from '../../../data/products-index.json';

export async function getStaticPaths() {
  const products = await Promise.all(
    productsIndex.products.map(async (p) => {
      const data = await import(`../../../data/products/${p.jsonFile}`);
      return {
        params: { id: p.id },
        props: { product: data.default }
      };
    })
  );
  return products;
}

const { product } = Astro.props;
---

<h1>{product.productName}</h1>
<p>{product.overview.summary}</p>
<!-- ... -->
```

#### Next.js

```javascript
// lib/products.js
import productsIndex from '../data/products-index.json';
import fs from 'fs';
import path from 'path';

export function getAllProductIds() {
  return productsIndex.products.map(p => ({
    params: { id: p.id }
  }));
}

export function getProductData(id) {
  const product = productsIndex.products.find(p => p.id === id);
  const filePath = path.join(process.cwd(), 'data/products', product.jsonFile);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}
```

### Filtering and Search

```javascript
import productsIndex from './data/products-index.json';
import categories from './data/categories.json';

// Get products by category
function getProductsByCategory(categoryId) {
  const category = categories.categories.byMaterialType.find(
    c => c.id === categoryId
  );
  return productsIndex.products.filter(p =>
    category.productIds.includes(p.id)
  );
}

// Get products by application
function getProductsByApplication(applicationId) {
  const app = categories.categories.byApplication.find(
    a => a.id === applicationId
  );
  return productsIndex.products.filter(p =>
    app.productIds.includes(p.id)
  );
}

// Search by catalog number
function findByCatalogNumber(catalogNumber) {
  // Would need to load individual product files to search SKUs
}
```

## Navigation Structure

Use `categories.json` to build the site navigation:

```javascript
import categories from './data/categories.json';

// Material Type Navigation
categories.categories.byMaterialType.forEach(category => {
  console.log(category.name);
  console.log(`  Products: ${category.productIds.length}`);
});

// Application-based Navigation
categories.categories.byApplication.forEach(app => {
  console.log(app.name);
  console.log(`  ${app.description}`);
});
```

## Data Integrity

All technical specifications are preserved exactly as they appear in the source PDF:

- ✅ Chemical formulas (using Unicode subscripts)
- ✅ Particle size ranges (μm notation)
- ✅ Trace element limits (ASTM F1185)
- ✅ Physical properties and test methods
- ✅ Catalog numbers and SKU variants
- ✅ Related products and processes

## Validation

To validate the data structure:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

// Define your JSON schema
const schema = {
  type: 'object',
  required: ['productId', 'productName', 'category'],
  properties: {
    productId: { type: 'string' },
    productName: { type: 'string' },
    // ... etc
  }
};

// Validate each product
const validate = ajv.compile(schema);
const valid = validate(productData);
if (!valid) console.log(validate.errors);
```

## Notes

- All density values use "± X.XX g/cc" format
- Particle sizes use μm (micrometer) notation
- Chemical formulas use Unicode subscripts (e.g., Ca₁₀(PO₄)₆(OH)₂)
- ISO standards and ASTM specifications are preserved
- All numeric ranges and percentages are preserved as strings to maintain exact formatting
- BCP products use a nested structure for composition variants

## Future Enhancements

Potential additions:

- [ ] Add search index for full-text search
- [ ] Generate comparison matrices
- [ ] Add pricing data (if available)
- [ ] Add inventory/stock data
- [ ] Multilingual support (Korean translations)
- [ ] Image metadata and optimization
- [ ] SDS (Safety Data Sheet) file references
- [ ] Certificate of Analysis templates
