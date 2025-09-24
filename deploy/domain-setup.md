# 🌐 Custom Domain Setup Guide

Set up a professional custom domain for your React Interview Prep platform.

## 🎯 Recommended Domain Ideas

### Professional Options
- `reactinterview.pro`
- `interviewprep.dev`
- `reactmastery.app`
- `codinginterview.io`
- `devinterviews.com`
- `reactquiz.online`

### Personal Branding
- `yourname-interviews.com`
- `interviews.yourname.dev`
- `prep.yourname.com`

## 🛒 Domain Registration

### Recommended Registrars

**Namecheap** (Budget-friendly)
- .com domains: ~$10-12/year
- Free WHOIS protection
- Easy DNS management

**Cloudflare** (Best features)
- At-cost pricing
- Built-in CDN and security
- Advanced analytics

**Vercel Domains** (Seamless integration)
- Automatic SSL
- Perfect Vercel integration
- Premium pricing

**Google Domains** (Reliable)
- Simple management
- Google Workspace integration
- Standard pricing

## ⚙️ DNS Configuration

### Option 1: Vercel DNS (Recommended)

1. **In Vercel Dashboard**:
   ```
   Project Settings → Domains → Add Domain
   Enter: yourdomainname.com
   ```

2. **In Domain Registrar**:
   ```
   Nameservers:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **SSL Certificate**:
   - Automatically provisioned by Vercel
   - Takes 5-10 minutes to activate

### Option 2: Custom DNS

**A Records** (Root domain):
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600
```

**CNAME Records** (Subdomain):
```
Type: CNAME
Name: www (or interview, app, etc.)
Value: cname.vercel-dns.com
TTL: 3600
```

## 🔧 Vercel Domain Setup

### Step-by-Step Process

1. **Add Domain to Vercel**:
   ```bash
   # Via Vercel CLI
   npx vercel domains add yourdomain.com
   
   # Or via dashboard
   Project → Settings → Domains → Add
   ```

2. **Configure DNS**:
   - Wait for domain verification (5-60 minutes)
   - Vercel will show DNS configuration status
   - Green checkmarks = properly configured

3. **Set as Primary**:
   ```
   Domains tab → yourdomain.com → Set as Primary
   ```

## 🌍 Subdomain Strategies

### Professional Setup
```
Main app: interview.yourdomain.com
Docs: docs.yourdomain.com
API: api.yourdomain.com
Blog: blog.yourdomain.com
```

### Simple Setup
```
Main app: yourdomain.com
WWW redirect: www.yourdomain.com → yourdomain.com
```

## 🔒 SSL & Security

### Automatic SSL
Vercel provides:
- Let's Encrypt SSL certificates
- Automatic renewal
- HTTP → HTTPS redirects
- HSTS headers

### Security Headers
Already configured in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 🎨 Branding & Marketing

### Domain-Based Marketing

**Professional Email**:
```
contact@yourdomain.com
support@yourdomain.com
hello@yourdomain.com
```

**Social Media Consistency**:
- Twitter: @yourdomain
- LinkedIn: /company/yourdomain
- GitHub: /yourdomain

**SEO Benefits**:
- Branded search results
- Trust and credibility
- Easy to remember and share

## 📈 Analytics & Tracking

### Domain-Specific Tracking

**Google Analytics**:
```javascript
// Custom domain tracking
gtag('config', 'GA_MEASUREMENT_ID', {
  cookie_domain: 'yourdomain.com'
});
```

**Search Console**:
- Verify domain ownership
- Monitor search performance
- Submit sitemap

## 🚀 Performance Optimization

### CDN Configuration
```json
{
  "headers": [
    {
      "source": "/(.*\\.(css|js|png|jpg|jpeg|gif|svg|ico))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Geographic Distribution
- Vercel Edge Network
- ~100 global edge locations
- Automatic optimization

## 💰 Cost Optimization

### Budget Breakdown
```
Domain registration: $10-15/year
Vercel Pro (optional): $20/month
Total minimum: $10-15/year
```

### Free Tier Limits
- 100GB bandwidth/month
- 1000 serverless functions
- Unlimited static sites
- Community support

## 🔧 Advanced Configuration

### Multiple Environments
```
Production: yourdomain.com
Staging: staging.yourdomain.com
Development: dev.yourdomain.com
```

### API Subdomains
```
api.yourdomain.com → Supabase Edge Functions
cdn.yourdomain.com → Static assets
ws.yourdomain.com → WebSocket connections
```

## 🚨 Troubleshooting

### Common Issues

**DNS Propagation Delays**:
```
Solution: Wait 24-48 hours for global propagation
Check: dig yourdomain.com or nslookup yourdomain.com
```

**SSL Certificate Issues**:
```
Solution: Remove and re-add domain in Vercel
Check: https://www.ssllabs.com/ssltest/
```

**WWW vs Non-WWW**:
```
Solution: Set up both, redirect one to the other
Recommended: non-www (yourdomain.com) as primary
```

### Debug Tools

**DNS Checker**: [whatsmydns.net](https://www.whatsmydns.net)
**SSL Checker**: [ssllabs.com](https://www.ssllabs.com/ssltest/)
**Performance**: [web.dev](https://web.dev/measure/)
**Security**: [securityheaders.com](https://securityheaders.com)

## 📋 Launch Checklist

### Pre-Launch
- [ ] Domain purchased and configured
- [ ] DNS records properly set
- [ ] SSL certificate active
- [ ] Redirects working (www → non-www)
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified
- [ ] Analytics tracking active

### Post-Launch
- [ ] Submit to search engines
- [ ] Set up Google Search Console
- [ ] Configure email forwarding
- [ ] Update social media links
- [ ] Monitor uptime and performance
- [ ] Set up domain renewal reminders

## 🎉 Go Live!

Your professional React Interview Prep platform is now live on a custom domain!

### Next Steps
- Share your platform with the community
- Collect user feedback
- Monitor analytics and performance
- Plan future enhancements

---

**🌟 Your platform is now ready to help developers worldwide ace their React interviews!**