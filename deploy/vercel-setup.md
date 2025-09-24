# 🚀 Vercel Deployment Guide

Deploy your React Interview Prep platform to Vercel in minutes with this comprehensive guide.

## ⚡ Quick Deploy (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/S1NAPANAHI/react-nextjs-interview-prep)

**Click the button above to deploy instantly!**

## 🔧 Manual Deployment

### Step 1: Prerequisites

1. **GitHub Account** with your repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project** - Set up at [supabase.com](https://supabase.com)

### Step 2: Vercel Setup

1. **Connect GitHub**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your `react-nextjs-interview-prep` repository

2. **Configure Project**:
   ```
   Project Name: react-interview-prep
   Framework Preset: Other
   Root Directory: ./
   Build Command: (leave empty - static site)
   Output Directory: (leave empty - static site)
   Install Command: (leave empty - no dependencies)
   ```

3. **Environment Variables**:
   - Click "Environment Variables"
   - Add these variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (~2-3 minutes)
   - Get your live URL: `https://your-project.vercel.app`

### Step 3: Configure Supabase

1. **Update CORS Settings**:
   - Go to Supabase Dashboard → Settings → API
   - Add your Vercel domain to "CORS origins":
   ```
   https://your-project.vercel.app
   https://your-project-git-main-yourusername.vercel.app
   https://your-project-yourusername.vercel.app
   ```

2. **Update Authentication Settings**:
   - Go to Authentication → Settings
   - Add your Vercel URL to "Site URL"
   - Add to "Redirect URLs" if using OAuth

### Step 4: Update Configuration

**Option A: Environment Variables (Recommended)**

Your `config/supabase.js` should read from environment variables:
```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'your-fallback-url';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-fallback-key';
```

**Option B: Direct Configuration**

Update `config/supabase.js` with your actual Supabase credentials:
```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## 🌐 Custom Domain Setup

### Add Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain (e.g., `interview-prep.yourdomain.com`)

2. **DNS Configuration**:
   - Add CNAME record: `interview-prep` → `cname.vercel-dns.com`
   - Or A record: `@` → `76.76.19.61`

3. **Update Supabase**:
   - Add your custom domain to CORS origins
   - Update Site URL in Authentication settings

## 🔒 Security & Performance

### Security Headers
The `vercel.json` file includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Performance Optimizations
- **Static Assets Caching**: 1 year cache for CSS/JS/images
- **Compression**: Automatic gzip/brotli compression
- **CDN**: Global edge network for fast loading
- **SPA Routing**: All routes serve index.html

## 🔄 Automatic Deployments

### GitHub Integration
Vercel automatically deploys when you:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployments
- Open PR → Preview deployment with unique URL

### Deployment Settings
```json
{
  "buildCommand": null,
  "installCommand": null,
  "framework": null,
  "outputDirectory": null
}
```

## 🎯 Production Checklist

### Before Going Live

- [ ] **Database Migrations**: Run all 5 migration files in Supabase
- [ ] **Environment Variables**: Set SUPABASE_URL and SUPABASE_ANON_KEY
- [ ] **CORS Configuration**: Add Vercel domains to Supabase
- [ ] **Authentication**: Configure Site URL and redirect URLs
- [ ] **Custom Domain**: Set up DNS records (optional)
- [ ] **Analytics**: Add tracking (optional)

### After Deployment

- [ ] **Test Authentication**: Try signup/login flow
- [ ] **Test Database**: Create flashcard progress
- [ ] **Test Real-time**: Check cross-device sync
- [ ] **Performance**: Run Lighthouse audit
- [ ] **Mobile**: Test responsive design

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**:
   - Go to project settings
   - Enable "Analytics"
   - View real-time visitor data

2. **Performance Monitoring**:
   - Core Web Vitals tracking
   - Page load performance
   - User engagement metrics

### Custom Analytics

Add Google Analytics or Plausible:
```html
<!-- Add to index.html head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚨 Troubleshooting

### Common Issues

**"CORS Error" when accessing Supabase**:
```
Solution: Add your Vercel domain to Supabase CORS settings
```

**"Invalid API key" error**:
```
Solution: Check environment variables in Vercel dashboard
```

**Authentication redirect issues**:
```
Solution: Update Site URL in Supabase Authentication settings
```

**Build failures**:
```
Solution: Check .vercelignore file and build settings
```

### Debug Steps

1. **Check Vercel Logs**:
   - Go to project dashboard
   - Click on deployment
   - View build and runtime logs

2. **Browser Console**:
   - Open developer tools
   - Check console for JavaScript errors
   - Verify network requests

3. **Supabase Dashboard**:
   - Check API logs
   - Verify authentication events
   - Monitor database queries

## 🔄 Updates & Maintenance

### Automatic Updates
- Push to GitHub → Auto-deploy to Vercel
- Preview deployments for testing
- Rollback to previous versions easily

### Database Updates
- Add new migrations to `supabase/migrations/`
- Test in development first
- Run migrations in production Supabase

## 🌟 Advanced Features

### API Routes (Future)
Vercel supports serverless functions:
```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
```

### Edge Functions
Run code closer to users:
```javascript
// middleware.js
export function middleware(request) {
  // Add custom logic
  return NextResponse.next();
}
```

## 🎉 Success!

Your React Interview Prep platform is now live on Vercel! 

**Live URL**: `https://your-project.vercel.app`

### Share Your Platform
- Add the URL to your README
- Share with the developer community
- Get feedback and iterate

---

**Need help? Contact [Vercel Support](https://vercel.com/support) or [create an issue](https://github.com/S1NAPANAHI/react-nextjs-interview-prep/issues).**

**🚀 Happy deploying!**