const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For handling multipart/form-data (audio uploads)
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

require('dotenv').config({ path: path.join(__dirname, '.env') });

// Also try loading from parent .env if local .env doesn't have the key
if (!process.env.OPENAI_API_KEY) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    // In production, allow all origins since frontend is served from same server
    if (!origin || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else if (process.env.ALLOWED_ORIGINS?.split(',').includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ conversations: [], messages: [], conversationList: [] })
  .write();

// OpenAI Setup
// Make sure OPENAI_API_KEY is in your .env file in the root directory
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    // Create conversation-specific folder if needed, but flat structure is easier for now
    // logic in original was: conversationId/audioId.webm
    // We'll mimic this by just saving flat and returning the URL
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // We'll rely on the client or generate a unique name
    // Original logic: audioId.webm
    // We can just use a timestamp + random to be safe
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.webm')
  }
});
const upload = multer({ storage: storage });
// Allowed languages for validation
const ALLOWED_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic',
  'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Portuguese',
  'Russian', 'Japanese'
];

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Helper to sanitize errors for production
function sanitizeError(error) {
  if (process.env.NODE_ENV === 'production') {
    return 'An internal error occurred';
  }
  return String(error);
}

// --- API Routes ---

// Health Check
app.get('/make-server-b5f5c952/health', (req, res) => {
  res.json({ status: "ok" });
});

// Create Conversation
app.post('/make-server-b5f5c952/conversations', async (req, res) => {
  try {
    const { doctorLanguage, patientLanguage } = req.body;

    // Validate languages
    if (!ALLOWED_LANGUAGES.includes(doctorLanguage)) {
      return res.status(400).json({ success: false, error: 'Invalid doctor language' });
    }
    if (!ALLOWED_LANGUAGES.includes(patientLanguage)) {
      return res.status(400).json({ success: false, error: 'Invalid patient language' });
    }

    const conversationId = crypto.randomUUID();

    const conversation = {
      id: conversationId,
      createdAt: new Date().toISOString(),
      doctorLanguage,
      patientLanguage,
      summary: null,
      lastMessageAt: new Date().toISOString(),
    };

    // Save to DB
    db.get('conversations')
      .push(conversation)
      .write();

    // Add to conversation list (keeping the order)
    db.get('conversationList')
      .unshift(conversationId)
      .write();

    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ success: false, error: sanitizeError(error) });
  }
});

// Get All Conversations
app.get('/make-server-b5f5c952/conversations', (req, res) => {
  try {
    const conversationList = db.get('conversationList').value() || [];
    // Retrieve full conversation objects based on the list order
    const conversations = conversationList.map(id =>
      db.get('conversations').find({ id }).value()
    ).filter(Boolean);

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, error: sanitizeError(error) });
  }
});

// Get Single Conversation
app.get('/make-server-b5f5c952/conversations/:id', (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = db.get('conversations').find({ id: conversationId }).value();

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const messages = db.get('messages')
      .filter({ conversationId })
      .value()
      .sort((a, b) => a.timestamp - b.timestamp);

    res.json({ success: true, conversation, messages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ success: false, error: sanitizeError(error) });
  }
});

// Translate
app.post('/make-server-b5f5c952/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'OPENAI_API_KEY not configured' });
    }

    const response = await openai.chat.completions.create({
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
    });

    const translatedText = response.choices[0].message.content.trim();
    res.json({ success: true, translatedText });

  } catch (error) {
    console.error('Error translating:', error);
    res.status(500).json({ success: false, error: 'Translation API error', details: sanitizeError(error) });
  }
});

// Post Messages (supports audio file upload now)
// Note: original used JSON body with base64 audioBlob. 
// We will adapt to accept JSON body primarily to match frontend logic, OR modify frontend to send FormData.
// Looking at original code: `const { conversationId, role, originalText, audioBlob } = await c.req.json();`
// It sends JSON with base64 audio. We should support that.

app.post('/make-server-b5f5c952/messages', upload.none(), async (req, res) => {
  // upload.none() because we expect base64 string in body, not multipart/form-data file for now, 
  // unless we change frontend. The original frontend sends JSON.
  try {
    const { conversationId, role, originalText, audioBlob } = req.body;

    const conversation = db.get('conversations').find({ id: conversationId }).value();

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    // Determine target language
    const targetLanguage = role === 'doctor' ? conversation.patientLanguage : conversation.doctorLanguage;

    // Translate if text exists
    let translatedText = originalText;
    if (originalText) {
      // We can call our own translation logic or endpoint. Let's just call the logic directly.
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional medical translator. Translate the following text to ${targetLanguage}. Only return the translation, nothing else.`
            },
            {
              role: 'user',
              content: originalText
            }
          ],
          temperature: 0.3,
        });
        translatedText = response.choices[0].message.content.trim();
      } catch (e) {
        console.error("Translation failed inside message post", e);
        // proceed with original text? or fail? Original seems to continue if fail logic wasn't strict
      }
    }

    // Handle Audio
    let audioUrl = null;
    if (audioBlob) {
      // base64 to file
      const audioId = crypto.randomUUID();
      const fileName = `${conversationId}-${audioId}.webm`;
      const filePath = path.join(__dirname, 'uploads', fileName);

      const buffer = Buffer.from(audioBlob, 'base64');
      fs.writeFileSync(filePath, buffer);

      // Construct URL - assuming we serve static files from /uploads
      // We need the full URL or relative path. Frontend likely expects a URL it can fetch.
      // We'll return a relative URL that the vite proxy or direct call can resolve.
      // If we proxy /make-server-b5f5c952, we might want a separate route for audio or serve it under the same prefix.
      // Let's serve under /uploads and assume we'll proxy that too or it's on the same domain.
      // Actually, if we use proxy, everything goes to localhost:3000. 
      // So returning `/uploads/${fileName}` should work if we verify vite config.
      audioUrl = `/uploads/${fileName}`;
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

    db.get('messages').push(message).write();

    // Update conversation lastMessageAt
    db.get('conversations')
      .find({ id: conversationId })
      .assign({ lastMessageAt: new Date().toISOString() })
      .write();

    res.json({ success: true, message });

  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ success: false, error: sanitizeError(error) });
  }
});

// Summarize
app.post('/make-server-b5f5c952/summarize', async (req, res) => {
  try {
    const { conversationId } = req.body;

    const conversation = db.get('conversations').find({ id: conversationId }).value();
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const messages = db.get('messages')
      .filter({ conversationId })
      .value()
      .sort((a, b) => a.timestamp - b.timestamp);

    const conversationText = messages.map(m =>
      `${m.role.toUpperCase()}: ${m.originalText || '[Audio message]'}`
    ).join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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
    });

    const summary = response.choices[0].message.content.trim();

    // Save summary
    db.get('conversations')
      .find({ id: conversationId })
      .assign({ summary })
      .write();

    res.json({ success: true, summary });

  } catch (error) {
    console.error('Error summarizing:', error);
    res.status(500).json({ success: false, error: sanitizeError(error) });
  }
});

// Search
app.get('/make-server-b5f5c952/search', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase();
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }

    const conversationList = db.get('conversationList').value() || [];
    const results = [];

    for (const convId of conversationList) {
      const messages = db.get('messages')
        .filter({ conversationId: convId })
        .value();

      const matchingMessages = messages.filter(m =>
        (m.originalText && m.originalText.toLowerCase().includes(query)) ||
        (m.translatedText && m.translatedText.toLowerCase().includes(query))
      );

      if (matchingMessages.length > 0) {
        const conversation = db.get('conversations').find({ id: convId }).value();
        results.push({
          conversation,
          matches: matchingMessages.map(m => ({
            ...m,
            highlightedOriginal: m.originalText ? highlightText(m.originalText, query) : null,
            highlightedTranslated: m.translatedText ? highlightText(m.translatedText, query) : null
          }))
        });
      }
    }

    res.json({ success: true, results });

  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ success: false, error: sanitizeError(error) });
  }
});

function highlightText(text, query) {
  // Escape regex special characters to prevent ReDoS attacks
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  // Escape HTML to prevent XSS attacks
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  return escaped.replace(regex, '<mark>$1</mark>');
}

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Don't intercept API routes or uploads
    if (req.path.startsWith('/make-server-b5f5c952') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
