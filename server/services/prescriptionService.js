import { GoogleGenAI } from '@google/genai';

// Initialize the official Google Gen AI SDK
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('[CareLoop Server] Warning: GEMINI_API_KEY is not set in environment.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

const SYSTEM_INSTRUCTION = `
You are CareLoop's Medical Prescription Handwriting Analyzer.
Your task is to analyze doctor's handwritten and printed prescriptions and extract structured medication schedules.

CRITICAL MEDICAL SAFETY RULES:
1. NEVER INVENT OR GUESS MEDICINES OR DOSAGES. Extract only what is written on the prescription.
2. If a dosage or medicine name is smudged, illegible, ambiguous, or has question marks, you MUST set "uncertain": true and detail the exact ambiguity in "flagReason" (e.g. "Dosage is smudged or ambiguous between 5mg and 10mg").
3. NEVER RECOMMEND CHANGING PRESCRIBED DOSAGES.
4. For scheduledTimes, map doctor frequency shorthand accurately:
   - 1-0-1 -> ["08:00 AM", "08:00 PM"]
   - 1-0-0 or Morning -> ["08:00 AM"]
   - 0-1-0 or Afternoon -> ["02:00 PM"]
   - 0-0-1 or Night -> ["08:00 PM"]
   - 1-1-1 -> ["08:00 AM", "02:00 PM", "08:00 PM"]
5. Provide Devanagari Hindi transliteration for nameHindi, dosageHindi, and instructionsHindi to support voice guidance for elderly Hindi-speaking patients.
`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    doctorName: { type: 'STRING' },
    clinicName: { type: 'STRING' },
    date: { type: 'STRING' },
    patientName: { type: 'STRING' },
    medicines: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          nameHindi: { type: 'STRING' },
          dosage: { type: 'STRING' },
          dosageHindi: { type: 'STRING' },
          frequency: { type: 'STRING' },
          frequencyHindi: { type: 'STRING' },
          scheduledTimes: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
          duration: { type: 'STRING' },
          instructions: { type: 'STRING' },
          instructionsHindi: { type: 'STRING' },
          uncertain: { type: 'BOOLEAN' },
          flagReason: { type: 'STRING' },
        },
        required: ['name', 'dosage', 'frequency', 'uncertain'],
      },
    },
    safetyWarnings: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          level: { type: 'STRING' },
        },
      },
    },
    disclaimer: { type: 'STRING' },
  },
  required: ['doctorName', 'medicines'],
};

/**
 * Analyzes a prescription image or document buffer using Gemini Multimodal Vision.
 *
 * @param {Buffer} imageBuffer - Raw image file buffer
 * @param {string} mimeType - Image mime type e.g. 'image/jpeg', 'image/png'
 * @returns {Promise<Object>} - Structured prescription JSON
 */
export async function analyzePrescription(imageBuffer, mimeType = 'image/jpeg') {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check your .env file.');
  }

  const isSvg = mimeType.includes('svg') || imageBuffer.toString('utf-8', 0, 100).includes('<svg');
  const base64Data = imageBuffer.toString('base64');

  let cleanText = null;
  if (isSvg) {
    const rawSvg = imageBuffer.toString('utf-8');
    cleanText = rawSvg.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  let lastError = null;

  // Build multimodal payload or text payload for SVG
  const userParts = isSvg
    ? [
        {
          text: `${SYSTEM_INSTRUCTION}\n\nPlease read and extract doctor name, clinic name, date, patient name, and all prescribed medicines from this prescription document text:\n\n${cleanText}\n\nReturn valid structured JSON matching the schema with every prescribed medicine.`,
        },
      ]
    : [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: `${SYSTEM_INSTRUCTION}\n\nPlease read and extract doctor name, clinic name, date, patient name, and all prescribed medicines from this prescription photo.\n\nReturn valid structured JSON matching the schema with every prescribed medicine.`,
        },
      ];

  // Attempt with primary model, then fallbacks if demand spike (503/404)
  for (const modelName of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: userParts,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.1, // Low temperature for high precision and factual extraction
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error('Gemini returned an empty response.');
      }

      const parsedData = JSON.parse(responseText);

      // Ensure each medicine has a unique client-side id and reasonable defaults
      if (Array.isArray(parsedData.medicines)) {
        parsedData.medicines = parsedData.medicines.map((med, index) => ({
          id: `rx_med_${Date.now()}_${index + 1}`,
          name: med.name || 'Unknown Medicine',
          nameHindi: med.nameHindi || med.name || 'दवा',
          dosage: med.dosage || 'As advised',
          dosageHindi: med.dosageHindi || med.dosage || 'सलाह अनुसार',
          frequency: med.frequency || 'Daily',
          frequencyHindi: med.frequencyHindi || med.frequency || 'प्रतिदिन',
          scheduledTimes:
            med.scheduledTimes && med.scheduledTimes.length > 0
              ? med.scheduledTimes
              : ['08:00 AM'],
          duration: med.duration || '30 days',
          instructions: med.instructions || 'Take as advised with water.',
          instructionsHindi:
            med.instructionsHindi || 'डॉक्टर की सलाह अनुसार पानी से लें।',
          confidence: med.uncertain ? 'uncertain' : 'high',
          uncertain: Boolean(med.uncertain),
          flagReason: med.flagReason || (med.uncertain ? 'Flagged for patient review' : null),
        }));
      }

      parsedData.disclaimer =
        parsedData.disclaimer ||
        'CareLoop AI handwriting extraction is provided for patient assistance and is not a medical diagnosis. Always confirm details against your original physical prescription.';

      return {
        success: true,
        modelUsed: modelName,
        data: parsedData,
      };
    } catch (err) {
      lastError = err;
      console.warn(`[CareLoop Server] Model ${modelName} error: ${err.message}. Trying next fallback if available...`);
    }
  }

  throw new Error(`Failed to analyze prescription with Gemini: ${lastError?.message || 'Unknown error'}`);
}
