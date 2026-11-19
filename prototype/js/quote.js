// Quote Request Page Logic
(async function() {
  let productsData = null;
  let selectedProducts = [];

  // Load products data
  async function loadProductsData() {
    try {
      const response = await fetch('./data/products-index.json');
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
  document.getElementById('quote-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn.disabled) return;

    // Collect form data
    const formData = new FormData(form);
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

    // Build Web3Forms payload (products flattened to readable text)
    const payload = Object.assign({}, data, {
      access_key: '2ad2cc10-6fc0-47d2-8d44-e29c83a912b8',
      subject: 'New Quote Request from INHBiomat.com',
      from_name: data.contactName || '',
      products: products
        .map((p, i) => `${i + 1}. ${p.productName || p.productId} / SKU: ${p.sku || '-'} / Qty: ${p.quantity || '-'}`)
        .join('\n') || '-'
    });
    // Web3Forms spam filter: botcheck must be sent as-is only if checked
    if (!data.botcheck) delete payload.botcheck;

    let status = document.getElementById('quote-status');
    if (!status) {
      status = document.createElement('div');
      status.id = 'quote-status';
      status.setAttribute('role', 'alert');
      status.style.cssText = 'margin-top:1rem;padding:1rem;border-radius:6px;display:none;';
      submitBtn.parentNode.appendChild(status);
    }
    const showStatus = (ok, msg) => {
      status.textContent = msg;
      status.style.display = 'block';
      status.style.background = ok ? '#f0fff4' : '#fff5f5';
      status.style.color = ok ? '#22543d' : '#742a2a';
      status.style.border = '1px solid ' + (ok ? '#9ae6b4' : '#feb2b2');
    };

    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.textContent = 'Sending...';
    status.style.display = 'none';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        showStatus(true, 'Your request has been submitted successfully.');
        form.reset();
      } else {
        showStatus(false, 'Failed to submit your request. Please try again or email customer@inhbiomat.com.');
      }
    } catch (err) {
      console.error('Quote submit error:', err);
      showStatus(false, 'Failed to submit your request. Please try again or email customer@inhbiomat.com.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.innerHTML = originalLabel;
    }
  });

  // Initialize
  loadProductsData();
})();
