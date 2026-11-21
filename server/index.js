import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzePrescription } from './services/prescriptionService.js';

const app = express();
const PORT = process.env.PORT || 5001;

// CORS & Body parsing
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Multer memory storage for prescription uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/svg+xml',
      'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload a JPG, PNG, WEBP, or PDF image.`));
    }
  },
});

// ─── In-memory OTP store (demo) ─────────────────────────────────────────────
const otpStore = new Map(); // phone -> { code, expiresAt }

// ─── Demo user database ─────────────────────────────────────────────────────
const demoUsers = {
  '+919876543210': { id: 'p_101', name: 'Ram Prasad Asija', role: 'patient', phone: '+91 98765 43210', password: 'careloop123' },
  '+919811122334': { id: 'g_201', name: 'Aman Asija', role: 'guardian', phone: '+91 98111 22334', password: 'careloop123' },
};

function normalizePhone(phone) {
  return phone.replace(/[\s\-()]/g, '');
}

// ─── Health check endpoint ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const isKeyConfigured = Boolean(process.env.GEMINI_API_KEY);
  const isTelegramConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  res.json({
    status: 'ok',
    service: 'CareLoop Backend',
    version: '2.1.0',
    geminiConfigured: isKeyConfigured,
    telegramConfigured: isTelegramConfigured,
    timestamp: new Date().toISOString(),
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═════════════════════════════════════════════════════════════════════════════

// Login
app.post('/api/auth/login', (req, res) => {
  const { phone, password, role } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ success: false, error: 'Phone and password are required.' });
  }

  const normalized = normalizePhone(phone);
  const user = demoUsers[normalized];

  if (user && user.password === password) {
    return res.json({
      success: true,
      user: { id: user.id, name: user.name, role: role || user.role, phone: user.phone },
      message: 'Credentials verified. OTP sent for 2FA.',
    });
  }

  // For demo: accept any credentials if password is 'careloop123'
  if (password === 'careloop123') {
    return res.json({
      success: true,
      user: {
        id: role === 'guardian' ? 'g_201' : 'p_101',
        name: role === 'guardian' ? 'Aman Asija' : 'Ram Prasad Asija',
        role: role || 'patient',
        phone,
      },
      message: 'Credentials verified. OTP sent for 2FA.',
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid phone number or password.' });
});

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, phone, password, role } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ success: false, error: 'Name, phone, and password are required.' });
  }

  const normalized = normalizePhone(phone);

  // For demo, always succeed
  const userId = role === 'guardian' ? `g_${Date.now()}` : `p_${Date.now()}`;

  // Store as demo user for this session
  demoUsers[normalized] = { id: userId, name, role: role || 'patient', phone, password };

  return res.json({
    success: true,
    user: { id: userId, name, role: role || 'patient', phone },
    message: 'Account created successfully. Please verify with OTP.',
  });
});

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required.' });
  }

  // Generate 6-digit OTP (demo: always 123456)
  const code = '123456';
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalizePhone(phone), { code, expiresAt });

  console.log(`[CareLoop Auth] OTP for ${phone}: ${code}`);

  return res.json({
    success: true,
    message: 'Verification code sent via SMS.',
    // In production, never expose the code. Demo only:
    demo_hint: 'Use code 123456',
  });
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ success: false, error: 'Phone and verification code are required.' });
  }

  const normalized = normalizePhone(phone);
  const stored = otpStore.get(normalized);

  // Demo: accept "123456" always
  if (code === '123456') {
    otpStore.delete(normalized);
    return res.json({
      success: true,
      message: 'Phone number verified successfully.',
      token: 'cl_' + Math.random().toString(36).slice(2) + Date.now().toString(36),
    });
  }

  if (!stored) {
    return res.status(400).json({ success: false, error: 'No OTP found. Please request a new code.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalized);
    return res.status(400).json({ success: false, error: 'Code expired. Please request a new one.' });
  }

  if (stored.code !== code) {
    return res.status(400).json({ success: false, error: 'Invalid verification code. Please try again.' });
  }

  otpStore.delete(normalized);
  return res.json({
    success: true,
    message: 'Phone number verified successfully.',
    token: 'cl_' + Math.random().toString(36).slice(2) + Date.now().toString(36),
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ═════════════════════════════════════════════════════════════════════════════
// TELEGRAM ENDPOINTS
// ═════════════════════════════════════════════════════════════════════════════

// Telegram notification endpoint
app.post('/api/telegram/send-alert', async (req, res) => {
  try {
    const { message, chatId, botToken } = req.body;
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Alert message is required.' });
    }

    if (token && targetChatId) {
      // Dispatch real message via Telegram Bot API
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
      const tgRes = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: `🚨 CareLoop Alert:\n\n${message}\n\nPlease check on your patient.`,
          parse_mode: 'HTML',
        }),
      });

      const tgData = await tgRes.json();
      if (!tgRes.ok || !tgData.ok) {
        throw new Error(tgData.description || 'Telegram Bot API error');
      }

      return res.json({
        success: true,
        liveDispatched: true,
        deliveredTo: targetChatId,
        message,
      });
    }

    // If token not provided, return graceful simulation status
    return res.json({
      success: true,
      liveDispatched: false,
      simulated: true,
      message,
      info: 'Simulated alert logged. To receive live push messages on your phone, set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.',
    });
  } catch (err) {
    console.error('[CareLoop Server] Telegram dispatch error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Telegram test connection endpoint
app.post('/api/telegram/test-connection', async (req, res) => {
  try {
    const { botToken, chatId } = req.body;
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Bot token is required.' });
    }

    // Verify bot token with getMe
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json();

    if (!meRes.ok || !meData.ok) {
      return res.status(400).json({
        success: false,
        error: `Invalid bot token: ${meData.description || 'Token verification failed'}`,
      });
    }

    const botInfo = meData.result;

    // If chatId provided, send a test message
    if (targetChatId) {
      const testRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: `✅ CareLoop Test Connection Successful!\n\n🤖 Bot: @${botInfo.username}\n📱 Chat ID: ${targetChatId}\n⏰ Time: ${new Date().toLocaleString()}\n\nYou will receive medication alerts here.`,
        }),
      });

      const testData = await testRes.json();

      if (!testRes.ok || !testData.ok) {
        return res.json({
          success: true,
          botVerified: true,
          chatVerified: false,
          botName: `@${botInfo.username}`,
          error: `Bot verified, but could not send to chat ${targetChatId}: ${testData.description}`,
        });
      }

      return res.json({
        success: true,
        botVerified: true,
        chatVerified: true,
        botName: `@${botInfo.username}`,
        botId: botInfo.id,
        message: `Connection successful! Test message sent to chat ${targetChatId}.`,
      });
    }

    return res.json({
      success: true,
      botVerified: true,
      chatVerified: false,
      botName: `@${botInfo.username}`,
      botId: botInfo.id,
      message: 'Bot token verified successfully. Add a Chat ID to test message delivery.',
    });
  } catch (err) {
    console.error('[CareLoop Server] Telegram test error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// PRESCRIPTION SCANNING
// ═════════════════════════════════════════════════════════════════════════════

app.post('/api/prescriptions/scan', upload.single('prescription'), async (req, res) => {
  try {
    let fileBuffer = null;
    let mimeType = 'image/jpeg';

    if (req.file) {
      fileBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body?.image) {
      // Support base64 image strings (e.g. data:image/png;base64,...)
      const raw = req.body.image;
      if (raw.startsWith('data:')) {
        const matches = raw.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          fileBuffer = Buffer.from(matches[2], 'base64');
        } else if (raw.includes(';utf8,') || raw.includes('svg+xml')) {
          // SVG data URI
          mimeType = 'image/svg+xml';
          const commaIdx = raw.indexOf(',');
          const svgContent = decodeURIComponent(raw.slice(commaIdx + 1));
          fileBuffer = Buffer.from(svgContent, 'utf-8');
        } else {
          fileBuffer = Buffer.from(raw, 'base64');
        }
      } else {
        fileBuffer = Buffer.from(raw, 'base64');
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No prescription image provided. Please upload a clear photo or document.',
      });
    }

    // Call Gemini Multimodal analysis
    const result = await analyzePrescription(fileBuffer, mimeType);
    return res.json(result);
  } catch (error) {
    console.error('[CareLoop Server] Scan error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while analyzing the prescription.',
    });
  }
});

// Global error handler for multer/upload errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds maximum limit of 15MB. Please upload a smaller photo.',
      });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[CareLoop Server] Running on http://localhost:${PORT}`);
  console.log(`[CareLoop Server] Gemini API Status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Missing Key'}`);
  console.log(`[CareLoop Server] Auth endpoints: /api/auth/login, /api/auth/signup, /api/auth/send-otp, /api/auth/verify-otp`);
});
