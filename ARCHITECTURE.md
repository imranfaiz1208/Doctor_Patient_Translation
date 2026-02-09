# Technical Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React 18 Single Page Application                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │  │
│  │  │   Home     │  │Conversation│  │ ConversationHistory │   │  │
│  │  │   Page     │  │    Page    │  │       Page          │   │  │
│  │  └────────────┘  └────────────┘  └─────────────────────┘   │  │
│  │         │                │                    │              │  │
│  │         └────────────────┴────────────────────┘              │  │
│  │                          │                                    │  │
│  │            React Router 7 (Data Mode)                        │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                       │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                    API Client Layer                          │  │
│  │  • Fetch API                                                 │  │
│  │  • Bearer Token Authentication                               │  │
│  │  • Error Handling & Logging                                  │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
└────────────────────────────┬┬───────────────────────────────────────┘
                             ││ HTTPS + Bearer Auth
                             ││
┌────────────────────────────▼▼───────────────────────────────────────┐
│                      SERVER LAYER (Supabase)                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │        Edge Function: make-server-b5f5c952 (Deno Runtime)    │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │               Hono Web Framework                        │ │  │
│  │  │                                                          │ │  │
│  │  │  POST /conversations    - Create new conversation       │ │  │
│  │  │  GET  /conversations    - List all conversations        │ │  │
│  │  │  GET  /conversations/:id - Get conversation + messages  │ │  │
│  │  │  POST /messages         - Add message (with translation)│ │  │
│  │  │  POST /translate        - Translate text                │ │  │
│  │  │  POST /summarize        - Generate AI summary           │ │  │
│  │  │  GET  /search?q=query   - Search conversations          │ │  │
│  │  │  POST /upload-audio     - Upload audio file             │ │  │
│  │  │  GET  /health           - Health check                  │ │  │
│  │  └────────────────────────┬───────────────────────────────┘ │  │
│  └───────────────────────────┼─────────────────────────────────┘  │
│                              │                                     │
│  ┌───────────────────────────┼─────────────────────────────────┐  │
│  │          Middleware & Utilities                             │  │
│  │  • CORS Handler                                             │  │
│  │  • Logger (Hono Logger)                                     │  │
│  │  • Authentication Validator                                 │  │
│  │  • Error Handler                                            │  │
│  └───────────────────────────┼─────────────────────────────────┘  │
└────────────────────────────┬─┼─────────────────────────────────────┘
                             │ │
        ┌────────────────────┘ └──────────────────┐
        │                                          │
        ▼                                          ▼
┌────────────────┐                        ┌────────────────┐
│  DATA LAYER    │                        │ STORAGE LAYER  │
│ KV Store (PG)  │                        │  Supabase      │
│                │                        │   Storage      │
│ conversations: │                        │                │
│   {id}         │                        │ Bucket:        │
│                │                        │ make-b5f5c952- │
│ messages:      │                        │ audio          │
│   {convId}:    │                        │                │
│   {timestamp}  │                        │ • WebM files   │
│                │                        │ • Signed URLs  │
│ conversation-  │                        │ • Private      │
│   list         │                        │   access       │
└────────────────┘                        └────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│           EXTERNAL SERVICES                  │
│  ┌────────────────────────────────────────┐ │
│  │          OpenAI API                    │ │
│  │                                        │ │
│  │  • GPT-3.5-turbo (Translation)        │ │
│  │  • GPT-4 (Clinical Summaries)         │ │
│  │                                        │ │
│  │  Authentication: Bearer Token         │ │
│  │  Rate Limits: Tier-based              │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## 📊 Data Flow Diagrams

### 1. Message Translation Flow

```
User Types Message
       │
       ▼
┌──────────────────┐
│ Conversation UI  │ (React Component)
└────────┬─────────┘
         │ State: role, inputText
         ▼
┌──────────────────┐
│ sendMessage()    │ (Event Handler)
└────────┬─────────┘
         │ Payload: { conversationId, role, originalText }
         ▼
┌──────────────────┐
│ POST /messages   │ (API Call)
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Server: Message Handler  │
│  1. Validate conversation│
│  2. Determine target lang│
│  3. Call /translate      │
│  4. Store message        │
│  5. Update lastMessageAt │
└────────┬─────────────────┘
         │
         ├─────────────────┐
         ▼                 ▼
┌──────────────┐    ┌──────────────┐
│ POST /       │    │ KV Store     │
│ translate    │    │ Save message │
│              │    │              │
│ OpenAI API   │    │ messages:    │
│ GPT-3.5      │    │ {convId}:    │
│              │    │ {timestamp}  │
└──────┬───────┘    └──────┬───────┘
       │                   │
       │ translatedText    │
       └─────────┬─────────┘
                 │
                 ▼
         ┌──────────────┐
         │ Response:    │
         │ { success,   │
         │   message }  │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ UI Update    │
         │ Add message  │
         │ to messages[]│
         └──────────────┘
```

### 2. Audio Recording Flow

```
User Clicks Record
       │
       ▼
┌─────────────────────────┐
│ AudioRecorder Component │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ navigator.mediaDevices  │
│   .getUserMedia()       │
└────────┬────────────────┘
         │ MediaStream
         ▼
┌─────────────────────────┐
│ MediaRecorder           │
│ • Start recording       │
│ • Collect chunks        │
│ • Timer display         │
└────────┬────────────────┘
         │
         │ User Clicks Stop
         ▼
┌─────────────────────────┐
│ Create Blob             │
│ (audio/webm)            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Convert to Base64       │
│ FileReader.readAsDataURL│
└────────┬────────────────┘
         │ base64 string
         ▼
┌─────────────────────────┐
│ sendMessage(audioBlob)  │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /messages           │
│ { audioBlob: base64 }    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Server: Audio Handler    │
│  1. Decode base64        │
│  2. Generate UUID        │
│  3. Upload to Storage    │
│  4. Create signed URL    │
│  5. Store message w/ URL │
└────────┬─────────────────┘
         │
         ├──────────────────┐
         ▼                  ▼
┌──────────────┐    ┌──────────────┐
│ Supabase     │    │ KV Store     │
│ Storage      │    │ Save message │
│              │    │ with audioUrl│
│ upload()     │    └──────────────┘
│ createSigned │
│ Url()        │
└──────┬───────┘
       │ signedUrl (1 year)
       └───────────┬─────────
                   │
                   ▼
           ┌──────────────┐
           │ Response:    │
           │ { message    │
           │   with       │
           │   audioUrl } │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │ UI: Display  │
           │ audio player │
           └──────────────┘
```

### 3. Search Flow

```
User Types Query
       │
       ▼
┌──────────────────┐
│ Input Component  │
│ (Debounced 500ms)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ performSearch()  │
└────────┬─────────┘
         │ query string
         ▼
┌──────────────────┐
│ GET /search?q=.. │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────┐
│ Server: Search Handler     │
│  1. Get conversation list  │
│  2. For each conversation: │
│     - Get messages         │
│     - Filter by query      │
│     - Highlight matches    │
│  3. Return results         │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ KV Store Query             │
│  • Get conversation-list   │
│  • getByPrefix for msgs    │
│  • Filter + highlight      │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Response:                  │
│ [{                         │
│   conversation,            │
│   matches: [{              │
│     ...message,            │
│     highlightedText        │
│   }]                       │
│ }]                         │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ UI: Display Results        │
│  • List conversations      │
│  • Show highlighted text   │
│  • Link to full convo      │
└────────────────────────────┘
```

## 🔐 Security Architecture

### Authentication Flow

```
┌──────────────┐
│   Browser    │
│              │
│ projectId    │ (Public - OK)
│ publicAnonKey│ (Public - OK)
└──────┬───────┘
       │
       │ Authorization: Bearer {publicAnonKey}
       ▼
┌──────────────────────┐
│  Supabase Edge Fn    │
│                      │
│  • Validate request  │
│  • Check permissions │
│  • Rate limiting     │
└──────┬───────────────┘
       │
       │ NEVER exposed to client
       ▼
┌──────────────────────┐
│ Service Role Key     │
│ (Server-side only)   │
│                      │
│ Used for:            │
│ • Storage operations │
│ • Admin operations   │
└──────────────────────┘
```

### Data Access Control

```
┌─────────────────────────────────────┐
│         Client Access               │
│  ✅ Read: All conversations         │
│  ✅ Write: New messages             │
│  ✅ Read: Public endpoints          │
│  ❌ Write: Storage (requires server)│
│  ❌ Delete: Any data               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Server Access               │
│  ✅ Read: All data                  │
│  ✅ Write: All data                 │
│  ✅ Storage: Full access            │
│  ✅ OpenAI API key access           │
└─────────────────────────────────────┘
```

## 📦 Component Architecture

### React Component Tree

```
App (RouterProvider)
└── Root Layout
    ├── Header (Navigation)
    │   ├── Logo
    │   └── Nav Links
    │       ├── Home
    │       └── History
    │
    └── Outlet (Route Content)
        │
        ├── Home Page
        │   ├── ApiKeyNotice
        │   ├── Language Selector
        │   │   ├── Doctor Language
        │   │   └── Patient Language
        │   └── Features Grid
        │
        ├── Conversation Page
        │   ├── Conversation Header
        │   │   ├── Back Button
        │   │   └── Role Selector
        │   │       ├── Doctor Toggle
        │   │       └── Patient Toggle
        │   │
        │   ├── Messages Area
        │   │   └── MessageBubble (Array)
        │   │       ├── Avatar
        │   │       ├── Original Text
        │   │       ├── Translation
        │   │       └── Audio Player
        │   │
        │   ├── AI Summary Section
        │   │   └── AISummary Component
        │   │       ├── Generate Button
        │   │       └── Summary Display
        │   │
        │   └── Input Area
        │       ├── Text Input
        │       ├── Send Button
        │       └── AudioRecorder
        │           ├── Record Button
        │           ├── Stop Button
        │           └── Timer
        │
        ├── ConversationHistory Page
        │   ├── Search Bar
        │   └── Conversation List
        │       └── Conversation Card (Array)
        │           ├── Metadata
        │           ├── Search Matches
        │           └── Summary Preview
        │
        └── NotFound Page
            └── 404 Message
```

## 🗄️ Data Models

### Conversation Model

```typescript
interface Conversation {
  id: string;              // UUID
  createdAt: string;       // ISO 8601
  doctorLanguage: string;  // e.g., "English"
  patientLanguage: string; // e.g., "Spanish"
  summary: string | null;  // AI-generated summary
  lastMessageAt: string;   // ISO 8601
}

// Storage Key: conversations:{id}
```

### Message Model

```typescript
interface Message {
  id: string;              // UUID
  conversationId: string;  // Foreign key
  role: "doctor" | "patient";
  originalText: string;    // User's input
  translatedText: string;  // Translated output
  audioUrl: string | null; // Supabase signed URL
  timestamp: number;       // Unix timestamp (ms)
}

// Storage Key: messages:{conversationId}:{timestamp}
```

### Conversation List

```typescript
type ConversationList = string[]; // Array of conversation IDs

// Storage Key: conversation-list
// Value: ["uuid-1", "uuid-2", ...]
```

## 🔄 State Management

### Client State (React useState)

```typescript
// Conversation Page
const [conversation, setConversation] = useState<Conversation | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [currentRole, setCurrentRole] = useState<"doctor" | "patient">("doctor");
const [inputText, setInputText] = useState("");
const [isSending, setIsSending] = useState(false);

// Home Page
const [doctorLanguage, setDoctorLanguage] = useState("English");
const [patientLanguage, setPatientLanguage] = useState("Spanish");
const [loading, setLoading] = useState(false);

// History Page
const [conversations, setConversations] = useState<Conversation[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
```

### Server State (Supabase KV)

```typescript
// Persistent storage
await kv.set(`conversations:${id}`, conversation);
await kv.set(`messages:${convId}:${timestamp}`, message);
await kv.set('conversation-list', conversationIds);

// Retrieval
const conversation = await kv.get(`conversations:${id}`);
const messages = await kv.getByPrefix(`messages:${convId}:`);
const list = await kv.get('conversation-list');
```

## 🌐 API Design

### RESTful Endpoints

```
BASE_URL: https://{projectId}.supabase.co/functions/v1/make-server-b5f5c952

POST   /conversations           Create new conversation
GET    /conversations           List all conversations  
GET    /conversations/:id       Get single conversation with messages
POST   /messages                Add message (auto-translates)
POST   /translate               Translate text
POST   /summarize               Generate AI summary
GET    /search?q={query}        Search conversations
GET    /health                  Health check
```

### Request/Response Formats

#### Create Conversation
```typescript
// Request
POST /conversations
{
  "doctorLanguage": "English",
  "patientLanguage": "Spanish"
}

// Response
{
  "success": true,
  "conversation": {
    "id": "uuid",
    "createdAt": "2026-02-06T...",
    "doctorLanguage": "English",
    "patientLanguage": "Spanish",
    "summary": null,
    "lastMessageAt": "2026-02-06T..."
  }
}
```

#### Add Message
```typescript
// Request
POST /messages
{
  "conversationId": "uuid",
  "role": "doctor",
  "originalText": "Hello",
  "audioBlob": "base64..." // Optional
}

// Response
{
  "success": true,
  "message": {
    "id": "uuid",
    "conversationId": "uuid",
    "role": "doctor",
    "originalText": "Hello",
    "translatedText": "Hola",
    "audioUrl": "https://...",
    "timestamp": 1707264000000
  }
}
```

## 🔌 External API Integration

### OpenAI API Usage

#### Translation (GPT-3.5-turbo)
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a professional medical translator...'
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.3,
  }),
});
```

#### Summary (GPT-4)
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a medical documentation assistant...'
      },
      {
        role: 'user',
        content: conversationText
      }
    ],
    temperature: 0.5,
  }),
});
```

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting:** React Router lazy loading
- **Debouncing:** Search input (500ms)
- **Memoization:** Component re-renders minimized
- **Asset Optimization:** Tailwind purge, Vite minification

### Backend
- **Efficient Queries:** Prefix-based KV retrieval
- **Batch Operations:** Multi-get for conversations
- **Signed URLs:** 1-year validity reduces regeneration
- **Connection Pooling:** Supabase handles automatically

### Network
- **Compression:** Brotli/Gzip on Figma Make CDN
- **Caching:** Static assets cached (immutable)
- **HTTP/2:** Multiplexed connections
- **CDN:** Figma Make global distribution

## 📈 Scalability Considerations

### Current Limits (Free Tier)
- **Database:** 500MB
- **Storage:** 1GB
- **Edge Functions:** 500K invocations/month
- **Bandwidth:** 5GB/month

### Scaling Strategy
1. **Tier 1 (100 users):** Current setup sufficient
2. **Tier 2 (1K users):** Upgrade Supabase to Pro
3. **Tier 3 (10K users):** Add caching layer (Redis)
4. **Tier 4 (100K+ users):** Microservices, load balancing

## 🔍 Monitoring & Observability

### Logging
```typescript
// Server-side logging
console.log(`Error translating text: ${error}`);
console.log(`User created conversation: ${id}`);

// Client-side logging
console.error("Failed to load conversation:", error);
```

### Metrics to Track
- API response times
- Error rates by endpoint
- Storage usage
- OpenAI API costs
- User engagement (messages sent)

---

**Architecture Version:** 1.0
**Last Updated:** February 6, 2026
**Complexity:** Medium-High
**Maintainability:** High
**Scalability:** Moderate (upgradable)
