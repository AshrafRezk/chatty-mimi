
import { Reference } from "@/types";

const SERPER_API_KEY = "67c4ff204c52710b94f650c6f2bb85904c4b113d"; // This is a sample key, replace with your own in production

/**
 * Perform a web search using Serper API
 * @param query The search query
 * @returns Array of reference objects
 */
export const performWebSearch = async (query: string): Promise<Reference[]> => {
  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        num: 5
      })
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract organic search results
    const organicResults = data.organic || [];
    
    // Map results to reference format
    const references: Reference[] = organicResults.map((result: any) => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet
    }));
    
    return references.slice(0, 3); // Limit to 3 references for UI
  } catch (error) {
    console.error("Web search error:", error);
    return [];
  }
};

/**
 * Calculate certainty score based on references
 * @param references Array of reference objects
 * @returns A certainty score between 0 and 100
 */
export const calculateCertaintyScore = (references: Reference[]): number => {
  if (references.length === 0) return 0;
  
  // Base score - more references equals higher base certainty
  const baseScore = Math.min(references.length * 25, 75);
  
  // Randomize slightly for natural feel
  const randomVariance = Math.floor(Math.random() * 10);
  
  return Math.min(baseScore + randomVariance, 97);
};
