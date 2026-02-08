// Quote Request Page Logic
(async function() {
  let productsData = null;
  let selectedProducts = [];

  // Load products data
  async function loadProductsData() {
    try {
      const response = await fetch('/data/products-index.json');
      productsData = await response.json();

      // Check if product ID is in URL
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');

      if (productId) {
        const product = productsData.products.find(p => p.id === productId);
        if (product) {
          addProductSelection(product);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  // Get translated text
  function t(key) {
    return window.i18n ? window.i18n.t(key, key) : key;
  }

  // Add product selection row
  window.addProductSelection = function(preselectedProduct = null) {
    const container = document.getElementById('product-selections');
    const index = selectedProducts.length;

    const productDiv = document.createElement('div');
    productDiv.className = 'product-selection';
    productDiv.id = `product-${index}`;

    productDiv.innerHTML = `
      <div class="product-info" style="flex: 1; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; align-items: center;">
        <div>
          <select class="form-select" name="product-${index}" onchange="updateProductInfo(${index})" required>
            <option value="" data-i18n="select_product">Select a product...</option>
            ${productsData.products.map(p => `
              <option value="${p.id}" ${preselectedProduct && p.id === preselectedProduct.id ? 'selected' : ''}>
                ${p.shortName} - ${p.name}
              </option>
            `).join('')}
          </select>
        </div>
        <div>
          <input type="text" class="form-input" name="sku-${index}" data-i18n-placeholder="sku_optional" style="width: 100%;">
        </div>
        <div>
          <input type="text" class="form-input" name="quantity-${index}" data-i18n-placeholder="quantity" style="width: 100%;">
        </div>
      </div>
      <button type="button" class="remove-btn" onclick="removeProductSelection(${index})" title="Remove product">
        ×
      </button>
    `;

    container.appendChild(productDiv);
    selectedProducts.push({
      index,
      productId: preselectedProduct?.id || null
    });

    // Apply translations to newly added elements
    if (window.i18n) {
      window.i18n.applyTranslations();
    }
  };

  // Update product info when selection changes
  window.updateProductInfo = function(index) {
    const select = document.querySelector(`select[name="product-${index}"]`);
    const productId = select.value;

    if (productId) {
      selectedProducts[index].productId = productId;
    }
  };

  // Remove product selection
  window.removeProductSelection = function(index) {
    const productDiv = document.getElementById(`product-${index}`);
    if (productDiv) {
      productDiv.remove();
      selectedProducts[index] = null;
    }
  };

  // Handle form submission
  document.getElementById('quote-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Add selected products
    const products = selectedProducts
      .filter(p => p !== null && p.productId)
      .map((p, idx) => {
        const product = productsData.products.find(prod => prod.id === p.productId);
        return {
          productId: p.productId,
          productName: product?.name,
          sku: formData.get(`sku-${p.index}`),
          quantity: formData.get(`quantity-${p.index}`)
        };
      });

    data.products = products;

    // In a real application, this would be sent to a server
    console.log('Quote request data:', data);

    // Show success message
    alert(`Thank you for your quote request!\n\nWe have received your request for ${products.length} product(s).\n\nOur team will contact you at ${data.email} within 1-2 business days.\n\nQuote Request Summary:\n- Company: ${data.companyName}\n- Contact: ${data.contactName}\n- Products: ${products.map(p => p.productName).join(', ')}`);

    // In a real application, redirect to confirmation page
    // window.location.href = 'quote-confirmation.html';
  });

  // Initialize
  loadProductsData();
})();
