# INH GLOBAL Website Prototype

Static HTML prototype for INH GLOBAL, the official Korean distributor of Himed, LLC biomaterials.

## Overview

This prototype demonstrates a clinical, scientific B2B website design focused on technical specifications and information clarity. Built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools required.

## Features

- ✅ **Products List Page** with filtering by category, form factor, and processing method
- ✅ **Product Detail Pages** with tabs for overview, specifications, SKUs, and related products
- ✅ **Home Page** with product categories and key features
- ✅ **Quote Request Form** with product selection
- ✅ **Responsive Design** optimized for desktop and mobile
- ✅ **Clinical Design System** with table-heavy layouts and minimal visuals
- ✅ **Dynamic Data Loading** from JSON files

## Project Structure

```
prototype/
├── index.html              # Home page
├── products.html           # Products list page with filters
├── product-detail.html     # Product detail page template
├── quote.html             # Quote request form
├── css/
│   └── style.css          # Clinical design system CSS
├── js/
│   ├── products.js        # Products list logic
│   ├── product-detail.js  # Product detail logic
│   └── quote.js           # Quote form logic
└── README.md              # This file
```

## How to Run

### Option 1: Local Web Server (Recommended)

The prototype requires a web server to load JSON data files. You can use any of these methods:

**Python 3:**
```bash
cd prototype
python -m http.server 8000
```

**Node.js:**
```bash
cd prototype
npx http-server -p 8000
```

**PHP:**
```bash
cd prototype
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Option 2: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Pages

### 1. Home Page (`index.html`)

- Hero section with call-to-action
- Product statistics (15 families, 96 SKUs)
- Product category cards
- Key features grid
- CTA section

### 2. Products List (`products.html`)

**Features:**
- Left sidebar with filters:
  - Material Type (5 categories)
  - Form Factor (4 types)
  - Processing Method (4 methods)
  - Featured products toggle
- Product grid with cards showing:
  - Product name and short name
  - Category and form factor
  - SKU count
  - Applications (first 3)
- Dynamic filtering
- Real-time count updates

**URL:** `products.html`

### 3. Product Detail (`product-detail.html`)

**Features:**
- Product header with quick info
- Tabbed interface:
  - **Overview**: Summary, features, applications
  - **Specifications**: Physical properties, chemical properties, trace elements
  - **Product Sizes**: SKU table (with accordion for BCP products)
  - **Related Products**: Linked products
- Sidebar navigation
- Quote request button
- Print/download functionality

**URL:** `product-detail.html?id={productId}`

**Example URLs:**
- `product-detail.html?id=mcd` - MCD Apatitic Abrasive
- `product-detail.html?id=mcha` - Hydroxyapatite MC-Type
- `product-detail.html?id=s1bcp` - Sintered BCP
- `product-detail.html?id=hawhisk-s` - HA Whiskers
- `product-detail.html?id=cad` - Calcium Deficient HA Discs

### 4. Quote Request (`quote.html`)

**Features:**
- Company information form
- Contact information
- Product selection (multiple products)
- Application details
- Additional options (samples, certificates)
- Pre-selection from product page via URL parameter

**URL:** `quote.html?product={productId}` (optional)

## Design System

### Color Palette

```css
--color-primary: #2c5282          /* Primary blue */
--color-primary-light: #4a7fb5    /* Light blue */
--color-secondary: #718096        /* Gray */

--color-bg-main: #ffffff          /* White */
--color-bg-secondary: #f7fafc     /* Light gray */
--color-bg-tertiary: #edf2f7      /* Lighter gray */

--color-text-primary: #1a202c     /* Dark gray */
--color-text-secondary: #4a5568   /* Medium gray */
--color-text-muted: #718096       /* Light gray */

--color-border: #e2e8f0           /* Border color */
--color-border-strong: #cbd5e0    /* Strong border */
```

### Typography

- **Font Family**: System fonts (-apple-system, Segoe UI, Helvetica Neue)
- **Font Sizes**: 15px base, 0.875rem small, 1.125rem headers
- **Line Height**: 1.6 for body text
- **Font Weight**: 400 regular, 500 medium, 600 semibold, 700 bold

### Components

- **Cards**: White background, subtle border, rounded corners
- **Tables**: Striped rows, header background, hover effects
- **Tabs**: Border-bottom active indicator
- **Buttons**: Primary, secondary, outline variants
- **Accordion**: Expandable sections for deep data
- **Badges**: Small labels for categories and tags

## Data Integration

The prototype loads data from JSON files in the `../data/` directory:

- `../data/products-index.json` - Product catalog index
- `../data/categories.json` - Category taxonomy
- `../data/products/{product}.json` - Individual product data

### Adding New Products

1. Create a JSON file in `data/products/`
2. Add entry to `data/products-index.json`
3. Update category mapping in `data/categories.json`
4. The prototype will automatically display the new product

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE11 (not supported - uses ES6+ features)

## Responsive Breakpoints

- **Desktop**: > 1024px (sidebar + main content)
- **Tablet**: 768px - 1024px (stacked layout)
- **Mobile**: < 768px (single column)

## Performance Optimizations

- Minimal CSS (no framework overhead)
- Vanilla JS (no jQuery or framework)
- Lazy data loading (JSON files loaded on demand)
- Grid-based layouts (no heavy calculations)
- System fonts (no web font downloads)

## Future Enhancements

Potential additions for production:

- [ ] Search functionality
- [ ] Product comparison tool
- [ ] PDF download for product specs
- [ ] Korean language toggle
- [ ] Certificate of Analysis downloads
- [ ] SDS (Safety Data Sheet) links
- [ ] Contact form integration
- [ ] Analytics tracking
- [ ] SEO optimization
- [ ] Print stylesheets

## Deployment to Cloudflare Pages

This prototype is ready for deployment to Cloudflare Pages:

1. **Prepare repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Pages dashboard
   - Connect your repository
   - Set build settings:
     - Build command: (leave empty)
     - Build output directory: `prototype`

3. **Deploy:**
   - Cloudflare will automatically deploy on push
   - No build step required (static HTML)

## Technical Notes

### Why No Framework?

- **Performance**: Static HTML loads instantly
- **Simplicity**: No build tools, dependencies, or compilation
- **Maintainability**: Easy to understand and modify
- **Reliability**: No framework updates or breaking changes
- **SEO**: Pure HTML is easily crawlable

### Data Loading Strategy

Products are loaded dynamically from JSON files to:
- Separate content from presentation
- Enable easy updates without HTML changes
- Support programmatic filtering and search
- Allow future CMS integration

### Why Tables for Specifications?

Technical specifications are best displayed in tables:
- Scannable format for researchers
- Easy comparison of values
- Standard in scientific documentation
- Accessible and printable

## License

This prototype is created for INH GLOBAL. All product data is property of Himed, LLC.

## Support

For questions or modifications, refer to the main project documentation.
