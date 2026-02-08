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
      const indexResponse = await fetch('/data/products-index.json');
      const index = await indexResponse.json();

      const productInfo = index.products.find(p => p.id === productId);
      if (!productInfo) {
        showError(`Product not found: ${productId}`);
        return;
      }

      // Load the specific product JSON
      const productResponse = await fetch(`/data/products/${productInfo.jsonFile}`);
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
          <a href="/prototype/products.html" class="btn btn-primary">Back to Products</a>
        </p>
      </div>
    `;
  }

  // Render product details
  function renderProduct() {
    // Update breadcrumb
    document.getElementById('breadcrumb-product').textContent = productData.shortName;
    document.title = `${productData.productName} - ING Global`;

    // Render header
    renderHeader();

    // Render tab contents
    renderOverview();
    renderSpecifications();
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
          <a href="/prototype/quote.html?product=${productData.productId}" class="btn btn-primary" data-i18n="request_quote">Request Quote</a>
          <button class="btn btn-outline" onclick="window.print()" data-i18n="download_pdf">Download PDF</button>
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
          <h2>Product Images</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- Main Image -->
            <div style="display: flex; justify-content: center; align-items: center; background-color: #f7fafc; border-radius: 8px; padding: 2rem; min-height: 400px;">
              <img id="main-product-image"
                   src="/product_images/${productData.images[0]}"
                   alt="${getLocalizedText(productData.productName)}"
                   style="max-width: 100%; max-height: 500px; object-fit: contain; border-radius: 4px;">
            </div>

            <!-- Thumbnail Gallery -->
            ${productData.images.length > 1 ? `
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                ${productData.images.map((img, idx) => `
                  <button onclick="changeProductImage('${img}', ${idx})"
                          id="thumb-${idx}"
                          class="image-thumbnail ${idx === 0 ? 'active' : ''}"
                          style="border: 2px solid ${idx === 0 ? '#3182ce' : '#e2e8f0'}; border-radius: 4px; padding: 4px; background-color: #fff; cursor: pointer; transition: all 0.2s;">
                    <img src="/product_images/${img}"
                         alt="View ${idx + 1}"
                         style="width: 80px; height: 80px; object-fit: cover; display: block; border-radius: 2px;">
                  </button>
                `).join('')}
              </div>
            ` : ''}
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

  // Render Specifications tab
  function renderSpecifications() {
    const specs = document.getElementById('specifications');
    specs.innerHTML = `
      ${renderPhysicalProperties()}
      ${renderChemicalProperties()}
      ${renderTraceElements()}
    `;
  }

  // Render Physical Properties
  function renderPhysicalProperties() {
    const props = productData.properties.physical;
    if (!props) return '';

    return `
      <div class="card">
        <h2>Physical Properties</h2>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            ${props.appearance ? `
              <tr>
                <td><strong>Appearance</strong></td>
                <td colspan="2">${props.appearance}</td>
              </tr>
            ` : ''}
            ${props.color ? `
              <tr>
                <td><strong>Color</strong></td>
                <td colspan="2">${props.color}</td>
              </tr>
            ` : ''}
            ${props.density ? `
              <tr>
                <td><strong>Density</strong></td>
                <td>${props.density.value}</td>
                <td>${props.density.method || ''}</td>
              </tr>
            ` : ''}
            ${props.specificDensity ? `
              <tr>
                <td><strong>Specific Density</strong></td>
                <td>${props.specificDensity.value}</td>
                <td>${props.specificDensity.method || ''}</td>
              </tr>
            ` : ''}
            ${props.bulkDensity ? `
              <tr>
                <td><strong>Bulk Density</strong></td>
                <td>${props.bulkDensity}</td>
                <td></td>
              </tr>
            ` : ''}
            ${props.diameter ? `
              <tr>
                <td><strong>Diameter</strong></td>
                <td>${props.diameter}</td>
                <td></td>
              </tr>
            ` : ''}
            ${props.aspectRatio ? `
              <tr>
                <td><strong>Aspect Ratio</strong></td>
                <td>${props.aspectRatio}</td>
                <td></td>
              </tr>
            ` : ''}
            ${props.roughness ? `
              <tr>
                <td><strong>Surface Roughness</strong></td>
                <td>${props.roughness.value}</td>
                <td>${props.roughness.substrate ? `on ${props.roughness.substrate}` : ''}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>
    `;
  }

  // Render Chemical Properties
  function renderChemicalProperties() {
    const chem = productData.properties.chemical;
    if (!chem) return '';

    return `
      <div class="card">
        <h2>Chemical Properties</h2>

        <div class="property-list">
          <div class="property-label">Chemical Formula</div>
          <div class="property-value"><code>${chem.chemicalFormula}</code></div>

          ${chem.synonyms && chem.synonyms.length > 0 ? `
            <div class="property-label">Synonyms</div>
            <div class="property-value">${chem.synonyms.join(', ')}</div>
          ` : ''}

          ${chem.description ? `
            <div class="property-label">Description</div>
            <div class="property-value">${chem.description}</div>
          ` : ''}
        </div>

        ${chem.composition ? `
          <h3 style="margin-top: 1.5rem;">Composition</h3>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Percentage</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              ${chem.composition.components.map(comp => `
                <tr>
                  <td><strong>${comp.name}</strong></td>
                  <td>${comp.percentage}</td>
                  <td>${chem.composition.method || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${chem.composition.notes ? `
            <div style="margin-top: 1rem; font-size: 0.875rem; color: #718096;">
              ${chem.composition.notes.map(note => `<p>• ${note}</p>`).join('')}
            </div>
          ` : ''}
        ` : ''}
      </div>
    `;
  }

  // Render Trace Elements
  function renderTraceElements() {
    const trace = productData.properties.chemical?.traceElements;
    if (!trace) return '';

    return `
      <div class="card">
        <h2>Trace Elements</h2>
        <p style="margin-bottom: 1rem;">
          <strong>Standard:</strong> ${trace.standard}
        </p>
        <table>
          <thead>
            <tr>
              <th>Element</th>
              <th>Limit</th>
            </tr>
          </thead>
          <tbody>
            ${trace.elements.arsenic ? `
              <tr>
                <td>Arsenic (As)</td>
                <td>${trace.elements.arsenic}</td>
              </tr>
            ` : ''}
            ${trace.elements.cadmium ? `
              <tr>
                <td>Cadmium (Cd)</td>
                <td>${trace.elements.cadmium}</td>
              </tr>
            ` : ''}
            ${trace.elements.mercury ? `
              <tr>
                <td>Mercury (Hg)</td>
                <td>${trace.elements.mercury}</td>
              </tr>
            ` : ''}
            ${trace.elements.lead ? `
              <tr>
                <td>Lead (Pb)</td>
                <td>${trace.elements.lead}</td>
              </tr>
            ` : ''}
            ${trace.elements.totalHeavyMetalsAsLead ? `
              <tr>
                <td><strong>Total heavy metals as lead</strong></td>
                <td><strong>${trace.elements.totalHeavyMetalsAsLead}</strong></td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>
    `;
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
            ${productData.notes.map(note =>
              `<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">• ${note}</p>`
            ).join('')}
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
            ${productData.notes.map(note =>
              `<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">• ${note}</p>`
            ).join('')}
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
                  <a href="/prototype/product-detail.html?id=${rel.id}" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
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
      const response = await fetch('/data/products-index.json');
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
            <a href="/prototype/product-detail.html?id=${p.id}"
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
      mainImage.src = `/product_images/${imageName}`;
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

  // Initialize
  loadProductData();
})();
