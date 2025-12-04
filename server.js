import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

let ai = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("WARNING: API_KEY is missing from Environment Variables (Secrets).");
}

// 50MB Payload Limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check for Cloud Platforms
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve Static Files
app.use(express.static(path.join(__dirname, 'dist')));

const generateQrCodeBase64 = async (url) => {
  try {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&margin=10`;
    const response = await fetch(qrApiUrl);
    if (!response.ok) throw new Error("Failed to fetch QR code");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    return null;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API Logic
app.post('/api/generate', async (request, response) => {
  if (!apiKey || !ai) {
    return response.status(500).json({ error: 'API Key missing in Secrets.' });
  }

  try {
    let body = request.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
    }
    
    const posterRequest = body?.request;
    if (!posterRequest) {
        return response.status(400).json({ error: 'Invalid request body' });
    }
    
    // --- PROMPT CONSTRUCTION ---
    const occasionText = posterRequest.type === 'Marriage' ? 'Marriage' : posterRequest.type;
    let textPrompt = `Create a high-quality, professional poster for a ${occasionText} celebration. `;
    if (posterRequest.type === 'Movie') textPrompt = `Create a high-quality, cinematic movie poster. `;
  
    if (posterRequest.festivalName) textPrompt += `Occasion: ${posterRequest.festivalName}. Text: "Happy ${posterRequest.festivalName}". `;
    else if (posterRequest.type !== 'Movie') textPrompt += `Theme: ${posterRequest.prompt}. `;
  
    if (posterRequest.marriageTheme) textPrompt += `Theme: ${posterRequest.marriageTheme}. `;
    if (posterRequest.customTemplate) textPrompt += `Template: "${posterRequest.customTemplate}". `;
    if (posterRequest.type === 'Movie') {
      if (posterRequest.movieGenre) textPrompt += `GENRE: ${posterRequest.movieGenre}. `;
      if (posterRequest.movieTemplate) textPrompt += `STYLE: ${posterRequest.movieTemplate}. `;
    }
    if (posterRequest.type === 'Birthday') textPrompt += `Include "Happy Birthday". `;
    if (posterRequest.name) textPrompt += `Feature name "${posterRequest.name}". `;
    if (posterRequest.type === 'Marriage' && posterRequest.husbandName && posterRequest.wifeName) {
      textPrompt += `Names: "${posterRequest.husbandName} Weds ${posterRequest.wifeName}". `;
      if (posterRequest.marriageTheme === 'Marriage Anniversary') textPrompt += `Text: "Happy Anniversary". `;
      else textPrompt += `Text: "Shubh Vivah". `;
    }
    if (posterRequest.age) textPrompt += `Number "${posterRequest.age}". `;
    if (posterRequest.customDate) textPrompt += `Date "${posterRequest.customDate}". `;
    if (posterRequest.year) textPrompt += `Year "${posterRequest.year}". `;
    if (posterRequest.movieTagline) textPrompt += `Tagline "${posterRequest.movieTagline}". `;
    if (posterRequest.fontStyle) textPrompt += `Font "${posterRequest.fontStyle}". `;
    if (posterRequest.userImage) textPrompt += `Integrate FIRST attached image as MAIN SUBJECT. `;
    textPrompt += `Aspect Ratio: ${posterRequest.aspectRatio}. Watermark "DS". `;

    const parts = [];
    if (posterRequest.userImage) {
        const base64Data = posterRequest.userImage.split(',')[1];
        const mimeMatch = posterRequest.userImage.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        const mimeType = (mimeMatch && mimeMatch.length > 1) ? mimeMatch[1] : 'image/jpeg';
        parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
    }

    if (posterRequest.qrCodeUrl) {
        const qrBase64 = await generateQrCodeBase64(posterRequest.qrCodeUrl);
        if (qrBase64) {
            parts.push({ inlineData: { data: qrBase64.split(',')[1], mimeType: 'image/png' } });
            textPrompt += `Include the SECOND image (QR Code) in a corner. `;
        }
    }

    parts.push({ text: textPrompt });

    let targetAspectRatio = posterRequest.aspectRatio;
    if (posterRequest.aspectRatio === '6:4') targetAspectRatio = '4:3';
    if (posterRequest.aspectRatio === '4:6') targetAspectRatio = '3:4';

    // Retry Logic
    const MAX_RETRIES = 3;
    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const responseGen = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: parts },
                config: {
                    imageConfig: { aspectRatio: targetAspectRatio },
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    ],
                }
            });

            const candidate = responseGen.candidates?.[0];
            if (!candidate) throw new Error("Empty response from AI");
            if (candidate.finishReason === "SAFETY") throw new Error("Safety Block: Image blocked due to content filters.");

            for (const part of candidate.content?.parts || []) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    return response.status(200).json({ image: `data:image/png;base64,${base64EncodeString}` });
                }
            }
            throw new Error("No image data found");
        } catch(err) {
            lastError = err;
            if (err.status === 429 || (err.message && (err.message.includes('429') || err.message.includes('Quota')))) {
                if (attempt < MAX_RETRIES) {
                    const waitTime = Math.pow(2, attempt) * 2000; 
                    await sleep(waitTime);
                    continue; 
                }
            }
            if (err.message && err.message.includes("Safety")) break;
        }
    }

    if (lastError && (lastError.status === 429 || (lastError.message && (lastError.message.includes('429') || lastError.message.includes('Quota'))))) {
         return response.status(429).json({ error: 'Quota exceeded. Please wait ~1 minute.' });
    }
    return response.status(500).json({ error: lastError ? lastError.message : "Unknown error" });
  } catch (error) {
    console.error("Replit API Error:", error.message);
    return response.status(500).json({ error: error.message });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Bind to 0.0.0.0 is crucial for Replit/Render
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});