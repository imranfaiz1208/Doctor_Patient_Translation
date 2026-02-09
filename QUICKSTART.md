# 🚀 Quick Start Guide

**For Evaluators:** Get the app running in 5 minutes.

## ⚡ Fastest Path to Running App

### 1. Prerequisites
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Modern browser (Chrome, Firefox, Safari, or Edge)

### 2. Configure API Key (2 minutes)

**Option A: Using deployed app**
The app is already deployed. Just need to set environment variable:

1. Contact the developer for Supabase project access, OR
2. Use the pre-configured deployment at the provided URL

**Option B: Local setup** (skip if using deployed version)
```bash
# Clone repository
git clone https://github.com/[username]/healthcare-translation-app
cd healthcare-translation-app

# Install dependencies
pnpm install

# Set environment variable
echo "OPENAI_API_KEY=your-key-here" > .env

# Run development server
pnpm dev
```

### 3. Test the App (3 minutes)

#### Test Case 1: Basic Translation
1. Open the app URL
2. Leave defaults (English → Spanish)
3. Click "Start New Conversation"
4. Select "Doctor" role
5. Type: "What brings you in today?"
6. Press Enter
7. ✅ **Expected:** Message appears translated to Spanish

#### Test Case 2: Audio Recording
1. In same conversation
2. Click "Record" button (allow microphone access)
3. Speak for 3-5 seconds
4. Click "Stop"
5. ✅ **Expected:** Audio player appears with recording

#### Test Case 3: AI Summary
1. Send 2-3 more messages (alternate roles)
2. Scroll down to "Generate AI Summary" button
3. Click it
4. ✅ **Expected:** Clinical summary appears in ~5 seconds

#### Test Case 4: Search
1. Click "History" in navigation
2. Type a word from your conversation
3. ✅ **Expected:** Conversation appears with highlighted matches

## 📊 What to Evaluate

### Architecture (5 min)
- Open DevTools → Network tab
- Send a message
- Observe API calls to Supabase edge function
- Check response structure

**Files to review:**
- `/supabase/functions/server/index.tsx` - Backend routes
- `/src/app/pages/Conversation.tsx` - Main chat logic
- `/src/app/components/MessageBubble.tsx` - UI component

### Code Quality (10 min)
- Check component structure in `/src/app/components/`
- Review type safety (TypeScript usage)
- Examine error handling
- Look for code organization

**Key files:**
- `/src/app/routes.ts` - Routing setup
- `/src/app/App.tsx` - Entry point
- `/README.md` - Documentation quality

### Features Completeness (10 min)

| Feature | Status | Test |
|---------|--------|------|
| Real-time translation | ✅ | Send messages in both roles |
| Text chat interface | ✅ | Visual distinction clear? |
| Audio recording | ✅ | Record and playback works? |
| Conversation logging | ✅ | Reload page, history persists? |
| Search functionality | ✅ | Search finds keywords? |
| AI summaries | ✅ | Summary is medically relevant? |

### UI/UX (5 min)
- Mobile responsive? (resize browser)
- Color coding clear? (Blue=Doctor, Green=Patient)
- Loading states present?
- Error handling visible?

## 🐛 Troubleshooting

### "OPENAI_API_KEY not configured"
**Solution:** API key not set in Supabase
1. Go to Supabase dashboard
2. Settings → Edge Functions → Secrets
3. Add `OPENAI_API_KEY`
4. Restart edge functions

### "Failed to fetch"
**Solution:** CORS or backend issue
1. Check browser console for details
2. Verify Supabase project is active
3. Test health endpoint: `/make-server-b5f5c952/health`

### Audio not recording
**Solution:** Browser permissions
1. Check if microphone access was granted
2. Try in different browser
3. Ensure HTTPS (required for MediaRecorder)

### Translation not working
**Solution:** OpenAI API issue
1. Verify API key has credits
2. Check OpenAI account status
3. Review server logs in Supabase

## 📱 Mobile Testing

Test on mobile device:
1. Open deployed URL on phone
2. Test all features
3. Verify responsive layout
4. Check audio recording on mobile

## ⏱️ Time Investment

| Task | Time |
|------|------|
| Initial setup | 2 min |
| Feature testing | 5 min |
| Code review | 10 min |
| UI/UX evaluation | 5 min |
| Documentation review | 8 min |
| **Total** | **~30 min** |

## 🎯 Evaluation Criteria Map

### Problem-Solving (Look for:)
- Clean architecture separation (frontend/backend)
- Efficient data flow
- Error handling strategy
- API integration approach

### Code Quality (Look for:)
- TypeScript usage
- Component reusability
- Consistent naming
- Code organization

### AI Integration (Look for:)
- OpenAI API usage
- Prompt engineering
- Translation quality
- Summary relevance

### UI/UX (Look for:)
- Visual hierarchy
- Responsive design
- Role distinction
- Loading/error states

### Documentation (Look for:)
- README completeness
- Setup instructions
- Architecture explanation
- Known limitations

## 🔍 Deep Dive Areas

### Backend Architecture
```bash
# Explore server code
open supabase/functions/server/index.tsx

# Key routes:
# - POST /conversations (create)
# - POST /messages (add message with translation)
# - POST /summarize (AI summary)
# - GET /search (full-text search)
```

### Frontend Routing
```bash
# Check routing setup
open src/app/routes.ts

# Pages:
# - Home (language selection)
# - Conversation (main chat)
# - ConversationHistory (search)
```

### Component Design
```bash
# Reusable components
open src/app/components/MessageBubble.tsx
open src/app/components/AudioRecorder.tsx
open src/app/components/AISummary.tsx
```

## 📝 Evaluation Notes Template

```markdown
## Healthcare Translation App - Evaluation

### First Impressions
- Deployment: [ ] Working [ ] Issues
- UI/UX: [ ] Professional [ ] Needs work
- Performance: [ ] Fast [ ] Slow

### Feature Completeness
- Translation: ___/10
- Audio: ___/10
- Search: ___/10
- Summaries: ___/10
- Overall: ___/40

### Code Quality
- Architecture: ___/10
- TypeScript: ___/10
- Components: ___/10
- Organization: ___/10

### Documentation
- README: ___/10
- Setup guide: ___/10
- Code comments: ___/10

### Strengths
1. 
2. 
3. 

### Areas for Improvement
1. 
2. 
3. 

### Overall Rating: ___/100
```

## 🎓 Learning Resources

If you want to understand the tech stack:
- [React Router v7](https://reactrouter.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## ✅ Quick Checklist

**Before evaluation:**
- [ ] App is accessible
- [ ] API key configured
- [ ] Test data created
- [ ] Mobile tested
- [ ] Documentation read

**During evaluation:**
- [ ] All features tested
- [ ] Code reviewed
- [ ] Architecture understood
- [ ] UI/UX assessed
- [ ] Documentation checked

**After evaluation:**
- [ ] Notes compiled
- [ ] Score assigned
- [ ] Feedback prepared

---

## 🚀 Ready to Evaluate!

**Deployed App:** [Provided URL]
**GitHub Repo:** [Provided URL]
**Estimated Review Time:** 30 minutes
**Recommended Browser:** Chrome or Firefox

**Need help?** Check `/README.md` for full documentation or `/SETUP.md` for configuration details.

---

**Thank you for evaluating this submission!** 🙏
