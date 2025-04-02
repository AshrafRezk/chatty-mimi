
import { Message } from "@/types";

// Gemini API constants
const GEMINI_API_KEY = "AIzaSyCYjG-f26Vg3t57PY0_KznRXDZF-9ljcWs";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GeminiRequestContent {
  parts: {
    text: string;
  }[];
}

interface GeminiRequest {
  contents: GeminiRequestContent[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

/**
 * Generate a response from the Gemini API
 */
export const generateGeminiResponse = async (
  userMessage: string, 
  previousMessages: Message[],
  language: string,
  mood: string,
  userLocation: string | null
): Promise<string> => {
  try {
    // Extract context from previous messages (limited to last 5 for brevity)
    const recentMessages = previousMessages.slice(-5);
    const chatHistory = recentMessages
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
    
    // Create a contextualized prompt with useful information
    const contextualizedPrompt = `
You are an AI assistant having a conversation in ${language} language.
Current mood setting: ${mood}
${userLocation ? `User location: ${userLocation}` : ''}
${chatHistory ? `\nRecent conversation history:\n${chatHistory}` : ''}

Based on this context, respond to: "${userMessage}"

Maintain a ${mood} tone in your response. Keep your answer concise and helpful.
`;

    // Prepare the request
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [{ text: contextualizedPrompt }]
        }
      ]
    };

    // Make the API call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for content blocking
    if (data.promptFeedback?.blockReason) {
      console.warn("Prompt was blocked:", data.promptFeedback.blockReason);
      return "I'm sorry, but I cannot respond to that query. Let's talk about something else.";
    }

    // Extract and return the response text
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error("No valid response from Gemini API");
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "I'm sorry, I couldn't process your request at the moment. Please try again.";
  }
};
