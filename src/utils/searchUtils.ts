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
        num: 7,  // Increased from 5 to get more results
        gl: "us", // Set to US for more comprehensive results
        hl: "en"  // Set language to English
      })
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract organic search results
    const organicResults = data.organic || [];
    
    // Map results to reference format with more detailed snippets
    const references: Reference[] = organicResults.map((result: any) => ({
      title: result.title || "Untitled Source",
      url: result.link || "#",
      snippet: result.snippet || (result.description || "No description available")
    }));
    
    // Add knowledge graph results if available
    if (data.knowledgeGraph) {
      const kg = data.knowledgeGraph;
      if (kg.title && kg.description) {
        references.push({
          title: kg.title,
          url: kg.url || "#",
          snippet: kg.description
        });
      }
    }
    
    return references.slice(0, 5); // Return top 5 references
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
  const baseScore = Math.min(references.length * 20, 70);
  
  // Add bonus for high-quality references (estimated by snippet length)
  const qualityBonus = references.reduce((score, ref) => {
    // Longer snippets might indicate more detailed information
    return score + Math.min(ref.snippet.length / 100, 5);
  }, 0);
  
  // Randomize slightly for natural feel (smaller range now)
  const randomVariance = Math.floor(Math.random() * 5);
  
  return Math.min(Math.round(baseScore + qualityBonus + randomVariance), 98);
};

/**
 * Process search results and return them in reference format
 * @param data The search results data
 * @returns Array of reference objects
 */
export const processSearchResults = (data: any): Reference[] => {
  if (!data || !data.organic) {
    return [];
  }
  
  return data.organic.map((item: any) => ({
    title: item.title,
    link: item.url, // Changed url to link to match the Reference type
    url: item.url,  // Keep url for backward compatibility
    snippet: item.snippet
  }));
};
