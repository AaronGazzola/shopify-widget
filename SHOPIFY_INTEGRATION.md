# Shopify Integration Guide

## Creating a Test Shopify Store

### 1. Create Development Store

1. **Sign up for Shopify Partners Account** (free):

   - Go to https://partners.shopify.com
   - Create account or login
   - Navigate to "Stores" in your partner dashboard

2. **Create Development Store**:

   - Click "Add store" → "Create development store"
   - Store name: `lifestyle-widget-demo`
   - Store type: "Development store"
   - Purpose: "Test an app or theme"

3. **Access Your Store**:
   - Once created, click "Login" to access admin
   - Your store URL will be: `lifestyle-widget-demo.myshopify.com`

### 2. Add Sample Products

Add these test products that match your seeded SKUs:

1. **Premium Wireless Headphones** (SKU: ABC123)
2. **Smart Fitness Watch** (SKU: DEF456)
3. **Organic Cotton T-Shirt** (SKU: GHI789)
4. **Minimalist Laptop Bag** (SKU: JKL012)
5. **Eco-Friendly Water Bottle** (SKU: MNO345)

### 3. Install Widget in Theme using Shopify App Blocks

Create a custom section for the widget:

- Add a liquid code section to the page
- Pase the code below:

```liquid
<div class="lifestyle-widget-section">
  {% if section.settings.show_heading %}
    <h2 class="widget-heading">{{ section.settings.heading | default: "Style Inspiration" }}</h2>
  {% endif %}

  <div
    id="lifestyle-widget-{{ section.id }}"
    data-lifestyle-widget
    data-sku="{{ product.variants.first.sku | default: section.settings.fallback_sku }}"
    data-api-url="{{ section.settings.api_url | default: 'https://shopify-widget.vercel.app' }}"
  >
    <div class="lifestyle-widget-container">
      <div class="lifestyle-widget-loading">Loading lifestyle images...</div>
    </div>
  </div>
</div>

<script>
  // Initialize widget when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.src = '{{ section.settings.widget_url | default: "https://shopify-widget.vercel.app/widget.js" }}';
    script.async = true;
    script.onload = function() {
      console.log('Widget script loaded successfully');
      if (window.LifestyleWidget) {
        window.LifestyleWidget.init();
      }
    };
    script.onerror = function() {
      console.error('Failed to load widget script');
      const widget = document.querySelector('[data-lifestyle-widget]');
      if (widget) {
        widget.innerHTML = '<div class="lifestyle-widget-error">Failed to load widget</div>';
      }
    };
    document.head.appendChild(script);
  });
</script>

<style>
.lifestyle-widget-section {
  margin: {{ section.settings.margin_top }}px 0 {{ section.settings.margin_bottom }}px 0;
  padding: 0 {{ section.settings.padding_horizontal }}px;
}

.widget-heading {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: {{ section.settings.heading_size }}px;
  color: {{ section.settings.heading_color }};
}

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

.lifestyle-widget-error {
  text-align: center;
  color: #ef4444;
  padding: 20px;
  font-size: 14px;
}
</style>

{% schema %}
{
  "name": "Lifestyle Widget",
  "tag": "section",
  "class": "section",
  "settings": [
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
      "default": "Style Inspiration"
    },
    {
      "type": "range",
      "id": "heading_size",
      "min": 16,
      "max": 32,
      "step": 2,
      "unit": "px",
      "label": "Heading size",
      "default": 24
    },
    {
      "type": "color",
      "id": "heading_color",
      "label": "Heading color",
      "default": "#333333"
    },
    {
      "type": "url",
      "id": "widget_url",
      "label": "Widget script URL",
      "info": "URL to your deployed widget script"
    },
    {
      "type": "url",
      "id": "api_url",
      "label": "Widget API URL",
      "info": "Base URL for widget API calls"
    },
    {
      "type": "text",
      "id": "fallback_sku",
      "label": "Fallback SKU",
      "default": "ABC123",
      "info": "SKU to use when product SKU is not available"
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
      "category": "Product"
    }
  ]
}
{% endschema %}
```
