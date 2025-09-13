# Shopify AI Lifestyle Widget - Minimal Demo Tasks

## Core Infrastructure

### Database Setup

- [ ] Create Supabase project with minimal schema:
  - `skus` (id, sku_code, product_name)
  - `renders` (id, sku_id, image_url, is_active)
  - `events` (id, sku_id, event_type, session_id, created_at)
  - `likes` (id, sku_id, session_id, created_at, unique constraint)
- [ ] Insert sample data for 3-5 test SKUs with 2 renders each
- [ ] Configure basic RLS policies

### Next.js Project Setup

- [ ] Initialize Next.js project with TypeScript
- [ ] Install core dependencies: `@supabase/supabase-js`, `uuid`
- [ ] Configure Supabase client connection
- [ ] Set up environment variables

## Essential Backend APIs

### Core Endpoints

- [ ] **`/api/renders`** - Fetch 2 lifestyle images by SKU

  ```typescript
  GET /api/renders?sku=ABC123
  Response: [{ id, image_url, alt_text }]
  ```

- [ ] **`/api/events`** - Log user interactions

  ```typescript
  POST / api / events;
  Body: {
    sku_id, event_type, session_id;
  }
  ```

- [ ] **`/api/likes`** - Toggle like status
  ```typescript
  POST /api/likes
  Body: { sku_id, session_id }
  Response: { liked: boolean, total_likes: number }
  ```

### Database Helpers

- [ ] Create Supabase client (`/lib/supabase.ts`)
- [ ] Build session management utility
- [ ] Create basic error handling

## Frontend Widget

### Core Widget Component

- [ ] Create `LifestyleWidget` component that:
  - Accepts SKU as prop
  - Fetches 2 lifestyle images from API
  - Displays images in responsive 2-column grid
  - Shows loading state while fetching
  - Handles API errors gracefully

### Interactive Features

- [ ] Implement like button with:

  - Heart icon toggle (filled/outline)
  - Click handler that calls likes API
  - Display total like count
  - Session persistence

- [ ] Add event tracking:
  - Log "view" event on widget load
  - Log "like" event on like button click
  - Generate session ID for user tracking

### Shopify Integration

- [ ] Create embeddable widget script:
  - Auto-detect SKU from current product page
  - Initialize widget on page load
  - Handle multiple Shopify theme layouts

## Minimal Dashboard

### Analytics View

- [ ] Create dashboard page (`/pages/dashboard`) with:
  - Table showing SKU performance (impressions, likes, CTR)
  - Basic filtering by date range (last 7 days, 30 days)
  - Simple bar chart showing top performing SKUs

### Data Aggregation

- [ ] Build analytics API endpoint:
  ```typescript
  GET /api/analytics?days=7
  Response: { sku_performance: [{ sku, views, likes, ctr }] }
  ```

## Demo Test Suite

### Integration Test

- [ ] Create single comprehensive test file that verifies:
  - Widget loads with valid SKU
  - Images display correctly from database
  - Like button functions and persists across sessions
  - Events are logged to database
  - Dashboard displays aggregated data correctly
  - Widget works when embedded in mock Shopify product page

### Test Data

- [ ] Create test database seeder with:
  - 3 sample SKUs with realistic product names
  - 6 lifestyle images (2 per SKU)
  - Mock event data for dashboard testing

## Production Setup

### Deployment

- [ ] Deploy to Vercel with:
  - Environment variables configured
  - Custom domain setup
  - CORS configured for Shopify domains

### Shopify Demo Store

- [ ] Create test Shopify store or use existing
- [ ] Install widget on product page via theme customization
- [ ] Verify widget functionality in live Shopify environment

## Demo Deliverables

### Live Demo

- [ ] Working Shopify store with widget installed
- [ ] Functional dashboard with real interaction data
- [ ] All APIs responding correctly

### Code Repository

- [ ] Clean, commented codebase on GitHub
- [ ] README with setup instructions
- [ ] Environment variable template
- [ ] Single command deployment setup

## Key Dependencies

```bash
# Essential only
npm install @supabase/supabase-js next react react-dom typescript
npm install @types/react @types/node uuid
npm install --save-dev jest @testing-library/react
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Success Criteria

The demo successfully demonstrates:

1. **Widget Integration**: Lifestyle images load correctly on Shopify product pages
2. **User Interaction**: Like functionality works and persists across sessions
3. **Data Flow**: Events are tracked and stored in database
4. **Analytics**: Dashboard shows meaningful performance metrics
5. **Scalability**: Architecture supports adding more SKUs and features

This minimal version proves the core concept while remaining lightweight enough to build quickly for demo purposes.
