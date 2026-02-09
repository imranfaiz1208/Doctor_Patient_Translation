# Deployment Guide

## 🚀 Current Deployment

This application is deployed on **Figma Make** with integrated Supabase backend.

### Live Application
- **URL:** [Will be provided after deployment]
- **Status:** Production-ready prototype
- **Environment:** Figma Make + Supabase

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│         Figma Make (Frontend Host)          │
│  - React SPA                                │
│  - Vite build                               │
│  - Static asset serving                     │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTPS
                 │
┌────────────────▼────────────────────────────┐
│       Supabase (Backend Services)           │
│  - Edge Functions (Deno runtime)            │
│  - PostgreSQL (KV Store)                    │
│  - Storage (Audio files)                    │
└─────────────────────────────────────────────┘
```

## 🔧 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] OPENAI_API_KEY configured in Supabase
- [ ] Supabase project connected
- [ ] Edge functions deployed
- [ ] Storage bucket created

### 2. Testing
- [ ] Local development tested
- [ ] All features working
- [ ] Audio recording functional
- [ ] Translation API responding
- [ ] Search functionality working

### 3. Documentation
- [ ] README.md complete
- [ ] SETUP.md instructions clear
- [ ] API key requirements documented

## 📋 Deployment Steps (Figma Make)

### Automatic Deployment
Figma Make handles deployment automatically:
1. Code changes are detected
2. Vite build runs automatically
3. Frontend deploys to CDN
4. Backend functions auto-deploy to Supabase

### Manual Verification
After deployment:
1. Visit the deployed URL
2. Open browser DevTools
3. Check for console errors
4. Test core functionality:
   - Create conversation
   - Send message
   - Record audio
   - Generate summary
   - Search history

## 🔐 Security Configuration

### CORS Settings
Already configured in `/supabase/functions/server/index.tsx`:
```typescript
cors({
  origin: "*",  // For prototype - restrict in production
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})
```

### API Authentication
- Bearer token authentication enabled
- Public anonymous key used for client
- Service role key server-side only

## 🌍 Alternative Deployment Options

### Option 1: Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Option 2: Netlify (Frontend)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Railway (Full-stack)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Initialize
railway init

# Deploy
railway up
```

### Backend Options
- **Current:** Supabase Edge Functions (✅ Deployed)
- **Alternative:** AWS Lambda + API Gateway
- **Alternative:** Google Cloud Functions
- **Alternative:** Azure Functions

## 📊 Production Considerations

### Scaling
Current setup handles:
- **Concurrent Users:** ~100 (Supabase free tier)
- **Storage:** 1GB audio files
- **Database:** 500MB data
- **Edge Functions:** 500K invocations/month

### Upgrade Path
For production scale:
1. Supabase Pro plan ($25/month)
   - 8GB database
   - 100GB bandwidth
   - 2M edge function invocations
2. OpenAI rate limits
   - Tier 1: $5/month for testing
   - Production: Contact for enterprise pricing

### Monitoring
Set up monitoring in Supabase dashboard:
- Edge function logs
- Database queries
- Storage usage
- API error rates

## 🔄 CI/CD Pipeline (Future)

### Recommended Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy
```

## 🧪 Testing Deployment

### Health Check Endpoints
```bash
# Backend health
curl https://[project-id].supabase.co/functions/v1/make-server-b5f5c952/health

# Expected response
{"status":"ok"}
```

### Frontend Check
1. Visit deployed URL
2. Open DevTools → Network tab
3. Create test conversation
4. Verify API calls succeed (200 status)

## 📱 Mobile Optimization

Current responsive breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### PWA Support (Future)
Add `manifest.json` for installable app:
```json
{
  "name": "MediTranslate",
  "short_name": "MediTranslate",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0066CC"
}
```

## 🐛 Debugging Deployment Issues

### Common Issues

#### 1. "Failed to fetch" errors
- **Cause:** CORS misconfiguration
- **Fix:** Check server CORS settings
- **Verify:** Browser Network tab shows correct headers

#### 2. "Conversation not found"
- **Cause:** Database not seeded or connection issue
- **Fix:** Check Supabase connection
- **Verify:** Test health endpoint

#### 3. Audio not playing
- **Cause:** Signed URL expired or bucket permissions
- **Fix:** Verify storage bucket settings
- **Verify:** Check signed URL validity period

#### 4. Translation failing
- **Cause:** OPENAI_API_KEY not set
- **Fix:** Configure environment variable
- **Verify:** Check Edge Function logs

### Log Access
```bash
# Supabase logs
supabase functions logs make-server-b5f5c952

# Real-time logs
supabase functions logs make-server-b5f5c952 --tail
```

## 🎯 Performance Optimization

### Current Optimizations
- Vite code splitting
- Lazy route loading
- Image optimization via Tailwind
- Debounced search (500ms)

### Future Optimizations
- Service Worker caching
- IndexedDB for offline storage
- WebSocket for real-time updates
- CDN for static assets

## 📈 Monitoring & Analytics

### Recommended Tools
1. **Sentry** - Error tracking
2. **Plausible** - Privacy-friendly analytics
3. **Supabase Dashboard** - Backend metrics
4. **Lighthouse** - Performance audits

### Key Metrics to Track
- Page load time
- Translation latency
- Audio upload success rate
- Search query performance
- API error rates

## 🔒 Security Hardening

### Production Checklist
- [ ] Environment variables secured
- [ ] CORS restricted to domain
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Supabase handles)
- [ ] XSS protection (React handles)
- [ ] HTTPS enforced
- [ ] API key rotation schedule

### HIPAA Compliance (Future)
For real healthcare data:
- [ ] Business Associate Agreement with Supabase
- [ ] Encryption at rest (Supabase provides)
- [ ] Encryption in transit (HTTPS)
- [ ] Audit logging
- [ ] Access controls
- [ ] Data retention policies
- [ ] Disaster recovery plan

## 📞 Post-Deployment Support

### Rollback Plan
1. Access Supabase dashboard
2. Navigate to Edge Functions
3. Select previous version
4. Click "Deploy"

### Emergency Contacts
- Supabase Support: support@supabase.com
- OpenAI Support: support@openai.com

## ✅ Deployment Complete!

After successful deployment:
1. Share the live URL
2. Document any environment-specific configs
3. Share GitHub repository
4. Provide access credentials if needed

---

**Deployment Status:** ✅ Ready for Production Prototype
**Last Updated:** February 6, 2026
