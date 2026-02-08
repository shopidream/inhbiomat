// i18n.js - Internationalization handler
(function() {
  // Current language (default: English)
  let currentLang = localStorage.getItem('preferredLanguage') || 'en';
  let translations = {};

  // Load translation file
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`./lang/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }
      translations = await response.json();
      return translations;
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        return loadTranslations('en');
      }
      return {};
    }
  }

  // Apply translations to DOM elements with data-i18n attribute
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        // Check if element has data-i18n-html attribute for HTML content
        if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translations[key];
        } else {
          element.textContent = translations[key];
        }
      }
    });

    // Apply translations to placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        element.placeholder = translations[key];
      }
    });

    // Apply translations to title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      if (translations[key]) {
        element.title = translations[key];
      }
    });

    // Update meta tags
    updateMetaTags();
  }

  // Update meta tags based on current page
  function updateMetaTags() {
    const path = window.location.pathname;
    let titleKey, descKey;

    if (path.includes('products.html')) {
      titleKey = 'meta_title_products';
      descKey = 'meta_desc_products';
    } else if (path.includes('product-detail.html')) {
      titleKey = 'meta_title_detail';
      descKey = 'meta_desc_detail';
    } else if (path.includes('quote.html')) {
      titleKey = 'meta_title_quote';
      descKey = 'meta_desc_quote';
    } else {
      titleKey = 'meta_title_home';
      descKey = 'meta_desc_home';
    }

    // Update title
    if (translations[titleKey]) {
      document.title = translations[titleKey];
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations[descKey]) {
      metaDesc.setAttribute('content', translations[descKey]);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle && translations['og_title']) {
      ogTitle.setAttribute('content', translations['og_title']);
    }
    if (ogDesc && translations['og_desc']) {
      ogDesc.setAttribute('content', translations['og_desc']);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterTitle && translations['og_title']) {
      twitterTitle.setAttribute('content', translations['og_title']);
    }
    if (twitterDesc && translations['og_desc']) {
      twitterDesc.setAttribute('content', translations['og_desc']);
    }
  }

  // Get translation for a key
  function t(key, defaultValue = '') {
    return translations[key] || defaultValue || key;
  }

  // Set current language
  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);

    // Load translations
    await loadTranslations(lang);

    // Apply to DOM
    applyTranslations();

    // Update language selector if exists
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.value = lang;
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Trigger custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // Get current language
  function getCurrentLanguage() {
    return currentLang;
  }

  // Initialize language selector
  function initLanguageSelector() {
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.value = currentLang;
      langSelect.addEventListener('change', async (e) => {
        await setLanguage(e.target.value);
        // Reload current page data if needed
        window.location.reload();
      });
    }
  }

  // Initialize i18n
  async function init() {
    await loadTranslations(currentLang);
    applyTranslations();
    initLanguageSelector();
    document.documentElement.lang = currentLang;
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions to global scope
  window.i18n = {
    t,
    setLanguage,
    getCurrentLanguage,
    applyTranslations,
    loadTranslations
  };
})();
