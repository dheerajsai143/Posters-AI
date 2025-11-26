import { GoogleGenAI } from "@google/genai";
import { PosterRequest, AspectRatio, PosterType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePosterImage = async (request: PosterRequest): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Construct the prompt based on inputs
  // Override the type string for Anniversary to ensure the model understands it's an anniversary/wedding context
  const occasionText = request.type === PosterType.ANNIVERSARY ? 'Marriage' : request.type;
  let textPrompt = `Create a high-quality, professional poster for a ${occasionText} celebration. `;
  
  if (request.type === PosterType.MOVIE) {
    textPrompt = `Create a high-quality, cinematic movie poster. `;
  }

  // Specific Visuals for Festivals
  if (request.festivalName) {
    textPrompt += `The specific occasion is ${request.festivalName}. Design the background and elements using traditional colors, symbols, lighting, and decorations associated specifically with ${request.festivalName}. `;
  } else if (request.type !== PosterType.MOVIE) {
    textPrompt += `Theme Description: ${request.prompt}. `;
  }

  // Specific Visuals for Marriage Themes
  if (request.marriageTheme) {
    textPrompt += `The specific ceremony or theme is ${request.marriageTheme}. Design the poster using authentic traditional attire patterns, colors, floral decorations, and architectural elements typical of a ${request.marriageTheme}. `;
  }

  // Specific Visuals for Custom Templates
  if (request.customTemplate) {
    textPrompt += `The specific poster template/theme is "${request.customTemplate}". Design the layout, typography, and graphics to perfectly match the standard conventions of a ${request.customTemplate} poster. Use visuals and icons relevant to this theme. `;
  }

  // Specific Visuals for Movie Posters
  if (request.type === PosterType.MOVIE) {
    if (request.movieGenre) {
      textPrompt += `GENRE: ${request.movieGenre}. Design the visual style, lighting, color grading, and composition to perfectly match the tropes of a ${request.movieGenre} film. Make it look like a blockbuster theatrical release. `;
    }
    if (request.movieTemplate) {
      textPrompt += `TEMPLATE STYLE: ${request.movieTemplate}. `;
      if (request.movieTemplate.includes('Coming Soon')) {
        textPrompt += `Focus on mystery and anticipation. Text 'COMING SOON' should be prominent. `;
      } else if (request.movieTemplate.includes('Now Showing')) {
        textPrompt += `Focus on release hype. Text 'NOW SHOWING' or 'IN THEATERS' should be prominent. `;
      } else if (request.movieTemplate.includes('Character Portrait')) {
        textPrompt += `Focus entirely on the character in the uploaded image. Close-up, detailed texture, dramatic rim lighting. `;
      } else if (request.movieTemplate.includes('Minimalist')) {
        textPrompt += `Use negative space, symbolic vector art or high-contrast photography. Less is more. `;
      } else if (request.movieTemplate.includes('Vintage')) {
        textPrompt += `Use a distressed paper texture, 70s/80s typography, and painted art style. `;
      }
    }
  }

  if (request.name) {
    if (request.type === PosterType.BIRTHDAY) {
      textPrompt += `The name "${request.name}" must be the central focal point, written in large, stylish typography that matches the theme. `;
    } else if (request.type === PosterType.CUSTOM) {
      textPrompt += `Include the text "${request.name}" prominently as the main headline or title of the poster. Typography should be bold and professional. `;
    } else if (request.type === PosterType.MOVIE) {
      textPrompt += `The MOVIE TITLE is "${request.name}". Display it prominently at the top or bottom using cinematic, genre-appropriate typography (e.g., bold metallic for Action, spooky for Horror). `;
    } else {
      textPrompt += `Include the name "${request.name}" prominently in the design, using stylish typography that complements the festive theme. `;
    }
  }

  if (request.type === PosterType.ANNIVERSARY && request.husbandName && request.wifeName) {
    textPrompt += `Feature the couple's names centrally and prominently in this format: "${request.husbandName} Weds ${request.wifeName}". The word "Weds" must appear between the two names. `;
    
    // Greeting logic: Customize based on selected theme
    if (request.marriageTheme === 'Marriage Anniversary') {
      textPrompt += `Include the greeting "Happy Marriage Anniversary" in a sophisticated, romantic font (script or serif). `;
    } else if (request.marriageTheme && (request.marriageTheme.includes('Wedding') || request.marriageTheme.includes('Nikah') || request.marriageTheme.includes('Reception'))) {
      textPrompt += `Include the greeting "Shubh Vivah" or "Wedding Celebration" in an elegant font. `;
    } else if (request.marriageTheme) {
      // For specific events like Haldi, Mehendi, etc.
      textPrompt += `Include the title "${request.marriageTheme}" in an elegant font. `;
    }
  }

  if (request.age) {
    textPrompt += `Highlight the number/milestone "${request.age}" prominently and artistically in the design. `;
  }

  if (request.year) {
    if (request.type === PosterType.MOVIE) {
      textPrompt += `Include the year "${request.year}" subtly (e.g., at the bottom or top). `;
    } else {
      textPrompt += `Include the year "${request.year}" in the design, integrated stylishly into the composition. `;
    }
  }

  if (request.movieTagline) {
    textPrompt += `Include the tagline "${request.movieTagline}" in a smaller, complementary font, positioned effectively to support the title. `;
  }
  
  if (request.userImage) {
    if (request.type === PosterType.CUSTOM && request.customTemplate) {
      textPrompt += `IMPORTANT: The FIRST attached image must be integrated as the main subject of this ${request.customTemplate} poster. Ensure it fits the context (e.g., if 'Missing Person', put it in a frame; if 'Movie Poster', make it dramatic). `;
    } else if (request.type === PosterType.MOVIE) {
       textPrompt += `IMPORTANT: The FIRST attached image is the STAR of this movie. Integrate the character into the scene with dramatic lighting, shadows, and color grading that matches the ${request.movieGenre} genre. Do not just paste it; make it look like part of the movie art. `;
    } else {
      textPrompt += `IMPORTANT: The FIRST attached image is the CENTERPIECE of this poster. Integrate the subject (couple/person) seamlessly but keep them prominent and well-lit. Do not cover their faces with text or effects. Blend the edges of their photo artistically into the background. `;
    }
  }

  textPrompt += `Ensure the composition fits a ${request.aspectRatio} aspect ratio. Make it visually stunning. `;

  // Watermark Instruction
  textPrompt += `Include a small, professional watermark text "DS" in the bottom-right corner of the image. `;

  // Strict Text Control
  // We explicitly tell the model exactly what text is allowed to appear to prevent "Happy Birthday" or random words if not requested.
  const allowedStrings = [];
  if (request.name) allowedStrings.push(request.name);
  if (request.age) allowedStrings.push(request.age);
  if (request.year) allowedStrings.push(request.year);
  if (request.festivalName) allowedStrings.push(request.festivalName); // Allow festival name (e.g. "Diwali")
  if (request.husbandName) allowedStrings.push(request.husbandName);
  if (request.wifeName) allowedStrings.push(request.wifeName);
  if (request.customTemplate) allowedStrings.push(request.customTemplate);
  if (request.movieTagline) allowedStrings.push(request.movieTagline);
  
  // Always allow Watermark
  allowedStrings.push("DS");
  
  if (request.type === PosterType.ANNIVERSARY) {
    allowedStrings.push("Weds");
    allowedStrings.push("weds");
    allowedStrings.push("&");
    allowedStrings.push("and");
    allowedStrings.push("+");
    
    // Add specific theme name to allowed text if present
    if (request.marriageTheme) {
      allowedStrings.push(request.marriageTheme);
    }
    
    // Explicitly allow greetings based on selection
    if (request.marriageTheme === 'Marriage Anniversary') {
      allowedStrings.push("Happy Marriage Anniversary");
      allowedStrings.push("Happy Anniversary");
      allowedStrings.push("Anniversary");
    } else {
      allowedStrings.push("Shubh Vivah");
      allowedStrings.push("Wedding Celebration");
    }
  }

  if (request.type === PosterType.MOVIE && request.movieTemplate) {
     if (request.movieTemplate.includes('Coming Soon')) {
       allowedStrings.push("COMING SOON");
       allowedStrings.push("Coming Soon");
     }
     if (request.movieTemplate.includes('Now Showing')) {
       allowedStrings.push("NOW SHOWING");
       allowedStrings.push("IN THEATERS");
     }
  }

  if (allowedStrings.length > 0) {
    textPrompt += `STRICT TEXT RULE: The ONLY text that should appear on the poster are the following strings: [${allowedStrings.join(", ")}]. Do NOT add generic greetings (like 'Greetings', 'Wishes') or other words unless they are listed here. Use a single, consistent, professional font. `;
  } else {
    // This block is effectively unreachable now since "DS" is always allowed, but kept for logic safety
    textPrompt += `STRICT TEXT RULE: Do NOT include any text, letters, or numbers on this poster. Purely visual. `;
  }

  const parts: any[] = [];

  // Helper to get mime type
  const getMimeType = (base64String: string) => {
    const mimeMatch = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    return (mimeMatch && mimeMatch.length > 1) ? mimeMatch[1] : 'image/jpeg';
  };

  // 1. Add User Image (Subject) - MUST BE FIRST based on prompt reference
  if (request.userImage) {
    const base64Data = request.userImage.split(',')[1];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: getMimeType(request.userImage),
      },
    });
  }

  // 3. Add Text Prompt
  parts.push({ text: textPrompt });

  // Map non-standard aspect ratios to closest supported ones for the API config
  let targetAspectRatio = request.aspectRatio;
  
  // Valid API ratios: "1:1", "3:4", "4:3", "9:16", "16:9"
  if (request.aspectRatio === AspectRatio.SIX_FOUR) {
    targetAspectRatio = AspectRatio.FOUR_THIRDS; // Map 6:4 to 4:3 as fallback
  } else if (request.aspectRatio === AspectRatio.FOUR_SIX) {
    targetAspectRatio = AspectRatio.THREE_FOURTHS; // Map 4:6 to 3:4 as fallback
  }

  try {
    // Using gemini-2.5-flash-image for image generation/editing capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio,
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    throw new Error("No image generated by the model. Please try again.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};