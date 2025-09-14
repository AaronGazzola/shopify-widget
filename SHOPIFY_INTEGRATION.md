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

- Create/select theme in Shopify
- Click the three dots next to the theme to select "edit code"
- Add a file to `sections/` and paste the content from the file at `shopify/widget-section.liquid`
- Add a file to `assets/` called `lifestyle-widget.css` and paste the content from the file at `shopify/lifestyle-widget.css`

### 4. Configure Widget URLs

After adding the section to your theme, you need to configure the widget URLs:

1. **Go to Theme Customizer**:

   - Navigate to **Online Store > Themes**
   - Click **Customize** on your active theme

2. **Add the Widget Section**:

   - Navigate to a product page in the customizer
   - Click **Add section** and select **Lifestyle Widget**

3. **Configure URLs**:

   - **Widget script URL**: `https://shopify-widget.vercel.app/widget.js`
   - **Widget API URL**: `https://shopify-widget.vercel.app`
   - **Fallback SKU**: Set to one of your test product SKUs (e.g., `ABC123`)

4. **Save and Preview**:
   - Click **Save** to apply changes
   - Preview the product page to see the widget in action
