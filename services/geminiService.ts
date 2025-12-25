
import { GoogleGenAI } from "@google/genai";
import type { PosterData } from '../types';
import { LANGUAGES } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// Custom error for API key issues
export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

const createPrompt = (data: PosterData): string => {
    let languageInstruction = '';
    if (data.language && data.language !== 'English') {
        const langInfo = LANGUAGES.find(lang => lang.code === data.language);
        const nativeName = langInfo ? langInfo.nativeName : data.language;
        languageInstruction = `
**PRIMARY GOAL: Create a poster entirely in the ${data.language} language using its native script (${nativeName}).**
This is the most important instruction.
- **Rule 1: Translate All Text.** All English text provided in the user's request below MUST be translated into ${data.language}.
- **Rule 2: Use Native Script Only.** The final poster must contain ONLY ${data.language} text in its native script.
- **Rule 3: Absolutely No English.** Do not use any English words or transliterations (e.g., writing Telugu words with English letters). For example, "Happy Birthday" must be translated to "పుట్టినరోజు శుభాకాంక్షలు", not written as "Puttinroju Subhakankshalu".
- **Rule 4: Apply this to all details:** names, messages, dates, venues, etc.

Now, follow these instructions to create the poster content:
---
`;
    }

    let basePrompt = `Create a high-quality, visually appealing poster for a '${data.category}' event using the provided image.`;

    if (data.category === 'Birthday') {
        if (data.birthdayType === 'Advance') {
            basePrompt = `Create a high-quality, advance birthday poster for an upcoming birthday celebration`;
        } else {
            basePrompt = `Create a high-quality, birthday poster`;
        }
        if (data.name) basePrompt += ` for '${data.name}'`;
        if (data.age) basePrompt += `, who is turning ${data.age}`;
        basePrompt += `, using the provided image.`;
        if (data.date) basePrompt += ` The date of the event is '${data.date}'.`;
        if (data.birthdayMessage) basePrompt += ` Please include this custom birthday wish on the poster: "${data.birthdayMessage}".`;
    } else if (data.category === 'Festival') {
        const festivalName = data.festivalType === 'Other' ? data.festivalName : data.festivalType;
        if (!festivalName) {
            basePrompt = `Create a high-quality, festival poster using the provided image.`;
        } else {
            basePrompt = `Create a high-quality, '${festivalName}' festival poster using the provided image.`;
        }
        if (data.name) basePrompt += ` The poster can be personalized with the name '${data.name}'.`;
        if (data.theme) basePrompt += ` The theme or keywords for the poster are: '${data.theme}'.`;
        if (data.date) basePrompt += ` The date of the event is '${data.date}'.`;
    } else if (data.category === 'Wedding') {
        let stylePrompt = '';
        switch (data.weddingStyle) {
            case 'Traditional Indian':
                stylePrompt = 'The style should be vibrant, ornate, and culturally rich, suitable for a traditional Indian wedding.';
                break;
            case 'Modern Minimalist':
                stylePrompt = 'The style should be modern, clean, elegant, and minimalist.';
                break;
            case 'Christian Wedding':
                stylePrompt = 'The style should be classic, graceful, and sophisticated, suitable for a Christian wedding ceremony.';
                break;
            case 'Custom Style':
                stylePrompt = 'The user will describe the custom style in the theme/keywords section.';
                break;
            default:
                stylePrompt = 'The style should be romantic and sophisticated.';
        }

        if (data.weddingType && data.weddingType !== 'Custom') {
             basePrompt = `Create a beautiful and elegant '${data.weddingType}' poster`;
        } else if (data.weddingType === 'Custom') {
             basePrompt = `Create a beautiful and elegant custom wedding-themed poster`;
        } else {
             basePrompt = `Create a beautiful and elegant wedding poster`;
        }
        
        if (data.name) basePrompt += ` for '${data.name}'`;
        basePrompt += `, using the provided image.`;
        if (data.date) {
            const date = new Date(data.date);
            // Adjust for timezone offset to prevent date from being off by one day
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() + timezoneOffset);
            basePrompt += ` The event date is '${adjustedDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}'.`;
        }
        if (data.venue) basePrompt += ` The venue for the event is '${data.venue}'.`;
        if (data.invitedBy) basePrompt += ` The invitation is from '${data.invitedBy}'.`;
        if (data.weddingWish) basePrompt += ` Please include this wish on the poster: "${data.weddingWish}".`;

        if (data.theme) {
            if (data.weddingType === 'Custom' || data.weddingStyle === 'Custom Style') {
                basePrompt += ` The specific details for this custom poster are: '${data.theme}'.`;
            } else {
                basePrompt += ` Additional details, theme, or custom text: '${data.theme}'.`;
            }
        }
        basePrompt += ` ${stylePrompt}`;
    } else if (data.category === 'Custom') {
        if (data.theme) {
            basePrompt = `Create a high-quality, visually appealing poster based on the following description: "${data.theme}". The poster must incorporate and enhance the provided image seamlessly into the design.`;
        } else {
            basePrompt = `Create a high-quality, visually appealing and creative poster using the provided image.`;
        }
    }

    let finalInstructions = ` The design should be modern, professional, and suitable for the occasion. Incorporate and enhance the provided image seamlessly into the poster design. If it contains a person, you can optionally remove the background for a cleaner look. The final output should be a complete poster, not just an image with some text.

**Final Logo Requirement:** You MUST place a small, discreet, and stylish 'DS' logo in the bottom-right corner of the poster. The logo should blend elegantly with the poster's design and should not be obtrusive.`;

    return languageInstruction + basePrompt + finalInstructions;
}

const getSupportedAspectRatio = (ratio: PosterData['ratio']): '1:1' | '16:9' | '9:16' | '3:4' | '4:3' => {
  const supportedRatios: PosterData['ratio'][] = ['1:1', '16:9', '9:16', '3:4', '4:3'];
  if ((supportedRatios as string[]).includes(ratio)) {
    return ratio as '1:1' | '16:9' | '9:16' | '3:4' | '4:3';
  }
  // Map new ratios to the closest supported one. Both 4:5 and A4 are portrait ratios.
  // The API-supported 3:4 is the closest match.
  return '3:4';
};


export const generatePoster = async (data: PosterData): Promise<string> => {
  if (!data.image) {
    throw new Error("Please upload an image to generate a poster.");
  }
  
  // FIX: Instantiate GoogleGenAI client here to use the latest API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';
  
  const fullPrompt = createPrompt(data);

  const contents = {
    parts: [
      fileToGenerativePart(data.image.base64, data.image.mimeType),
      { text: fullPrompt }
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        imageConfig: {
          aspectRatio: getSupportedAspectRatio(data.ratio),
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64String}`;
      }
    }
    throw new Error("No image was generated by the API.");
  } catch (error) {
    console.error("Error generating poster:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || error.message.includes("Requested entity was not found")) {
            throw new ApiKeyError('Your API key seems to be invalid. Please select a valid key.');
        }
        throw new Error(`Failed to generate poster: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the poster.");
  }
};