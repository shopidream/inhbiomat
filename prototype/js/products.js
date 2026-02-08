// Products List Page Logic
(async function() {
  let productsData = null;
  let categoriesData = null;
  let filteredProducts = [];

  // Load JSON data
  async function loadData() {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('./data/products-index.json'),
        fetch('./data/categories.json')
      ]);

      productsData = await productsResponse.json();
      categoriesData = await categoriesResponse.json();

      filteredProducts = productsData.products;
      renderProducts();
      setupFilters();
    } catch (error) {
      console.error('Error loading data:', error);
      document.getElementById('product-grid').innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #e53e3e;">
          <p>Error loading products. Please ensure the data files are accessible.</p>
          <p style="font-size: 0.875rem; margin-top: 1rem;">Looking for: ./data/products-index.json</p>
        </div>
      `;
    }
  }

  // Get localized text
  function getLocalizedText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    return value[lang] || value.en || value;
  }

  // Render products to grid
  function renderProducts() {
    const grid = document.getElementById('product-grid');

    if (filteredProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #718096;">
          <p data-i18n="no_matches">No products match your filters.</p>
        </div>
      `;
      if (window.i18n) window.i18n.applyTranslations();
      return;
    }

    grid.innerHTML = filteredProducts.map(product => `
      <div class="product-card" onclick="window.location.href='./product-detail.html?id=${product.id}'">
        ${product.image ? `
          <div class="product-card-image">
            <img src="./product_images/${product.image}" alt="${getLocalizedText(product.name)}" loading="lazy">
          </div>
        ` : ''}
        <div class="product-card-header">
          ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
          <h3>${getLocalizedText(product.name)}</h3>
          <div class="product-short-name">${product.shortName}</div>
        </div>

        <div class="product-meta">
          <div class="meta-item">
            <div class="meta-label" data-i18n="category">Category</div>
            <div class="meta-value">${product.category}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label" data-i18n="form">Form</div>
            <div class="meta-value">${product.formFactor}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label" data-i18n="skus">SKUs</div>
            <div class="meta-value">${product.skuCount}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label" data-i18n="processing">Processing</div>
            <div class="meta-value">${product.processingMethod}</div>
          </div>
        </div>

        <div class="product-applications">
          ${product.applications.slice(0, 3).map(app =>
            `<span class="application-tag">${getLocalizedText(app)}</span>`
          ).join('')}
          ${product.applications.length > 3 ?
            `<span class="application-tag">+${product.applications.length - 3} <span data-i18n="more">more</span></span>` : ''}
        </div>
      </div>
    `).join('');

    if (window.i18n) window.i18n.applyTranslations();
    updateCounts();
  }

  // Update product counts
  function updateCounts() {
    const totalSkus = filteredProducts.reduce((sum, p) => sum + p.skuCount, 0);
    document.getElementById('products-count').textContent = filteredProducts.length;
    document.getElementById('sku-count').textContent = totalSkus;
  }

  // Setup filter event listeners
  function setupFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
    });
  }

  // Apply filters
  function applyFilters() {
    const categoryFilters = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(cb => cb.value)
      .filter(v => v !== 'all');

    const formFactorFilters = Array.from(document.querySelectorAll('input[name="formFactor"]:checked'))
      .map(cb => cb.value);

    const processingFilters = Array.from(document.querySelectorAll('input[name="processing"]:checked'))
      .map(cb => cb.value);

    const featuredOnly = document.querySelector('input[name="featured"]')?.checked;

    // Handle "All Products" checkbox
    const allCheckbox = document.querySelector('input[name="category"][value="all"]');
    if (categoryFilters.length === 0 && allCheckbox) {
      allCheckbox.checked = true;
    }

    filteredProducts = productsData.products.filter(product => {
      // Category filter
      if (categoryFilters.length > 0) {
        const productCategoryId = product.category.toLowerCase().replace(/[®\s]+/g, '-').replace(/\(|\)/g, '');
        if (!categoryFilters.includes(productCategoryId)) {
          return false;
        }
      }

      // Form factor filter
      if (formFactorFilters.length > 0) {
        const productFormFactor = product.formFactor.toLowerCase();
        if (!formFactorFilters.some(filter => productFormFactor.includes(filter))) {
          return false;
        }
      }

      // Processing method filter
      if (processingFilters.length > 0) {
        const productProcessing = product.processingMethod.toLowerCase();
        if (!processingFilters.some(filter => productProcessing.includes(filter))) {
          return false;
        }
      }

      // Featured filter
      if (featuredOnly && !product.featured) {
        return false;
      }

      return true;
    });

    renderProducts();
  }

  // Re-render on language change
  window.addEventListener('languageChanged', () => {
    renderProducts();
  });

  // Initialize
  loadData();
})();

// Toggle filters on mobile
function toggleFilters() {
  const sidebar = document.getElementById('filters-sidebar');
  const icon = document.querySelector('.filter-icon');
  sidebar.classList.toggle('mobile-visible');
  icon.textContent = sidebar.classList.contains('mobile-visible') ? '?? : '??;
}
