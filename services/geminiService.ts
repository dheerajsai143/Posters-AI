import { PosterRequest } from "../types";

export const generatePosterImage = async (request: PosterRequest): Promise<string> => {
  try {
    const response = await fetch('/api/generate?t=' + Date.now(), { // Cache-bust
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request }),
    });

    const responseText = await response.text();
    
    // Handle Empty Response (common with timeouts)
    if (!responseText || responseText.trim().length === 0) {
        if (response.status === 504) throw new Error("Server timed out (504). The image might be too large or the server is busy.");
        throw new Error("Server returned an empty response. Please try again.");
    }

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        console.error("Non-JSON response received:", responseText);
        // Fallback checks for common HTML errors
        if (response.status === 413) throw new Error("Image too large (413). Please upload a smaller photo.");
        if (response.status === 504) throw new Error("Request timed out (504).");
        if (response.status === 500) throw new Error("Internal Server Error (500).");
        if (response.status === 429) throw new Error("⚠️ High Traffic: AI usage limit reached. Please wait ~1 minute.");
        throw new Error(`Connection failed (${response.status}). The server returned unexpected text instead of JSON.`);
    }

    if (!response.ok) {
        // Explicitly handle 429 Quota Exceeded
        if (response.status === 429 || (data.error && (data.error.includes('429') || data.error.includes('Quota')))) {
             throw new Error("⚠️ High Traffic: Google's AI usage limit reached. Please wait ~1 minute and try again.");
        }
        throw new Error(data.error || `Server Error: ${response.statusText}`);
    }

    if (!data.image) {
        throw new Error("Server returned success but no image data.");
    }

    return data.image;

  } catch (error: any) {
    console.error("Poster Generation Error:", error);
    if (error.message && error.message.includes("Safety Block")) {
      throw new Error("The AI blocked the generation due to safety concerns. Please try a different photo or description.");
    }
    throw error;
  }
};