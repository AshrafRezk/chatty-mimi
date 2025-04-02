
import { Message, Persona } from "@/types";

// API constants (hidden from user)
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

// Helper to get persona specific context
const getPersonaContext = (persona: Persona): string => {
  switch (persona) {
    case 'software':
      return "You are a software development expert. Provide technical, accurate and detailed answers about programming, architecture, design patterns, and development best practices.";
    case 'medicine':
      return "You are a healthcare expert. Provide accurate medical information with appropriate disclaimers. Remember you are not providing medical advice, but information. Always recommend consulting with healthcare professionals for specific concerns.";
    case 'architecture':
      return "You are an architecture and design expert. Provide detailed information about architectural principles, design concepts, materials, historical contexts, and sustainable approaches.";
    case 'project_management':
      return "You are a project management expert. Provide structured approaches to project planning, execution, monitoring, and methodologies like Agile, Waterfall, etc.";
    case 'finance':
      return "You are a finance expert. Provide information about financial concepts, investment strategies, market analysis, and economic principles. Always clarify that you're not providing financial advice.";
    case 'education':
      return "You are an education expert. Provide information about learning methodologies, educational theories, curriculum development, and teaching strategies for different age groups and abilities.";
    case 'legal':
      return "You are a legal information specialist. Provide general information about laws, regulations, and legal concepts. Always clarify that you're not providing legal advice and recommend consulting with lawyers for specific situations.";
    case 'general':
    default:
      return "You are a helpful AI assistant with wide-ranging knowledge. Provide clear, factual information on a variety of topics.";
  }
};

/**
 * Generate a response from the Mimi AI service
 * Note: Internally uses Gemini API but this is not exposed to the user
 */
export const generateGeminiResponse = async (
  userMessage: string, 
  previousMessages: Message[],
  language: string,
  mood: string,
  userLocation: string | null,
  persona: Persona = 'general'
): Promise<string> => {
  try {
    // Extract context from previous messages (limited to last 5 for brevity)
    const recentMessages = previousMessages.slice(-5);
    const chatHistory = recentMessages
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
    
    // Get persona-specific context
    const personaContext = getPersonaContext(persona);
    
    // Create a contextualized prompt with useful information
    const contextualizedPrompt = `
${personaContext}

You are having a conversation in ${language} language.
Current mood setting: ${mood}
${userLocation ? `User location: ${userLocation}` : ''}
${chatHistory ? `\nRecent conversation history:\n${chatHistory}` : ''}

You are Mimi, a privacy-focused AI that adheres to strict data security and compliance standards including HIPAA. You never cross-share user data or personal information. User conversations are private and not used to train other models.

When responding:
1. Enhance the user's query when needed to provide more comprehensive information
2. Present multiple options or perspectives when appropriate
3. For factual queries, cite sources that would be reliable (although in this prototype references are simulated)
4. Use a ${mood} tone in your response
5. Keep answers helpful and concise
6. Never mention that you're using any specific underlying AI service or API

Based on this context, respond to: "${userMessage}"
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
      console.error("API error:", errorData);
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

    throw new Error("No valid response from AI service");
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I couldn't process your request at the moment. Please try again.";
  }
};
