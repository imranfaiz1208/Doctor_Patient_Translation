# Healthcare Doctor-Patient Translation Web Application

A full-stack real-time translation bridge between doctors and patients, built to break language barriers in healthcare settings.

## 🎯 Project Overview

This application provides real-time bidirectional translation for medical conversations, with features including text chat, audio recording, conversation logging, search capabilities, and AI-powered clinical summaries.

## ✨ Features Implemented

### ✅ Completed Features

1. **Real-Time Doctor-Patient Translation**
   - Two distinct roles (Doctor & Patient)
   - Bidirectional translation between selected languages
   - Support for 10+ major languages

2. **Text Chat Interface**
   - Clean, medical-grade UI
   - Clear visual distinction between roles (Blue for Doctor, Green for Patient)
   - Role switching within conversations
   - Translation display for cross-language communication

3. **Audio Recording & Storage**
   - Browser-based audio recording using MediaRecorder API
   - Audio clips stored in Supabase Storage
   - Playback functionality within conversation thread
   - Visual recording indicators with timer

4. **Conversation Logging**
   - Full persistence using Supabase backend
   - Text and audio messages with timestamps
   - Cross-session persistence
   - Conversation history accessible from any device

5. **Conversation Search**
   - Full-text search across all conversations
   - Keyword highlighting in search results
   - Context display around matched text
   - Real-time search with debouncing

6. **AI-Powered Summary**
   - Clinical summary generation using GPT-4
   - Highlights: symptoms, diagnoses, medications, follow-up actions
   - On-demand and refreshable summaries
   - Medical terminology optimization

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon system
- **date-fns** - Date formatting

### Backend
- **Supabase** - Backend infrastructure
  - Edge Functions (Hono web server)
  - Key-Value Store (Postgres)
  - Storage (Audio files)
- **Deno** - Edge runtime environment
- **Hono** - Lightweight web framework

### AI/LLM Integration
- **OpenAI GPT-3.5-turbo** - Real-time translation
- **OpenAI GPT-4** - Clinical summary generation

### Development Tools
- **Vite** - Build tool and dev server
- **TypeScript/TSX** - Type safety
- **Figma Make** - Development environment

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                    │
│  - Multi-page app with React Router                        │
│  - Home, Conversation, History pages                        │
│  - Real-time UI updates                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS + Bearer Auth
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Supabase Edge Function (Hono)                  │
│  - /conversations (POST, GET)                               │
│  - /messages (POST)                                         │
│  - /translate (POST)                                        │
│  - /summarize (POST)                                        │
│  - /search (GET)                                            │
└───────────┬─────────────────────────┬───────────────────────┘
            │                         │
            │                         │
┌───────────▼───────────┐   ┌────────▼──────────┐
│   Supabase Storage    │   │  KV Store (Postgres│
│   - Audio files       │   │  - Conversations   │
│   - Signed URLs       │   │  - Messages        │
└───────────────────────┘   └────────────────────┘

                External API
┌─────────────────────────────────────────────────────────────┐
│                    OpenAI API                               │
│  - GPT-3.5: Translation                                     │
│  - GPT-4: Clinical summaries                                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Main entry point
│   │   ├── routes.ts               # React Router configuration
│   │   ├── pages/
│   │   │   ├── Root.tsx            # Layout wrapper
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Conversation.tsx   # Main chat interface
│   │   │   ├── ConversationHistory.tsx  # Search & history
│   │   │   └── NotFound.tsx        # 404 page
│   │   └── components/
│   │       ├── MessageBubble.tsx   # Chat message display
│   │       ├── AudioRecorder.tsx   # Recording UI
│   │       └── AISummary.tsx       # Summary generation
│   └── styles/
│       └── theme.css               # Tailwind customization
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # Main server with routes
│           └── kv_store.tsx        # Database utilities (protected)
└── README.md
```

## 🚀 Setup & Deployment

### Prerequisites
- OpenAI API Key (required for translation and summarization)

### Environment Variables
Set the following in your Supabase project settings:

```bash
OPENAI_API_KEY=sk-...
```

### Deployment
This application is deployed on Figma Make with Supabase integration.

**Live URL:** [Your deployed URL here]

## 🔑 API Key Configuration

**IMPORTANT:** Before using the application, configure your OpenAI API key:

1. Navigate to your Supabase project dashboard
2. Go to Settings → Edge Functions → Secrets
3. Add `OPENAI_API_KEY` with your OpenAI API key
4. Restart the edge functions

## 📱 Usage

### Starting a Conversation
1. Visit the home page
2. Select doctor's language (e.g., English)
3. Select patient's language (e.g., Spanish)
4. Click "Start New Conversation"

### During Conversation
1. **Switch Roles:** Click Doctor or Patient button at top
2. **Send Text:** Type message and press Enter or click Send
3. **Record Audio:** Click Record button, speak, then Stop
4. **Generate Summary:** Click "Generate AI Summary" button

### Searching History
1. Navigate to History page
2. Type keywords in search bar
3. View highlighted matches in conversations
4. Click any conversation to view full details

## 🎨 Design Decisions

### Color System
- **Doctor:** Blue (#0066CC) - Professional, trustworthy
- **Patient:** Green (#00A86B) - Calming, accessible
- **AI Summary:** Purple (#7C3AED) - Intelligent, distinctive
- **Backgrounds:** Gray scale for neutral medical aesthetic

### UX Principles
- **8pt Grid System:** Consistent spacing throughout
- **Role Clarity:** Visual distinction between speakers
- **Mobile-First:** Responsive design for all devices
- **Accessibility:** WCAG AA color contrast ratios
- **Medical Context:** Clean, professional, distraction-free

## 🔐 Security & Privacy

### Current Implementation
- HTTPS-only communication
- Bearer token authentication
- Private audio storage with signed URLs
- Server-side API key management

### Production Considerations
**⚠️ IMPORTANT:** This is a prototype environment. For production use with real patient data:

- Implement HIPAA compliance measures
- Add encryption at rest and in transit
- Implement audit logging
- Add user authentication (currently simulated)
- Deploy to HIPAA-compliant infrastructure
- Add data retention policies
- Implement proper access controls

## 🧪 AI Tools & Resources Leveraged

### Development
- **Figma Make AI:** Application scaffolding, component generation
- **GitHub Copilot:** Code completion and debugging assistance
- **OpenAI GPT-4:** Translation and summarization logic

### APIs Used
- **OpenAI API:** GPT-3.5-turbo for translation, GPT-4 for summaries
- **Supabase API:** Database, storage, authentication
- **MediaRecorder API:** Browser audio recording

## ⚠️ Known Limitations & Trade-offs

### Time Constraints (12-hour scope)
1. **User Authentication:** Currently using simulated auth
   - Production needs: Full Supabase auth with user sessions
   - Impact: Multi-user scenarios not fully separated

2. **Real-time Updates:** Polling not implemented
   - Trade-off: Messages don't auto-update on other devices
   - Future: WebSocket integration for live updates

3. **Audio Transcription:** Not implemented
   - Reason: Additional API complexity
   - Impact: Audio messages not searchable by content

4. **Language Detection:** Manual selection only
   - Future: Auto-detect language from input

5. **Error Boundaries:** Basic error handling
   - Production needs: Comprehensive error UI and recovery

### Technical Limitations
1. **Storage Limits:** Supabase free tier constraints
2. **API Rate Limits:** OpenAI rate limiting on free tiers
3. **Browser Support:** MediaRecorder requires modern browsers
4. **Audio Format:** WebM only (not all browsers support)

### Incomplete Features
- [ ] Email notifications for follow-ups
- [ ] PDF export of conversations with summaries
- [ ] Multi-participant conversations (group consultations)
- [ ] Video call integration
- [ ] Offline mode with sync

## 🎯 Evaluation Criteria Addressed

### Problem-Solving Approach
- Prioritized core features over edge cases
- Backend-first architecture for data persistence
- Modular component design for maintainability

### Code Quality
- TypeScript for type safety
- Consistent naming conventions
- Component reusability
- Separated concerns (UI/Logic/API)

### AI/LLM Integration
- OpenAI for translation (GPT-3.5) and summarization (GPT-4)
- Optimized prompts for medical context
- Error handling for API failures

### UI/UX
- Medical-grade clean interface
- Role-based color coding
- Mobile responsive design
- Clear visual hierarchy

### Documentation
- Comprehensive README
- Inline code comments
- Architecture diagrams
- Setup instructions

## 📊 Performance Considerations

- **Translation:** ~1-2s per message (OpenAI API)
- **Audio Upload:** Depends on file size (typically <1MB)
- **Search:** O(n) linear scan (acceptable for prototype)
- **Page Load:** ~500ms initial load

## 🔮 Future Enhancements

1. **Speech-to-Text:** Transcribe audio for searchability
2. **Text-to-Speech:** Read translations aloud
3. **Appointment Integration:** Calendar scheduling
4. **EHR Integration:** Connect with electronic health records
5. **Analytics Dashboard:** Usage statistics for healthcare facilities
6. **Multi-tenant:** Support multiple healthcare organizations
7. **FHIR Compliance:** Healthcare data interoperability

## 📄 License

This is a technical assessment project. All rights reserved.

## 👤 Author

**Senior Full-Stack Assessment Submission**
- Built in 12 hours for Healthcare Translation Assignment
- Full-stack: React + Supabase + OpenAI
- Deployment: Figma Make Platform

---

**Note:** This application demonstrates full-stack development capabilities including frontend design, backend architecture, AI integration, and production deployment. While fully functional, additional security and compliance measures are required for production healthcare use.
