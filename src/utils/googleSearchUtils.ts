
import { Reference } from "@/types";

// Get API keys from localStorage if available
const getGoogleApiKey = (): string => {
  return localStorage.getItem('google_api_key') || process.env.GOOGLE_API_KEY || "";
};

const getGoogleCseId = (): string => {
  return localStorage.getItem('google_cse_id') || process.env.GOOGLE_CSE_ID || "";
};

interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchResult[];
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Check if Google Search API is configured
 */
export const isGoogleSearchConfigured = (): boolean => {
  const apiKey = getGoogleApiKey();
  const cseId = getGoogleCseId();
  return Boolean(apiKey && cseId);
};

/**
 * Perform a Google search using the Custom Search JSON API
 * @param query The search query
 * @returns Array of reference objects
 */
export const performGoogleSearch = async (query: string): Promise<Reference[]> => {
  try {
    const apiKey = getGoogleApiKey();
    const cseId = getGoogleCseId();
    
    if (!apiKey || !cseId) {
      console.warn("Google Search API not configured");
      throw new Error("Google Search API not configured");
    }
    
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodedQuery}&num=5`;
    
    console.log("Performing Google search for:", query);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Search API error:", errorData);
      throw new Error(`Google Search API error: ${response.status}`);
    }
    
    const data: GoogleSearchResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log("No search results found");
      return [];
    }
    
    // Map results to reference format
    const references: Reference[] = data.items.map(item => ({
      title: item.title || "Untitled Source",
      url: item.link || "#",
      snippet: item.snippet || "No description available"
    }));
    
    return references;
  } catch (error) {
    console.error("Google search error:", error);
    return [];
  }
};

/**
 * Fallback to existing search method if Google search fails or returns no results
 */
export const performFallbackSearch = async (query: string, fallbackSearchFn: (query: string) => Promise<Reference[]>): Promise<Reference[]> => {
  try {
    // Check if Google Search is configured
    if (!isGoogleSearchConfigured()) {
      console.log("Google Search not configured, using fallback search");
      return await fallbackSearchFn(query);
    }
    
    const googleResults = await performGoogleSearch(query);
    
    if (googleResults.length > 0) {
      return googleResults;
    }
    
    // Fallback to existing search implementation
    console.log("Google search returned no results, falling back to existing search implementation");
    return await fallbackSearchFn(query);
  } catch (error) {
    console.error("Google search failed, using fallback:", error);
    return await fallbackSearchFn(query);
  }
};
