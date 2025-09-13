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

### 3. Install Widget in Theme

#### Method 1: Theme Code Integration

1. **Access Theme Editor**:
   - Go to Online Store → Themes
   - Click "Actions" → "Edit code" on your active theme

2. **Add Widget Container** in product template:
   - Open `sections/product-form.liquid` or `templates/product.liquid`
   - Add this code where you want the widget to appear:

```liquid
<!-- Lifestyle Widget -->
<div class="lifestyle-widget-container">
  <h3>Style It Your Way</h3>
  <div id="lifestyle-widget" data-lifestyle-widget data-sku="{{ product.variants.first.sku }}"></div>
</div>

<!-- Widget Script -->
<script src="https://your-domain.vercel.app/widget.js" async></script>

<style>
.lifestyle-widget-container {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fafafa;
}

.lifestyle-widget-container h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #333;
}
</style>
```

#### Method 2: Using Shopify App Blocks (Recommended)

Create a custom section for the widget:

1. **Create New Section**:
   - In theme editor, create new file: `sections/lifestyle-widget.liquid`

2. **Section Code**:
```liquid
<div class="lifestyle-widget-section">
  {% if section.settings.show_heading %}
    <h2 class="widget-heading">{{ section.settings.heading | default: "Style Inspiration" }}</h2>
  {% endif %}

  <div
    id="lifestyle-widget-{{ section.id }}"
    data-lifestyle-widget
    data-sku="{{ product.variants.first.sku | default: section.settings.fallback_sku }}"
  ></div>
</div>

<script src="{{ section.settings.widget_url | default: 'https://your-domain.vercel.app/widget.js' }}" async></script>

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

3. **Add Section to Product Template**:
   - Edit your product template
   - Add the section where desired

### 4. Testing Checklist

- [ ] Widget loads on product pages
- [ ] Images display correctly
- [ ] Like buttons are functional
- [ ] Events are being logged
- [ ] SKU detection works correctly
- [ ] Widget works on different devices
- [ ] Widget works with different themes

### 5. Common Issues & Solutions

**Widget doesn't load:**
- Check console for JavaScript errors
- Verify widget script URL is correct
- Ensure CORS headers are properly configured

**Images don't appear:**
- Verify SKU matches seeded data
- Check database connection
- Verify API endpoints are responding

**SKU detection fails:**
- Add manual SKU using `data-sku` attribute
- Check Shopify product variant SKU field
- Use fallback SKU in section settings

### 6. Going Live

1. **Custom Domain**: Set up custom domain for production
2. **SSL Certificate**: Ensure HTTPS is enabled
3. **Performance**: Monitor widget load times
4. **Analytics**: Set up tracking for widget interactions

## Demo Store Credentials

After creating your development store, you can access it at:
- **Store URL**: `https://lifestyle-widget-demo.myshopify.com`
- **Admin URL**: `https://lifestyle-widget-demo.myshopify.com/admin`
- **Use your Shopify Partners credentials to login**

## Support

For integration issues:
1. Check browser console for errors
2. Verify environment variables in Vercel
3. Test widget functionality on the demo page first
4. Ensure database is properly seeded