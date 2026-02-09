# API Documentation

Complete reference for the Healthcare Translation Application API.

## 🌐 Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-b5f5c952
```

Replace `{projectId}` with your actual Supabase project ID.

## 🔐 Authentication

All requests require Bearer token authentication:

```http
Authorization: Bearer {publicAnonKey}
```

Get your `projectId` and `publicAnonKey` from:
```typescript
import { projectId, publicAnonKey } from "/utils/supabase/info";
```

## 📡 Endpoints

### 1. Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

### 2. Create Conversation

**POST** `/conversations`

Create a new conversation between doctor and patient.

**Request Body:**
```json
{
  "doctorLanguage": "English",
  "patientLanguage": "Spanish"
}
```

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-02-06T12:00:00.000Z",
    "doctorLanguage": "English",
    "patientLanguage": "Spanish",
    "summary": null,
    "lastMessageAt": "2026-02-06T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 3. List Conversations

**GET** `/conversations`

Get all conversations ordered by most recent.

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-06T12:00:00.000Z",
      "doctorLanguage": "English",
      "patientLanguage": "Spanish",
      "summary": "Patient presented with headache...",
      "lastMessageAt": "2026-02-06T12:15:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 4. Get Conversation

**GET** `/conversations/:id`

Get a single conversation with all messages.

**URL Parameters:**
- `id` (required) - Conversation UUID

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-02-06T12:00:00.000Z",
    "doctorLanguage": "English",
    "patientLanguage": "Spanish",
    "summary": null,
    "lastMessageAt": "2026-02-06T12:15:00.000Z"
  },
  "messages": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "conversationId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "doctor",
      "originalText": "What symptoms are you experiencing?",
      "translatedText": "¿Qué síntomas estás experimentando?",
      "audioUrl": null,
      "timestamp": 1707264000000
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `404` - Conversation not found
- `500` - Server error

---

### 5. Translate Text

**POST** `/translate`

Translate text to target language using OpenAI.

**Request Body:**
```json
{
  "text": "Hello, how are you?",
  "targetLanguage": "Spanish"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "Hola, ¿cómo estás?"
}
```

**Status Codes:**
- `200` - Success
- `500` - Translation error or OPENAI_API_KEY not configured

**Error Response:**
```json
{
  "success": false,
  "error": "OPENAI_API_KEY not configured",
  "details": "..."
}
```

---

### 6. Add Message

**POST** `/messages`

Add a message to a conversation. Automatically translates the message.

**Request Body:**
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "doctor",
  "originalText": "What brings you in today?",
  "audioBlob": "base64-encoded-audio-data"  // Optional
}
```

**Parameters:**
- `conversationId` (required) - Conversation UUID
- `role` (required) - "doctor" or "patient"
- `originalText` (required) - Message text
- `audioBlob` (optional) - Base64-encoded audio file

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "doctor",
    "originalText": "What brings you in today?",
    "translatedText": "¿Qué te trae hoy?",
    "audioUrl": "https://...supabase.co/storage/v1/object/sign/...",
    "timestamp": 1707264000000
  }
}
```

**Audio Handling:**
- Audio is uploaded to Supabase Storage
- Signed URL is generated (valid for 1 year)
- URL is included in response

**Status Codes:**
- `200` - Success
- `404` - Conversation not found
- `500` - Server error

---

### 7. Generate Summary

**POST** `/summarize`

Generate an AI-powered clinical summary of a conversation.

**Request Body:**
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "**Chief Complaint:**\nPatient presents with recurring headaches...\n\n**Assessment:**\nLikely tension headaches...\n\n**Medications:**\n- Ibuprofen 400mg as needed\n\n**Follow-up:**\nReturn in 2 weeks if symptoms persist."
}
```

**Status Codes:**
- `200` - Success
- `404` - Conversation not found
- `500` - Summarization error or OPENAI_API_KEY not configured

**Notes:**
- Summary is saved to the conversation
- Uses GPT-4 for high-quality medical documentation
- Includes: symptoms, diagnosis, medications, follow-up

---

### 8. Search Conversations

**GET** `/search?q={query}`

Search all conversations for keywords or phrases.

**Query Parameters:**
- `q` (required) - Search query (URL-encoded)

**Example:**
```
GET /search?q=headache
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "conversation": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2026-02-06T12:00:00.000Z",
        "doctorLanguage": "English",
        "patientLanguage": "Spanish",
        "summary": "...",
        "lastMessageAt": "2026-02-06T12:15:00.000Z"
      },
      "matches": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "role": "patient",
          "originalText": "I have a severe headache",
          "translatedText": "Tengo un dolor de cabeza severo",
          "highlightedOriginal": "I have a severe <mark>headache</mark>",
          "highlightedTranslated": "Tengo un dolor de cabeza severo",
          "timestamp": 1707264000000
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing query parameter
- `500` - Server error

**Search Features:**
- Case-insensitive
- Searches both original and translated text
- Returns all matching conversations
- Highlights matched text with `<mark>` tags

---

## 🔧 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"  // Optional
}
```

### Common Errors

#### OPENAI_API_KEY Not Configured
```json
{
  "success": false,
  "error": "OPENAI_API_KEY not configured"
}
```

**Solution:** Configure the environment variable in Supabase dashboard.

#### Conversation Not Found
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

**Solution:** Verify the conversation ID exists.

#### Translation API Error
```json
{
  "success": false,
  "error": "Translation API error",
  "details": "OpenAI API error: ..."
}
```

**Solution:** Check OpenAI API key and account status.

---

## 📊 Rate Limits

### Supabase Edge Functions
- **Free Tier:** 500K invocations/month
- **Pro Tier:** 2M invocations/month

### OpenAI API
- **Rate Limits:** Depend on your OpenAI account tier
- **Cost per request:**
  - GPT-3.5-turbo: ~$0.0005/message
  - GPT-4: ~$0.03/summary

---

## 🧪 Example Usage

### JavaScript/TypeScript

```typescript
import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b5f5c952`;

// Create conversation
async function createConversation(doctorLang: string, patientLang: string) {
  const response = await fetch(`${BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({
      doctorLanguage: doctorLang,
      patientLanguage: patientLang,
    }),
  });
  
  const data = await response.json();
  return data.conversation;
}

// Send message
async function sendMessage(
  conversationId: string,
  role: "doctor" | "patient",
  text: string
) {
  const response = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({
      conversationId,
      role,
      originalText: text,
    }),
  });
  
  const data = await response.json();
  return data.message;
}

// Generate summary
async function generateSummary(conversationId: string) {
  const response = await fetch(`${BASE_URL}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ conversationId }),
  });
  
  const data = await response.json();
  return data.summary;
}

// Search conversations
async function searchConversations(query: string) {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    }
  );
  
  const data = await response.json();
  return data.results;
}
```

### cURL

```bash
# Create conversation
curl -X POST https://{projectId}.supabase.co/functions/v1/make-server-b5f5c952/conversations \
  -H "Authorization: Bearer {publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{"doctorLanguage":"English","patientLanguage":"Spanish"}'

# Add message
curl -X POST https://{projectId}.supabase.co/functions/v1/make-server-b5f5c952/messages \
  -H "Authorization: Bearer {publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "doctor",
    "originalText": "Hello"
  }'

# Search
curl https://{projectId}.supabase.co/functions/v1/make-server-b5f5c952/search?q=headache \
  -H "Authorization: Bearer {publicAnonKey}"
```

---

## 🔒 Security

### Authentication
- All endpoints require Bearer token
- Public anonymous key is safe for client-side use
- Service role key is server-side only (never expose)

### Data Privacy
- Audio files stored in private bucket
- Signed URLs expire after 1 year
- All data encrypted in transit (HTTPS)
- Database access controlled by Supabase

### CORS
- Currently configured for `origin: "*"` (prototype)
- Restrict to specific domain in production

---

## 📝 Notes

### Translation Quality
- Uses GPT-3.5-turbo for fast, accurate translation
- Medical terminology preserved
- Context-aware translations

### Summary Quality
- Uses GPT-4 for high-quality clinical documentation
- Extracts key medical information
- Formatted for easy reading

### Audio Handling
- Supports WebM format
- Base64 encoding for transfer
- Automatic upload to Supabase Storage
- Signed URLs for secure access

---

## 🆘 Support

For issues with the API:
1. Check server logs in Supabase dashboard
2. Verify OPENAI_API_KEY is configured
3. Ensure conversation IDs are valid
4. Check OpenAI account status

---

**API Version:** 1.0
**Last Updated:** February 6, 2026
**Base Framework:** Hono (Deno runtime)
