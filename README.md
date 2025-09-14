# Shopify AI Lifestyle Widget

A minimal demonstration of an AI-powered lifestyle widget for Shopify stores that showcases product images with interactive like functionality and analytics tracking.

## Features

- **Lifestyle Widget**: Displays 2 lifestyle images per SKU in a responsive 2-column grid
- **Interactive Likes**: Users can like images with persistent session-based tracking
- **Event Tracking**: Captures view and like events for analytics
- **Analytics Dashboard**: Performance metrics including views, likes, and CTR
- **Shopify Integration**: Embeddable widget script that auto-detects product SKUs
- **Real-time Updates**: Like counts update immediately across sessions

## Tech Stack

- **Next.js 15** with TypeScript and App Directory
- **TailwindCSS v4** for styling
- **Prisma ORM** for database queries and type safety
- **Supabase** for database and authentication
- **React Query** for state management and caching
- **Zustand** for client-side state
- **Vercel** for deployment

## Quick Start

### 1. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://user:password@host:port/database
```

### 2. Database Setup

Create and seed the database:

```bash
npm run db:push
npm run db:seed
```

### 3. Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo.

## API Endpoints

### GET /api/renders?sku={sku}

Fetch 2 lifestyle images for a given SKU.

**Response:**

```json
[
  {
    "id": "render_id",
    "image_url": "https://example.com/image.jpg",
    "alt_text": "Product lifestyle image"
  }
]
```

### POST /api/events

Log user interaction events.

**Request:**

```json
{
  "sku_id": "sku_id",
  "event_type": "view|like",
  "session_id": "session_id"
}
```

### POST /api/likes

Toggle like status for a SKU.

**Request:**

```json
{
  "sku_id": "sku_id",
  "session_id": "session_id"
}
```

**Response:**

```json
{
  "liked": true,
  "total_likes": 5
}
```

### GET /api/analytics?days={days}

Get performance analytics for the specified time period.

**Response:**

```json
{
  "sku_performance": [
    {
      "sku": "ABC123",
      "product_name": "Premium Headphones",
      "views": 100,
      "likes": 15,
      "ctr": 15.0
    }
  ]
}
```

## Components

### LifestyleWidget

The main widget component that displays lifestyle images with like functionality.

```tsx
import { LifestyleWidget } from "@/app/widget/LifestyleWidget";

<LifestyleWidget sku="ABC123" />;
```

## Shopify Integration

### 1. Widget Script

Include the widget script in your Shopify theme:

```html
<script src="https://your-domain.vercel.app/widget.js"></script>
```

### 2. Auto-detection

The widget automatically detects the product SKU from:

- URL path (`/products/product-handle`)
- Meta tags (`product:retailer_item_id`)
- JSON-LD structured data

### 3. Manual Integration

For custom integration, use:

```javascript
// Initialize on specific SKU
LifestyleWidget.load("ABC123", "widget-container-id");

// Auto-detect and initialize
LifestyleWidget.init();
```

## Database Schema

The widget uses 4 main tables:

- **skus**: Product information (sku_code, product_name)
- **renders**: Lifestyle images (sku_id, image_url, is_active)
- **events**: User interactions (sku_id, event_type, session_id)
- **likes**: Like tracking (sku_id, session_id, unique constraint)

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Demo Pages

- **Analytics Dashboard** (`/`): View performance metrics
- **Widget Demo** (`/demo`): Test the widget with sample SKUs

## Development Commands

```bash
# Development
npm run dev

# Database
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio

# Production
npm run build
npm run start
```

## Sample Data

The seeder creates 5 sample products with lifestyle images:

- Premium Wireless Headphones (ABC123)
- Smart Fitness Watch (DEF456)
- Organic Cotton T-Shirt (GHI789)
- Minimalist Laptop Bag (JKL012)
- Eco-Friendly Water Bottle (MNO345)

## Success Criteria

The demo successfully demonstrates:

1. ✅ **Widget Integration**: Lifestyle images load correctly on product pages
2. ✅ **User Interaction**: Like functionality works and persists across sessions
3. ✅ **Data Flow**: Events are tracked and stored in database
4. ✅ **Analytics**: Dashboard shows meaningful performance metrics
5. ✅ **Scalability**: Architecture supports adding more SKUs and features
