import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku') || 'AUTO_DETECT'

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const widgetScript = `
(function() {
  'use strict';

  const WIDGET_BASE_URL = '${baseUrl}';
  const DEFAULT_SKU = '${sku}';

  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = WIDGET_BASE_URL + '/widget-styles.css';
    document.head.appendChild(link);
  }

  function getProductSKU() {
    if (DEFAULT_SKU && DEFAULT_SKU !== 'AUTO_DETECT') {
      return DEFAULT_SKU;
    }

    try {
      if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product) {
        const product = window.ShopifyAnalytics.meta.product;
        if (product.variants && product.variants.length > 0) {
          return product.variants[0].sku;
        }
      }

      const metaProduct = document.querySelector('meta[name="shopify-product-handle"]');
      if (metaProduct) {
        return metaProduct.getAttribute('content');
      }

      const urlPath = window.location.pathname;
      const productMatch = urlPath.match(/\\/products\\/([^\\/?]+)/);
      if (productMatch) {
        return productMatch[1];
      }

      return 'ABC123';
    } catch (e) {
      console.log('Error detecting SKU:', e);
      return 'ABC123';
    }
  }

  function createWidget(containerId, sku) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Widget container not found:', containerId);
      return;
    }

    container.innerHTML = '<div class="lifestyle-widget-loading">Loading lifestyle images...</div>';

    const iframe = document.createElement('iframe');
    iframe.src = WIDGET_BASE_URL + '/widget?sku=' + encodeURIComponent(sku) + '&embed=true';
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '400px';
    iframe.style.background = 'transparent';
    iframe.setAttribute('scrolling', 'no');

    iframe.onload = function() {
      container.innerHTML = '';
      container.appendChild(iframe);

      window.addEventListener('message', function(event) {
        if (event.origin !== WIDGET_BASE_URL) return;

        if (event.data && event.data.type === 'WIDGET_RESIZE') {
          iframe.style.height = event.data.height + 'px';
        }
      });
    };

    iframe.onerror = function() {
      container.innerHTML = '<div class="lifestyle-widget-error">Failed to load lifestyle images</div>';
    };
  }

  function initWidget() {
    const sku = getProductSKU();
    const containers = document.querySelectorAll('[data-lifestyle-widget]');

    containers.forEach(function(container) {
      const customSku = container.getAttribute('data-sku') || sku;
      createWidget(container.id || 'lifestyle-widget-' + Math.random().toString(36).substr(2, 9), customSku);
    });

    if (containers.length === 0) {
      const defaultContainer = document.getElementById('lifestyle-widget');
      if (defaultContainer) {
        createWidget('lifestyle-widget', sku);
      }
    }
  }

  function addDefaultStyles() {
    const style = document.createElement('style');
    style.textContent = \`
      .lifestyle-widget-loading {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .lifestyle-widget-error {
        text-align: center;
        padding: 2rem;
        color: #ef4444;
        font-size: 0.875rem;
      }

      [data-lifestyle-widget] {
        max-width: 28rem;
        margin: 0 auto;
      }
    \`;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      addDefaultStyles();
      initWidget();
    });
  } else {
    addDefaultStyles();
    initWidget();
  }

  window.LifestyleWidget = {
    init: initWidget,
    createWidget: createWidget,
    getProductSKU: getProductSKU
  };
})();`

  return new NextResponse(widgetScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}