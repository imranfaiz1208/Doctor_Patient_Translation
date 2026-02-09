# Setup Instructions

## 🔧 Required Configuration

### OpenAI API Key (CRITICAL)

This application **requires** an OpenAI API key to function. Without it, translation and summarization features will not work.

## Step-by-Step Setup

### 1. Obtain OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

### 2. Configure Environment Variable

You need to add the API key to your Supabase environment:

#### Option A: Via Supabase Dashboard (Recommended)
1. Open your Supabase project dashboard
2. Go to **Settings** → **Edge Functions** → **Secrets**
3. Add a new secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (e.g., `sk-proj-...`)
4. Save and restart edge functions

#### Option B: Via Supabase CLI
```bash
supabase secrets set OPENAI_API_KEY=sk-proj-your-key-here
```

### 3. Verify Configuration

1. Open the application in your browser
2. Create a new conversation
3. Send a test message
4. Check browser console for any API errors
5. If you see "OPENAI_API_KEY not configured", repeat step 2

## 💰 OpenAI API Costs

### Estimated Costs (as of 2026)
- **GPT-3.5-turbo (Translation):** ~$0.0005 per message
- **GPT-4 (Summarization):** ~$0.03 per summary

### Cost Control Tips
1. Set usage limits in OpenAI dashboard
2. Use GPT-3.5 for summaries if cost is concern (edit server code)
3. Monitor usage in OpenAI dashboard
4. Consider using Azure OpenAI for enterprise pricing

## 🚨 Common Issues

### "OPENAI_API_KEY not configured"
- **Cause:** Environment variable not set
- **Fix:** Follow step 2 above and restart edge functions

### "Translation API error"
- **Cause:** Invalid API key or rate limit exceeded
- **Fix:** 
  - Verify key is correct
  - Check OpenAI account status
  - Review rate limits in OpenAI dashboard

### "Insufficient credits"
- **Cause:** OpenAI account has no credits
- **Fix:** Add credits to OpenAI account

### Audio recording not working
- **Cause:** Browser permissions
- **Fix:** Allow microphone access when prompted

## 🔐 Security Best Practices

1. **Never commit API keys to git**
2. **Use environment variables only**
3. **Set spending limits on OpenAI account**
4. **Rotate keys periodically**
5. **Monitor usage logs**

## 📱 Browser Requirements

### Supported Browsers
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

### Required Features
- MediaRecorder API (for audio recording)
- Web Audio API (for playback)
- Local Storage (for caching)

## 🧪 Testing the Setup

### Quick Test Checklist
- [ ] Can create new conversation
- [ ] Can send text message
- [ ] Message gets translated
- [ ] Can record audio
- [ ] Audio plays back correctly
- [ ] Can generate AI summary
- [ ] Can search conversations

### Test Conversation
1. Create conversation: English → Spanish
2. As Doctor, type: "What symptoms are you experiencing?"
3. Verify translation appears in Spanish
4. Switch to Patient role
5. Type Spanish response: "Me duele la cabeza"
6. Verify English translation appears
7. Click "Generate AI Summary"
8. Verify summary generates successfully

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure OpenAI account has credits
4. Review server logs in Supabase dashboard

## 🎓 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

---

**Ready to start?** Follow the steps above, then visit the home page to create your first conversation!
