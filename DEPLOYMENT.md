# Deployment Guide

## Vercel Deployment

### Prerequisites

1. **Environment Variables**: Ensure your `.env` has correct values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
   ```

2. **Database Setup**: Run database migrations and seed data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add all the environment variables from your `.env.local`

### CORS Configuration

The project includes automatic CORS configuration for:
- All API endpoints (`/api/*`)
- Widget embed script (`/widget.js`)
- Shopify store domains

Configuration is in:
- `next.config.js` - Next.js headers
- `vercel.json` - Vercel-specific settings

### Widget Integration

After deployment, integrate the widget into Shopify stores using:

```html
<!-- In your Shopify theme -->
<div id="lifestyle-widget" data-lifestyle-widget data-sku="YOUR_SKU"></div>
<script src="https://your-domain.vercel.app/widget.js"></script>
```

### Custom Domain (Optional)

1. In Vercel Dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### Monitoring

- Check Vercel Functions logs for API performance
- Monitor Supabase metrics for database usage
- Use Vercel Analytics for widget usage tracking

## Success Criteria

✅ Application deploys without errors
✅ All API endpoints respond correctly
✅ Widget embed script loads and functions
✅ CORS headers allow Shopify domain access
✅ Database connections work in production
✅ Environment variables are properly configured