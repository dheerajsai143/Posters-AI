import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const apiKey = process.env.API_KEY;

let ai = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

// Helper to fetch and convert QR code to base64
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

// Sleep function for retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(request, response) {
  // CORS
  const origin = request.headers.origin;
  if (origin) {
      response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!apiKey || !ai) {
    return response.status(500).json({ error: 'Server configuration error: API Key missing.' });
  }

  try {
    let body = request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            console.error("Failed to parse body", e);
        }
    }
    
    const posterRequest = body?.request;
    if (!posterRequest) {
        return response.status(400).json({ error: 'Invalid request body' });
    }
    
    // --- PROMPT LOGIC ---
    const occasionText = posterRequest.type === 'Marriage' ? 'Marriage' : posterRequest.type;
    let textPrompt = `Create a high-quality, professional poster for a ${occasionText} celebration. `;
    
    if (posterRequest.type === 'Movie') textPrompt = `Create a high-quality, cinematic movie poster. `;
  
    if (posterRequest.festivalName) {
      textPrompt += `Occasion: ${posterRequest.festivalName}. Use traditional elements. Text: "Happy ${posterRequest.festivalName}". `;
    } else if (posterRequest.type !== 'Movie') {
      textPrompt += `Theme: ${posterRequest.prompt}. `;
    }
  
    if (posterRequest.marriageTheme) textPrompt += `Theme: ${posterRequest.marriageTheme}. Authentic traditional elements. `;
    if (posterRequest.customTemplate) textPrompt += `Template: "${posterRequest.customTemplate}". `;
  
    if (posterRequest.type === 'Movie') {
      if (posterRequest.movieGenre) textPrompt += `GENRE: ${posterRequest.movieGenre}. `;
      if (posterRequest.movieTemplate) textPrompt += `STYLE: ${posterRequest.movieTemplate}. `;
    }
  
    if (posterRequest.type === 'Birthday') textPrompt += `Include "Happy Birthday". `;
    if (posterRequest.name) textPrompt += `Feature name "${posterRequest.name}" prominently. `;
  
    if (posterRequest.type === 'Marriage' && posterRequest.husbandName && posterRequest.wifeName) {
      textPrompt += `Feature names: "${posterRequest.husbandName} Weds ${posterRequest.wifeName}". `;
      if (posterRequest.marriageTheme === 'Marriage Anniversary') textPrompt += `Text: "Happy Marriage Anniversary". `;
      else textPrompt += `Text: "Shubh Vivah". `;
    }
  
    if (posterRequest.age) textPrompt += `Highlight number "${posterRequest.age}". `;
    if (posterRequest.customDate) textPrompt += `Include date "${posterRequest.customDate}". `;
    if (posterRequest.year) textPrompt += `Include year "${posterRequest.year}". `;
    if (posterRequest.movieTagline) textPrompt += `Include tagline "${posterRequest.movieTagline}". `;
    if (posterRequest.fontStyle) textPrompt += `Use "${posterRequest.fontStyle}" font. `;
    
    if (posterRequest.userImage) {
        textPrompt += `IMPORTANT: The FIRST attached image is the MAIN SUBJECT. Integrate it seamlessly. Do not cover faces. `;
    }
  
    textPrompt += `Aspect Ratio: ${posterRequest.aspectRatio}. Watermark "DS" bottom-right. `;

    // Prepare Parts
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
            textPrompt += `Include the SECOND image (QR Code) in a corner clearly. `;
        }
    }

    parts.push({ text: textPrompt });

    let targetAspectRatio = posterRequest.aspectRatio;
    if (posterRequest.aspectRatio === '6:4') targetAspectRatio = '4:3';
    if (posterRequest.aspectRatio === '4:6') targetAspectRatio = '3:4';

    // --- RETRY LOGIC FOR 429 ---
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
            throw new Error("No image data found in response");

        } catch (err) {
            lastError = err;
            // Check for Quota/Rate Limit errors (429)
            if (err.status === 429 || (err.message && (err.message.includes('429') || err.message.includes('Quota')))) {
                if (attempt < MAX_RETRIES) {
                    const waitTime = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
                    console.warn(`Quota hit (Attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${waitTime}ms...`);
                    await sleep(waitTime);
                    continue; // Retry loop
                }
            }
            // If it's a safety block or other error, break immediately
            if (err.message && err.message.includes("Safety")) break;
        }
    }

    // If we exit the loop, we failed
    console.error("AI Generation Failed after retries:", lastError);
    if (lastError.status === 429 || (lastError.message && (lastError.message.includes('429') || lastError.message.includes('Quota')))) {
         return response.status(429).json({ error: 'Server busy (Quota Exceeded). Please wait 1 minute and try again.' });
    }
    return response.status(500).json({ error: lastError.message || "Failed to generate image" });

  } catch (error) {
    console.error("API Handler Error:", error.message);
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}