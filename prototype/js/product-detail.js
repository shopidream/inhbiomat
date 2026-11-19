// Product Detail Page Logic
(async function() {
  let productData = null;
  let productId = null;

  // Get localized text
  function getLocalizedText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    return value[lang] || value.en || value;
  }

  // Get product ID from URL
  function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  // Load product data
  async function loadProductData() {
    productId = getProductId();

    if (!productId) {
      showError('No product ID specified');
      return;
    }

    try {
      // First, load the index to get the JSON filename
      const indexResponse = await fetch('./data/products-index.json');
      const index = await indexResponse.json();

      const productInfo = index.products.find(p => p.id === productId);
      if (!productInfo) {
        showError(`Product not found: ${productId}`);
        return;
      }

      // Load the specific product JSON
      const productResponse = await fetch(`./data/products/${productInfo.jsonFile}`);
      productData = await productResponse.json();

      renderProduct();
      setupTabs();
    } catch (error) {
      console.error('Error loading product:', error);
      showError('Error loading product data');
    }
  }

  // Show error message
  function showError(message) {
    document.getElementById('product-header').innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #e53e3e;">
        <h2>Error</h2>
        <p>${message}</p>
        <p style="margin-top: 1rem;">
          <a href="./products.html" class="btn btn-primary">Back to Products</a>
        </p>
      </div>
    `;
  }

  // Render product details
  function renderProduct() {
    // Update breadcrumb
    document.getElementById('breadcrumb-product').textContent = productData.shortName;
    document.title = `${productData.productName} - INH GLOBAL`;

    // Render header
    renderHeader();

    // Render tab contents
    renderOverview();
    renderSkus();
    renderRelated();

    // Render sidebar navigation
    renderSidebarNav();
  }

  // Render product header
  function renderHeader() {
    const header = document.getElementById('product-header');
    header.innerHTML = `
      <div class="product-header-container">
        <div>
          <div style="margin-bottom: 0.5rem;">
            <span class="badge badge-secondary">${productData.category}</span>
            <span class="badge badge-secondary">${productData.formFactor}</span>
          </div>
          <h1 style="margin-bottom: 0.5rem;">${getLocalizedText(productData.productName)}</h1>
          <div style="font-family: var(--font-family-mono); font-size: 1rem; color: #718096;">
            ${productData.shortName}
          </div>
        </div>
        <div class="product-header-actions">
          <a href="./quote.html?product=${productData.productId}" class="btn btn-primary" data-i18n="request_quote">Request Quote</a>
          <button class="btn btn-outline" onclick="openSpecRequest()" data-i18n="request_specifications">Request Specifications</button>
        </div>
      </div>

      <div class="card" style="background-color: #f7fafc;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
          <div>
            <div class="meta-label">Processing Method</div>
            <div class="meta-value">${productData.processingMethod}</div>
          </div>
          <div>
            <div class="meta-label">Available SKUs</div>
            <div class="meta-value">${productData.skus?.length ||
              (productData.compositions?.reduce((sum, c) => sum + c.skus.length, 0) || 0)}</div>
          </div>
          <div>
            <div class="meta-label">MKT Code</div>
            <div class="meta-value">${productData.mktCode} Rev. ${productData.revision}</div>
          </div>
          <div>
            <div class="meta-label">Effective Date</div>
            <div class="meta-value">${productData.effectiveDate}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Render Overview tab
  function renderOverview() {
    const overview = document.getElementById('overview');
    overview.innerHTML = `
      ${productData.images && productData.images.length > 0 ? `
        <div class="card">
          <h2>Product Pages</h2>
          <p style="margin-bottom: 1.5rem; color: var(--color-text-secondary); font-size: 0.9375rem;">
            Click on any page to view in full screen
          </p>
          <div style="display: grid; gap: 1.5rem;">
            ${productData.images.slice(0, 1).map((img, idx) => `
              <div style="background-color: #f7fafc; border-radius: 8px; padding: 1rem; cursor: pointer;" onclick="openLightbox(${idx})" class="product-page-clickable">
                <div style="margin-bottom: 0.5rem;">
                  <span style="font-weight: 600; color: var(--color-text-primary);">
                    Main Page
                  </span>
                </div>
                <img src="./product_images/pages/${img}"
                     alt="Page ${idx + 1}"
                     style="width: 100%; height: auto; object-fit: contain; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="card">
        <h2 data-i18n="product_overview">Product Overview</h2>
        <p>${getLocalizedText(productData.overview.summary)}</p>

        ${productData.overview.manufacturing ? `
          <h3 data-i18n="manufacturing_process">Manufacturing Process</h3>
          <p>${getLocalizedText(productData.overview.manufacturing)}</p>
        ` : ''}

        <h3 data-i18n="key_features">Key Features</h3>
        <ul style="list-style-position: inside; color: #4a5568;">
          ${productData.overview.keyFeatures.map(feature =>
            `<li style="margin-bottom: 0.5rem;">${getLocalizedText(feature)}</li>`
          ).join('')}
        </ul>
      </div>

      ${productData.applications && productData.applications.length > 0 ? `
        <div class="card">
          <h2 data-i18n="applications">Applications</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${productData.applications.map(app =>
              `<span class="application-tag">${getLocalizedText(app)}</span>`
            ).join('')}
          </div>
        </div>
      ` : ''}

      ${productData.relatedProcesses && productData.relatedProcesses.length > 0 ? `
        <div class="card">
          <h2 data-i18n="related_processes">Related Processes</h2>
          <ul style="list-style-position: inside; color: #4a5568;">
            ${productData.relatedProcesses.map(process =>
              `<li style="margin-bottom: 0.5rem;">${getLocalizedText(process)}</li>`
            ).join('')}
          </ul>
        </div>
      ` : ''}
    `;
    if (window.i18n) window.i18n.applyTranslations();
  }

  // Render SKUs tab
  function renderSkus() {
    const skus = document.getElementById('skus');

    // Handle BCP products with compositions
    if (productData.compositions) {
      skus.innerHTML = `
        <div class="card">
          <h2>Available Product Sizes by Composition</h2>
          <p style="margin-bottom: 1.5rem; color: #4a5568;">
            This biphasic calcium phosphate (BCP) is available in multiple HA/b-TCP ratios.
            Select the composition ratio to view available particle sizes.
          </p>

          ${productData.compositions.map((comp, idx) => `
            <div class="accordion-item ${idx === 0 ? 'active' : ''}" id="comp-${idx}">
              <div class="accordion-header" onclick="toggleAccordion('comp-${idx}')">
                <div>
                  <strong>HA/b-TCP ${comp.ratio}</strong>
                  <span style="margin-left: 1rem; color: #718096; font-weight: normal;">
                    ${comp.ha}% Hydroxyapatite / ${comp.bTcp}% Beta-TCP
                  </span>
                </div>
                <span class="accordion-icon">▼</span>
              </div>
              <div class="accordion-content">
                <table>
                  <thead>
                    <tr>
                      <th>Catalog Number</th>
                      <th>Size Range</th>
                      ${comp.skus[0].processing ? '<th>Processing</th>' : ''}
                    </tr>
                  </thead>
                  <tbody>
                    ${comp.skus.map(sku => `
                      <tr>
                        <td><code>${sku.catalogNumber}</code></td>
                        <td>${sku.sizeRange}</td>
                        ${sku.processing ? `<td>${sku.processing}</td>` : ''}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </div>

        ${productData.notes && productData.notes.length > 0 ? `
          <div class="card" style="background-color: #f7fafc;">
            <h3>Notes</h3>
            <ul style="font-size: 0.875rem; padding-left: 1.25rem; list-style: disc;">${productData.notes.map(note => `<li style="margin-bottom: 0.5rem;">${note}</li>`).join('')}</ul>
          </div>
        ` : ''}
      `;
    }
    // Handle regular products with direct SKUs
    else if (productData.skus) {
      const isDisc = productData.formFactor === 'Disc';

      skus.innerHTML = `
        <div class="card">
          <h2>Available Product Sizes</h2>
          <table>
            <thead>
              <tr>
                <th>Catalog Number</th>
                ${isDisc ? '<th>Diameter</th>' : '<th>Size Range</th>'}
                ${isDisc ? '<th>Thickness</th>' : ''}
                ${isDisc ? '<th>Tolerance</th>' : ''}
                ${!isDisc && productData.skus.some(s => s.processing) ? '<th>Processing</th>' : ''}
                ${productData.skus.some(s => s.acceptableRange) ? '<th>Acceptable Range</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${productData.skus.map(sku => `
                <tr>
                  <td><code>${sku.catalogNumber}</code></td>
                  ${isDisc ? `
                    <td>${sku.diameter}</td>
                    <td>${sku.thickness}</td>
                    <td>d ${sku.tolerance.diameter}, t ${sku.tolerance.thickness}</td>
                  ` : `
                    <td>${sku.sizeRange}</td>
                    ${sku.processing ? `<td>${sku.processing}</td>` : ''}
                    ${sku.acceptableRange ? `<td>${sku.acceptableRange}</td>` : ''}
                  `}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${productData.notes && productData.notes.length > 0 ? `
          <div class="card" style="background-color: #f7fafc;">
            <h3>Notes</h3>
            <ul style="font-size: 0.875rem; padding-left: 1.25rem; list-style: disc;">${productData.notes.map(note => `<li style="margin-bottom: 0.5rem;">${note}</li>`).join('')}</ul>
          </div>
        ` : ''}
      `;
    }
  }

  // Render Related Products tab
  function renderRelated() {
    const related = document.getElementById('related');

    if (!productData.relatedProducts || productData.relatedProducts.length === 0) {
      related.innerHTML = `
        <div class="card">
          <p style="color: #718096;">No related products available.</p>
        </div>
      `;
      return;
    }

    related.innerHTML = `
      <div class="card">
        <h2>Related Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Relationship</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${productData.relatedProducts.map(rel => `
              <tr>
                <td><strong>${rel.name}</strong></td>
                <td>
                  <span class="badge badge-secondary">${rel.relationship}</span>
                </td>
                <td>
                  <a href="./product-detail.html?id=${rel.id}" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
                    View Product
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Render sidebar navigation
  async function renderSidebarNav() {
    const sidebar = document.getElementById('sidebar-nav');

    // Load products list
    let productsHtml = '';
    try {
      const response = await fetch('./data/products-index.json');
      const data = await response.json();

      // Group by category
      const categories = {};
      data.products.forEach(p => {
        if (!categories[p.category]) {
          categories[p.category] = [];
        }
        categories[p.category].push(p);
      });

      productsHtml = Object.keys(categories).map(category => `
        <div style="margin-bottom: 1.5rem;">
          <div style="font-weight: 600; font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
            ${category}
          </div>
          ${categories[category].map(p => `
            <a href="./product-detail.html?id=${p.id}"
               style="display: block; padding: 0.375rem 0.5rem; font-size: 0.875rem; color: ${p.id === productData.productId ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: none; border-left: 2px solid ${p.id === productData.productId ? 'var(--color-primary)' : 'transparent'}; padding-left: 0.5rem;"
               onmouseover="this.style.color='var(--color-primary)'"
               onmouseout="this.style.color='${p.id === productData.productId ? 'var(--color-primary)' : 'var(--color-text-secondary)'}'">
              ${p.shortName}
            </a>
          `).join('')}
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading products:', error);
    }

    sidebar.innerHTML = `
      <div class="sidebar-section">
        <h3>Products</h3>
        <div style="max-height: 70vh; overflow-y: auto;">
          ${productsHtml}
        </div>
      </div>
    `;
  }

  // Setup tab switching
  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  // Toggle accordion
  window.toggleAccordion = function(id) {
    const item = document.getElementById(id);
    item.classList.toggle('active');
  };

  // Change product image
  window.changeProductImage = function(imageName, index) {
    // Update main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
      mainImage.src = `./product_images/${imageName}`;
    }

    // Update thumbnail borders
    document.querySelectorAll('.image-thumbnail').forEach((thumb, idx) => {
      if (idx === index) {
        thumb.style.borderColor = '#3182ce';
        thumb.classList.add('active');
      } else {
        thumb.style.borderColor = '#e2e8f0';
        thumb.classList.remove('active');
      }
    });
  };

  // Re-render on language change
  window.addEventListener('languageChanged', () => {
    if (productData) {
      renderProduct();
    }
  });

  // Lightbox functionality
  let currentLightboxIndex = 0;
  let lightboxImages = [];

  window.openLightbox = function(index) {
    if (!productData || !productData.images) return;

    currentLightboxIndex = index;
    lightboxImages = productData.images.slice(0, 1);

    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('lightbox-overlay');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-overlay';
      lightbox.className = 'lightbox-overlay';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
          <button class="lightbox-nav lightbox-prev" onclick="navigateLightbox(-1)">‹</button>
          <img id="lightbox-image" class="lightbox-image" src="" alt="Product page">
          <button class="lightbox-nav lightbox-next" onclick="navigateLightbox(1)">›</button>
        </div>
      `;
      document.body.appendChild(lightbox);

      // Close on overlay click
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (lightboxImages.length < 2) return;
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      });
    }

    // Show lightbox and update image
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox-overlay');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.navigateLightbox = function(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = lightboxImages.length - 1;
    if (currentLightboxIndex >= lightboxImages.length) currentLightboxIndex = 0;
    updateLightboxImage();
  };

  function updateLightboxImage() {
    const img = document.getElementById('lightbox-image');
    if (img && lightboxImages[currentLightboxIndex]) {
      img.src = `./product_images/pages/${lightboxImages[currentLightboxIndex]}`;
    }
    const multi = lightboxImages.length > 1;
    document.querySelectorAll('#lightbox-overlay .lightbox-nav').forEach(btn => {
      btn.style.display = multi ? '' : 'none';
    });
  }

  // Request Specifications modal (lead capture -> mailto)
  function t(key, fallback) {
    return (window.i18n && window.i18n.t && window.i18n.t(key)) || fallback;
  }

  window.closeSpecRequest = function() {
    const m = document.getElementById('spec-request-modal');
    if (m) m.remove();
    document.body.style.overflow = '';
  };

  window.openSpecRequest = function() {
    if (document.getElementById('spec-request-modal')) return;
    const L = (k, f) => t(k, f);
    const m = document.createElement('div');
    m.id = 'spec-request-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;';
    const field = 'width:100%;padding:0.5rem;border:1px solid #cbd5e0;border-radius:4px;font:inherit;';
    m.innerHTML = `
      <form id="spec-request-form" style="background:#fff;border-radius:8px;padding:1.5rem;max-width:480px;width:100%;max-height:90vh;overflow:auto;">
        <h2 style="margin-bottom:1rem;">${L('request_specifications', 'Request Specifications')}</h2>
        <input type="checkbox" name="botcheck" class="hidden" style="display: none;" tabindex="-1" autocomplete="off">
        <label>${L('spec_name', 'Name')} *<input name="name" required style="${field}"></label><br><br>
        <label>${L('spec_company', 'Company')} *<input name="company" required style="${field}"></label><br><br>
        <label>${L('spec_email', 'Email')} *<input name="email" type="email" required style="${field}"></label><br><br>
        <label>${L('spec_phone', 'Phone (optional)')}<input name="phone" type="tel" style="${field}"></label><br><br>
        <label>${L('spec_message', 'Message (optional)')}<textarea name="message" rows="4" style="${field}"></textarea></label>
        <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1rem;">
          <button type="button" class="btn btn-outline" onclick="closeSpecRequest()">${L('spec_cancel', 'Cancel')}</button>
          <button type="submit" class="btn btn-primary">${L('spec_submit', 'Send Request')}</button>
        </div>
      </form>`;
    document.body.appendChild(m);
    document.body.style.overflow = 'hidden';
    m.addEventListener('click', e => { if (e.target === m) closeSpecRequest(); });
    m.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return;
      const f = new FormData(form);
      const name = getLocalizedText(productData.productName);

      const payload = {
        access_key: '2ad2cc10-6fc0-47d2-8d44-e29c83a912b8',
        subject: `Specification Request: ${name}`,
        from_name: f.get('name'),
        product: `${name} (${productData.shortName})`,
        name: f.get('name'),
        company: f.get('company'),
        email: f.get('email'),
        phone: f.get('phone') || '-',
        message: f.get('message') || '-'
      };
      if (f.get('botcheck')) payload.botcheck = f.get('botcheck');

      let err = form.querySelector('.spec-error');
      if (!err) {
        err = document.createElement('div');
        err.className = 'spec-error';
        err.setAttribute('role', 'alert');
        err.style.cssText = 'margin-top:1rem;padding:0.75rem;border-radius:6px;background:#fff5f5;color:#742a2a;border:1px solid #feb2b2;display:none;';
        form.appendChild(err);
      }
      err.style.display = 'none';

      const label = btn.textContent;
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.textContent = 'Sending...';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json().catch(() => ({}));
        if (res.ok && result.success) {
          closeSpecRequest();
          showSpecToast('Your request has been submitted successfully.');
          return;
        }
        throw new Error(result.message || 'submit failed');
      } catch (ex) {
        console.error('Spec request error:', ex);
        err.textContent = 'Failed to submit your request. Please try again or email customer@inhbiomat.com.';
        err.style.display = 'block';
        btn.disabled = false;
        btn.style.opacity = '';
        btn.textContent = label;
      }
    });
  };

  function showSpecToast(msg) {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;bottom:2rem;transform:translateX(-50%);background:#22543d;color:#fff;padding:0.9rem 1.5rem;border-radius:6px;z-index:10001;box-shadow:0 4px 12px rgba(0,0,0,.25);max-width:90vw;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  // Initialize
  loadProductData();
})();
