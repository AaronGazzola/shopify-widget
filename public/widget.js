(function() {
  'use strict';

  const WIDGET_API_BASE = 'https://shopify-widget.vercel.app';

  function createWidgetHTML(sku) {
    return `
      <div id="lifestyle-widget-${sku}" class="lifestyle-widget-container">
        <div class="lifestyle-widget-loading">Loading lifestyle images...</div>
      </div>
      <style>
        .lifestyle-widget-container {
          max-width: 400px;
          margin: 20px auto;
          padding: 16px;
        }
        .lifestyle-widget-loading {
          text-align: center;
          color: #666;
          padding: 40px 0;
        }
        .lifestyle-widget-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .lifestyle-widget-item {
          position: relative;
        }
        .lifestyle-widget-item img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 8px;
        }
        .lifestyle-widget-like {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .lifestyle-widget-heart {
          width: 20px;
          height: 20px;
        }
        .lifestyle-widget-heart.filled {
          color: #ef4444;
          fill: currentColor;
        }
        .lifestyle-widget-heart.outline {
          color: #666;
          fill: none;
        }
        .lifestyle-widget-count {
          font-size: 12px;
          color: #666;
        }
        .lifestyle-widget-error {
          text-align: center;
          color: #ef4444;
          padding: 20px;
          font-size: 14px;
        }
      </style>
    `;
  }

  function getSessionId() {
    let sessionId = localStorage.getItem('shopify-widget-session');
    if (!sessionId) {
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      localStorage.setItem('shopify-widget-session', sessionId);
    }
    return sessionId;
  }

  function createHeartIcon(filled = false) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `lifestyle-widget-heart ${filled ? 'filled' : 'outline'}`);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z');

    svg.appendChild(path);
    return svg;
  }

  async function logEvent(skuId, eventType) {
    try {
      await fetch(`${WIDGET_API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku_id: skuId,
          event_type: eventType,
          session_id: getSessionId()
        })
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  async function toggleLike(skuId) {
    try {
      const response = await fetch(`${WIDGET_API_BASE}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku_id: skuId,
          session_id: getSessionId()
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return null;
    }
  }

  async function loadWidget(sku, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const response = await fetch(`${WIDGET_API_BASE}/api/renders?sku=${sku}`);

      if (!response.ok) {
        throw new Error('Failed to load renders');
      }

      const renders = await response.json();

      if (renders.length === 0) {
        container.innerHTML = '<div class="lifestyle-widget-error">No lifestyle images available</div>';
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'lifestyle-widget-grid';

      renders.forEach(render => {
        const item = document.createElement('div');
        item.className = 'lifestyle-widget-item';

        const img = document.createElement('img');
        img.src = render.image_url;
        img.alt = render.alt_text;
        img.loading = 'lazy';

        const likeButton = document.createElement('div');
        likeButton.className = 'lifestyle-widget-like';

        const heart = createHeartIcon(false);
        const count = document.createElement('span');
        count.className = 'lifestyle-widget-count';
        count.textContent = '0';

        likeButton.appendChild(heart);
        likeButton.appendChild(count);

        likeButton.addEventListener('click', async () => {
          const result = await toggleLike(render.id);
          if (result) {
            heart.className = `lifestyle-widget-heart ${result.liked ? 'filled' : 'outline'}`;
            count.textContent = result.total_likes;
            await logEvent(render.id, 'like');
          }
        });

        item.appendChild(img);
        item.appendChild(likeButton);
        grid.appendChild(item);
      });

      container.innerHTML = '';
      container.appendChild(grid);

      await logEvent(renders[0].id, 'view');

    } catch (error) {
      console.error('Widget error:', error);
      container.innerHTML = '<div class="lifestyle-widget-error">Failed to load lifestyle images</div>';
    }
  }

  function detectSKU() {
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.includes('products') && pathSegments.length > 2) {
      return pathSegments[pathSegments.indexOf('products') + 1];
    }

    const metaProduct = document.querySelector('meta[property="product:retailer_item_id"]');
    if (metaProduct) {
      return metaProduct.getAttribute('content');
    }

    const jsonLD = document.querySelector('script[type="application/ld+json"]');
    if (jsonLD) {
      try {
        const data = JSON.parse(jsonLD.textContent);
        if (data.sku) return data.sku;
        if (data.productID) return data.productID;
      } catch (e) {}
    }

    return null;
  }

  function initWidget() {
    const sku = detectSKU();
    if (!sku) {
      console.warn('Could not detect SKU for lifestyle widget');
      return;
    }

    const targetElement = document.querySelector('.product-single__description, .product__description, .product-form');
    if (!targetElement) {
      console.warn('Could not find suitable element to insert lifestyle widget');
      return;
    }

    const widgetContainer = document.createElement('div');
    const containerId = `lifestyle-widget-${sku}`;
    widgetContainer.id = containerId;
    widgetContainer.innerHTML = createWidgetHTML(sku);

    targetElement.appendChild(widgetContainer);
    loadWidget(sku, containerId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  window.LifestyleWidget = {
    init: initWidget,
    load: loadWidget
  };
})();