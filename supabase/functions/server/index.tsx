import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create audio storage bucket on startup
(async () => {
  const bucketName = 'make-b5f5c952-audio';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log('Created audio storage bucket');
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b5f5c952/health", (c) => {
  return c.json({ status: "ok" });
});

// Create new conversation
app.post("/make-server-b5f5c952/conversations", async (c) => {
  try {
    const { doctorLanguage, patientLanguage } = await c.req.json();
    
    const conversationId = crypto.randomUUID();
    const conversation = {
      id: conversationId,
      createdAt: new Date().toISOString(),
      doctorLanguage,
      patientLanguage,
      summary: null,
      lastMessageAt: new Date().toISOString(),
    };
    
    await kv.set(`conversations:${conversationId}`, conversation);
    
    // Add to conversation list
    const conversationList = await kv.get('conversation-list') || [];
    conversationList.unshift(conversationId);
    await kv.set('conversation-list', conversationList);
    
    return c.json({ success: true, conversation });
  } catch (error) {
    console.log(`Error creating conversation: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all conversations
app.get("/make-server-b5f5c952/conversations", async (c) => {
  try {
    const conversationList = await kv.get('conversation-list') || [];
    const conversations = await kv.mget(conversationList.map(id => `conversations:${id}`));
    
    return c.json({ success: true, conversations: conversations.filter(Boolean) });
  } catch (error) {
    console.log(`Error fetching conversations: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single conversation with messages
app.get("/make-server-b5f5c952/conversations/:id", async (c) => {
  try {
    const conversationId = c.req.param('id');
    const conversation = await kv.get(`conversations:${conversationId}`);
    
    if (!conversation) {
      return c.json({ success: false, error: 'Conversation not found' }, 404);
    }
    
    const messageKeys = await kv.getByPrefix(`messages:${conversationId}:`);
    const messages = messageKeys.sort((a, b) => a.timestamp - b.timestamp);
    
    return c.json({ success: true, conversation, messages });
  } catch (error) {
    console.log(`Error fetching conversation ${c.req.param('id')}: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Translate text
app.post("/make-server-b5f5c952/translate", async (c) => {
  try {
    const { text, targetLanguage } = await c.req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      return c.json({ success: false, error: 'OPENAI_API_KEY not configured' }, 500);
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional medical translator. Translate the following text to ${targetLanguage}. Only return the translation, nothing else.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`OpenAI API error during translation: ${errorText}`);
      return c.json({ success: false, error: 'Translation API error', details: errorText }, 500);
    }
    
    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();
    
    return c.json({ success: true, translatedText });
  } catch (error) {
    console.log(`Error translating text: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add message to conversation
app.post("/make-server-b5f5c952/messages", async (c) => {
  try {
    const { conversationId, role, originalText, audioBlob } = await c.req.json();
    
    const conversation = await kv.get(`conversations:${conversationId}`);
    if (!conversation) {
      return c.json({ success: false, error: 'Conversation not found' }, 404);
    }
    
    // Determine target language based on role
    const targetLanguage = role === 'doctor' ? conversation.patientLanguage : conversation.doctorLanguage;
    
    // Translate the text
    let translatedText = originalText;
    if (originalText) {
      const translateResponse = await fetch(`${c.req.url.split('/make-server-b5f5c952')[0]}/make-server-b5f5c952/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': c.req.header('Authorization') || '',
        },
        body: JSON.stringify({ text: originalText, targetLanguage }),
      });
      
      const translateData = await translateResponse.json();
      if (translateData.success) {
        translatedText = translateData.translatedText;
      }
    }
    
    // Handle audio upload if present
    let audioUrl = null;
    if (audioBlob) {
      const audioId = crypto.randomUUID();
      const audioPath = `${conversationId}/${audioId}.webm`;
      
      // Convert base64 to binary
      const audioData = Uint8Array.from(atob(audioBlob), c => c.charCodeAt(0));
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('make-b5f5c952-audio')
        .upload(audioPath, audioData, {
          contentType: 'audio/webm',
        });
      
      if (uploadError) {
        console.log(`Error uploading audio: ${uploadError.message}`);
      } else {
        // Generate signed URL (valid for 1 year)
        const { data: urlData } = await supabase.storage
          .from('make-b5f5c952-audio')
          .createSignedUrl(audioPath, 31536000);
        
        audioUrl = urlData?.signedUrl || null;
      }
    }
    
    const messageId = crypto.randomUUID();
    const timestamp = Date.now();
    const message = {
      id: messageId,
      conversationId,
      role,
      originalText,
      translatedText,
      audioUrl,
      timestamp,
    };
    
    await kv.set(`messages:${conversationId}:${timestamp}`, message);
    
    // Update conversation's lastMessageAt
    conversation.lastMessageAt = new Date().toISOString();
    await kv.set(`conversations:${conversationId}`, conversation);
    
    return c.json({ success: true, message });
  } catch (error) {
    console.log(`Error adding message: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Generate AI summary
app.post("/make-server-b5f5c952/summarize", async (c) => {
  try {
    const { conversationId } = await c.req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      return c.json({ success: false, error: 'OPENAI_API_KEY not configured' }, 500);
    }
    
    const conversation = await kv.get(`conversations:${conversationId}`);
    if (!conversation) {
      return c.json({ success: false, error: 'Conversation not found' }, 404);
    }
    
    const messageKeys = await kv.getByPrefix(`messages:${conversationId}:`);
    const messages = messageKeys.sort((a, b) => a.timestamp - b.timestamp);
    
    const conversationText = messages.map(m => 
      `${m.role.toUpperCase()}: ${m.originalText || '[Audio message]'}`
    ).join('\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a medical documentation assistant. Create a concise clinical summary of this doctor-patient conversation. Highlight: 1) Chief complaint/symptoms, 2) Diagnosis/assessment, 3) Medications prescribed, 4) Follow-up actions. Use clear medical terminology.'
          },
          {
            role: 'user',
            content: conversationText
          }
        ],
        temperature: 0.5,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`OpenAI API error during summarization: ${errorText}`);
      return c.json({ success: false, error: 'Summarization API error', details: errorText }, 500);
    }
    
    const data = await response.json();
    const summary = data.choices[0].message.content.trim();
    
    // Save summary to conversation
    conversation.summary = summary;
    await kv.set(`conversations:${conversationId}`, conversation);
    
    return c.json({ success: true, summary });
  } catch (error) {
    console.log(`Error generating summary: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Search conversations
app.get("/make-server-b5f5c952/search", async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase();
    
    if (!query) {
      return c.json({ success: false, error: 'Query parameter required' }, 400);
    }
    
    const conversationList = await kv.get('conversation-list') || [];
    const results = [];
    
    for (const convId of conversationList) {
      const messageKeys = await kv.getByPrefix(`messages:${convId}:`);
      const matchingMessages = messageKeys.filter(m => 
        m.originalText?.toLowerCase().includes(query) ||
        m.translatedText?.toLowerCase().includes(query)
      );
      
      if (matchingMessages.length > 0) {
        const conversation = await kv.get(`conversations:${convId}`);
        results.push({
          conversation,
          matches: matchingMessages.map(m => ({
            ...m,
            highlightedOriginal: m.originalText ? highlightText(m.originalText, query) : null,
            highlightedTranslated: m.translatedText ? highlightText(m.translatedText, query) : null,
          })),
        });
      }
    }
    
    return c.json({ success: true, results });
  } catch (error) {
    console.log(`Error searching conversations: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Helper function to highlight search terms
function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

Deno.serve(app.fetch);