# Shopify AI Lifestyle Widget - Minimal Demo Tasks

## Core Infrastructure

### Database Setup

- [x] Create Supabase project with minimal schema:
  - `skus` (id, sku_code, product_name)
  - `renders` (id, sku_id, image_url, is_active)
  - `events` (id, sku_id, event_type, session_id, created_at)
  - `likes` (id, sku_id, session_id, created_at, unique constraint)
- [x] Insert sample data for 3-5 test SKUs with 2 renders each

### Next.js Project Setup

- [x] Initialize Next.js project with TypeScript
- [x] Install core dependencies: `@supabase/supabase-js`, `uuid`, `prisma`, `@tanstack/react-query`, `zustand`
- [x] Configure Supabase client connection
- [x] Set up environment variables

## Essential Backend APIs

### Core Endpoints

- [x] **`/api/renders`** - Fetch 2 lifestyle images by SKU

  ```typescript
  GET /api/renders?sku=ABC123
  Response: [{ id, image_url, alt_text }]
  ```

- [x] **`/api/events`** - Log user interactions

  ```typescript
  POST / api / events;
  Body: {
    sku_id, event_type, session_id;
  }
  ```

- [x] **`/api/likes`** - Toggle like status
  ```typescript
  POST /api/likes
  Body: { sku_id, session_id }
  Response: { liked: boolean, total_likes: number }
  ```

### Database Helpers

- [x] Create Supabase client (`/lib/supabase.ts`)
- [x] Create Prisma client (`/lib/prisma.ts`)
- [x] Build session management utility (`/lib/session.utils.ts`)
- [x] Create basic error handling (`/lib/action.utils.ts`)

## Frontend Widget

### Core Widget Component

- [x] Create `LifestyleWidget` component that:
  - Accepts SKU as prop
  - Fetches 2 lifestyle images from API
  - Displays images in responsive 2-column grid
  - Shows loading state while fetching
  - Handles API errors gracefully

### Interactive Features

- [x] Implement like button with:

  - Heart icon toggle (filled/outline)
  - Click handler that calls likes API
  - Display total like count
  - Session persistence

- [x] Add event tracking:
  - Log "view" event on widget load
  - Log "like" event on like button click
  - Generate session ID for user tracking

### Shopify Integration

- [x] Create embeddable widget script:
  - Auto-detect SKU from current product page
  - Initialize widget on page load
  - Handle multiple Shopify theme layouts

## Minimal Dashboard

### Analytics View

- [x] Create dashboard page (`/app/dashboard`) with:
  - Table showing SKU performance (views, likes, CTR)
  - Basic filtering by date range (last 7, 30, 90 days)
  - Real-time data fetching and loading states

### Data Aggregation

- [x] Build analytics API endpoint:
  ```typescript
  GET /api/analytics?days=7
  Response: { sku_performance: [{ sku, product_name, views, likes, ctr }] }
  ```

## Demo Test Suite

### Integration Test

- [x] Create single comprehensive test file that verifies:
  - Widget loads with valid SKU
  - Images display correctly from database
  - Like button functions and persists across sessions
  - Events are logged to database
  - Dashboard displays aggregated data correctly
  - Widget works when embedded in Shopify product page

### Test Data

- [x] Create test database seeder with:
  - 5 sample SKUs with realistic product names
  - 10 lifestyle images (2 per SKU)
  - Mock event data for dashboard testing

## Production Setup

### Deployment

- [x] Deploy to Vercel with:
  - Environment variables configured

### Shopify Demo Store

- [x] Create test Shopify store or use existing
- [x] Install widget on product page via theme customization
- [x] Verify widget functionality in live Shopify environment

## Demo Deliverables

### Live Demo

- [x] Working Shopify store with widget installed
- [x] Functional dashboard with real interaction data
- [x] All APIs responding correctly

### Code Repository

- [x] Clean, well-structured codebase following CLAUDE.md patterns
- [x] Comprehensive README with setup instructions
- [x] Environment variable template (`.env.example`)
- [x] Database scripts and seeder (`npm run db:push`, `npm run db:seed`)

## Success Criteria

The demo successfully demonstrates:

1. **Widget Integration**: Images load correctly on Shopify product pages
2. **User Interaction**: Like functionality works and persists across sessions
3. **Data Flow**: Events are tracked and stored in database
4. **Analytics**: Dashboard shows meaningful performance metrics
5. **Scalability**: Architecture supports adding more SKUs and features
