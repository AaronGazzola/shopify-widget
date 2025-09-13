# Shopify Theme Integration Templates

## Quick Start Integration

### Method 1: Direct Product Template Integration (Easiest)

Add this code to your product template (`templates/product.liquid` or `sections/product-form.liquid`):

```liquid
<!-- Lifestyle Widget Integration -->
<div class="lifestyle-widget-section" style="margin: 2rem 0; padding: 1.5rem; border: 1px solid #e5e5e5; border-radius: 8px; background: #fafafa;">
  <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem; color: #333; text-align: center;">Style Inspiration</h3>

  <!-- Widget Container -->
  <div
    id="lifestyle-widget-{{ product.variants.first.sku | default: 'ABC123' }}"
    data-lifestyle-widget
    data-sku="{{ product.variants.first.sku | default: 'ABC123' }}"
  ></div>
</div>

<!-- Widget Script -->
<script src="https://shopify-widget.vercel.app/widget.js" async></script>
```

### Method 2: Custom Section (Recommended for Theme Customization)

Create new file: `sections/lifestyle-widget.liquid`

```liquid
<div class="lifestyle-widget-section">
  {% if section.settings.show_heading %}
    <h2 class="lifestyle-widget-heading">{{ section.settings.heading | default: "Style Inspiration" }}</h2>
  {% endif %}

  <div
    id="lifestyle-widget-{{ section.id }}"
    data-lifestyle-widget
    data-sku="{{ product.variants.first.sku | default: section.settings.fallback_sku }}"
    style="min-height: 200px;"
  ></div>
</div>

<!-- Widget Script -->
<script src="{{ section.settings.widget_url | default: 'https://shopify-widget.vercel.app/widget.js' }}" async></script>

<style>
.lifestyle-widget-section {
  margin: {{ section.settings.margin_top }}px 0 {{ section.settings.margin_bottom }}px 0;
  padding: 0 {{ section.settings.padding_horizontal }}px;
  text-align: center;
}

.lifestyle-widget-heading {
  margin-bottom: 1.5rem;
  font-size: {{ section.settings.heading_size }}px;
  color: {{ section.settings.heading_color }};
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lifestyle-widget-section {
    padding: 0 {{ section.settings.padding_horizontal | divided_by: 2 }}px;
  }

  .lifestyle-widget-heading {
    font-size: {{ section.settings.heading_size | minus: 4 }}px;
  }
}
</style>

{% schema %}
{
  "name": "Lifestyle Widget",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "header",
      "content": "Widget Settings"
    },
    {
      "type": "checkbox",
      "id": "show_heading",
      "label": "Show heading",
      "default": true
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading text",
      "default": "Style Inspiration",
      "info": "Heading displayed above the widget"
    },
    {
      "type": "range",
      "id": "heading_size",
      "min": 16,
      "max": 36,
      "step": 2,
      "unit": "px",
      "label": "Heading font size",
      "default": 24
    },
    {
      "type": "color",
      "id": "heading_color",
      "label": "Heading color",
      "default": "#333333"
    },
    {
      "type": "header",
      "content": "Technical Settings"
    },
    {
      "type": "url",
      "id": "widget_url",
      "label": "Widget script URL",
      "default": "https://shopify-widget.vercel.app/widget.js",
      "info": "URL to your deployed widget script"
    },
    {
      "type": "text",
      "id": "fallback_sku",
      "label": "Fallback SKU",
      "default": "ABC123",
      "info": "SKU to use when product SKU is not available"
    },
    {
      "type": "header",
      "content": "Spacing"
    },
    {
      "type": "range",
      "id": "margin_top",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "px",
      "label": "Top margin",
      "default": 30
    },
    {
      "type": "range",
      "id": "margin_bottom",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "px",
      "label": "Bottom margin",
      "default": 30
    },
    {
      "type": "range",
      "id": "padding_horizontal",
      "min": 0,
      "max": 50,
      "step": 5,
      "unit": "px",
      "label": "Horizontal padding",
      "default": 15
    }
  ],
  "presets": [
    {
      "name": "Lifestyle Widget",
      "category": "Product",
      "settings": {
        "show_heading": true,
        "heading": "Style Inspiration"
      }
    }
  ]
}
{% endschema %}
```

### Method 3: Theme App Extension (Advanced)

For stores that prefer app-like integration, create: `blocks/lifestyle-widget.liquid`

```liquid
<div class="lifestyle-widget-block" {{ block.shopify_attributes }}>
  {% if block.settings.show_heading %}
    <h3 class="lifestyle-widget-title">{{ block.settings.title | default: "Style Inspiration" }}</h3>
  {% endif %}

  <div
    id="lifestyle-widget-block-{{ block.id }}"
    data-lifestyle-widget
    data-sku="{{ product.variants.first.sku | default: block.settings.fallback_sku }}"
    class="lifestyle-widget-container"
  ></div>
</div>

<script src="https://shopify-widget.vercel.app/widget.js" async></script>

<style>
.lifestyle-widget-block {
  margin: {{ block.settings.margin_vertical }}px 0;
}

.lifestyle-widget-title {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: {{ block.settings.title_color }};
}

.lifestyle-widget-container {
  text-align: center;
}
</style>

{% schema %}
{
  "name": "Lifestyle Widget",
  "target": "section",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_heading",
      "label": "Show heading",
      "default": true
    },
    {
      "type": "text",
      "id": "title",
      "label": "Widget title",
      "default": "Style Inspiration"
    },
    {
      "type": "color",
      "id": "title_color",
      "label": "Title color",
      "default": "#333333"
    },
    {
      "type": "text",
      "id": "fallback_sku",
      "label": "Fallback SKU",
      "default": "ABC123"
    },
    {
      "type": "range",
      "id": "margin_vertical",
      "min": 0,
      "max": 60,
      "step": 5,
      "unit": "px",
      "label": "Vertical margin",
      "default": 20
    }
  ]
}
{% endschema %}
```

## Installation Instructions

### For Method 1 (Direct Integration):
1. Go to **Online Store** → **Themes** → **Actions** → **Edit code**
2. Find your product template file (usually `templates/product.liquid` or `sections/product-form.liquid`)
3. Add the provided code where you want the widget to appear
4. **Save** the file

### For Method 2 (Custom Section):
1. Go to **Online Store** → **Themes** → **Actions** → **Edit code**
2. In the **Sections** folder, click **Add a new section**
3. Name it `lifestyle-widget`
4. Replace the default content with the provided code
5. **Save** the section
6. Go to your theme customizer and add the section to your product template

### For Method 3 (App Block):
1. Go to **Online Store** → **Themes** → **Actions** → **Edit code**
2. In the **Blocks** folder, click **Add a new block**
3. Name it `lifestyle-widget`
4. Replace the default content with the provided code
5. **Save** the block
6. The block will be available in the theme customizer

## Testing Checklist

After installation, verify these items work correctly:

- [ ] **Widget loads** on product pages
- [ ] **Images display** correctly from your database
- [ ] **Like buttons** are functional and show counts
- [ ] **SKU detection** works (check browser console for any warnings)
- [ ] **Events are logged** (verify in your dashboard)
- [ ] **Mobile responsive** design works properly
- [ ] **Loading states** display correctly
- [ ] **Error handling** works when no images are available

## Common SKU Issues & Solutions

### Issue: Widget shows "Could not detect SKU"
**Solutions:**
1. Ensure your product variants have SKU values in Shopify admin
2. Use the fallback SKU setting in the section
3. Manually set SKU: `data-sku="YOUR_SKU_HERE"`

### Issue: No images appear
**Solutions:**
1. Verify the SKU matches your seeded database data
2. Check your API endpoints are working: `https://shopify-widget.vercel.app/api/renders?sku=ABC123`
3. Ensure your database is properly seeded

### Issue: CORS errors
**Solutions:**
1. Verify your Vercel deployment has the correct CORS headers
2. Check the `vercel.json` configuration
3. Ensure you're using HTTPS URLs

## Advanced Customization

### Custom Styling

Add custom CSS to match your theme:

```liquid
<style>
/* Override widget styles */
.lifestyle-widget-container {
  max-width: 500px !important;
  margin: 0 auto !important;
}

.lifestyle-widget-grid {
  gap: 20px !important;
}

.lifestyle-widget-item img {
  border-radius: 12px !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}

.lifestyle-widget-like {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid #ddd !important;
}

/* Match your theme colors */
.lifestyle-widget-heart.filled {
  color: {{ settings.accent_color | default: '#ef4444' }} !important;
}
</style>
```

### Custom JavaScript Events

Listen for widget events in your theme:

```javascript
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Listen for widget load events
  window.addEventListener('lifestyle-widget-loaded', function(event) {
    console.log('Widget loaded for SKU:', event.detail.sku);

    // Track in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'widget_view', {
        'custom_parameter': event.detail.sku
      });
    }
  });

  // Listen for like events
  window.addEventListener('lifestyle-widget-like', function(event) {
    console.log('Item liked:', event.detail);

    // Track engagement
    if (typeof gtag !== 'undefined') {
      gtag('event', 'widget_engagement', {
        'event_category': 'lifestyle_widget',
        'event_label': event.detail.sku
      });
    }
  });
});
</script>
```

## Performance Optimization

### Lazy Loading
The widget automatically implements lazy loading for images, but you can enhance it:

```liquid
<!-- Add loading placeholder -->
<div id="lifestyle-widget-placeholder" style="height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #666;">
  <span>Loading lifestyle inspiration...</span>
</div>

<script>
// Replace placeholder when widget loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    const placeholder = document.getElementById('lifestyle-widget-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }, 1000);
});
</script>
```

### Preloading Critical Resources
```liquid
<!-- Add to theme.liquid head section -->
<link rel="preconnect" href="https://shopify-widget.vercel.app">
<link rel="dns-prefetch" href="https://shopify-widget.vercel.app">
```

## Support & Troubleshooting

### Debug Mode
Enable debug logging by adding this to your theme:

```javascript
<script>
window.LIFESTYLE_WIDGET_DEBUG = true;
</script>
```

### Browser Console Checks
Open browser console (F12) and look for:
- ✅ "Widget loaded successfully" - widget initialized
- ⚠️ "Could not detect SKU" - SKU detection failed
- ❌ "Failed to load renders" - API connection issue

### Test URLs
Test your API endpoints directly:
- Renders: `https://shopify-widget.vercel.app/api/renders?sku=ABC123`
- Analytics: `https://shopify-widget.vercel.app/api/analytics?days=7`