import { Reference } from "@/types";
import { performWebSearch } from "./searchUtils";

/**
 * Performs a Google search using the Google Custom Search API
 * @param query The search query
 * @returns Array of references with title, link, and snippet
 */
export const performGoogleSearch = async (query: string): Promise<Reference[]> => {
  try {
    // Validate input
    if (!query || typeof query !== 'string') {
      console.error("Invalid query provided to Google search");
      return [];
    }
    
    // Get API key and search engine ID from environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      console.warn("Google API key or Search Engine ID not configured");
      return [];
    }
    
    // Construct the API URL
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
    
    console.log("Performing Google search for:", query);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Search API error:", errorData);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      console.log("No search results found");
      return [];
    }
    
    // Map the results to the Reference format
    const references: Reference[] = data.items.map((item: any) => ({
      title: item.title || "No title",
      link: item.link || "",
      url: item.link || "",
      snippet: item.snippet || "No description available"
    }));
    
    console.log(`Found ${references.length} Google search results`);
    return references;
  } catch (error) {
    console.error("Error in Google search:", error);
    return [];
  }
};

/**
 * Performs a fallback search if the primary search method fails
 * @param query The search query
 * @param primarySearchFunction The primary search function to use
 * @returns Array of references with title, link, and snippet
 */
export const performFallbackSearch = async (
  query: string, 
  primarySearchFunction: (query: string) => Promise<Reference[]>
): Promise<Reference[]> => {
  try {
    // Try the primary search function first
    const primaryResults = await primarySearchFunction(query);
    
    if (primaryResults && primaryResults.length > 0) {
      return primaryResults;
    }
    
    // If no results, fallback to Google search
    console.log("Primary search returned no results, falling back to Google search");
    const googleResults = await performGoogleSearch(query);
    
    if (googleResults && googleResults.length > 0) {
      return googleResults;
    }
    
    // If still no results, attempt a more general search
    if (query.length > 10) {
      const simplifiedQuery = query
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 5)
        .join(' ');
      
      console.log("Attempting simplified search with query:", simplifiedQuery);
      
      const fallbackResults = await performGoogleSearch(simplifiedQuery);
      
      if (fallbackResults && fallbackResults.length > 0) {
        return fallbackResults.map(result => ({
          ...result,
          // Mark this as a fallback search result
          title: `[Broader Result] ${result.title}`,
          link: result.link || result.url,
        }));
      }
    }
    
    console.log("All search attempts failed for query:", query);
    return [];
  } catch (error) {
    console.error("Error in fallback search:", error);
    return [];
  }
};

/**
 * Extracts links from a message and converts them to Reference objects
 * @param message The message text to extract links from
 * @returns Promise<Reference[]> Array of extracted reference objects
 */
export const extractLinksFromMessage = async (message: string): Promise<Reference[]> => {
  try {
    // Regular expression to match URLs in text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = message.match(urlRegex);
    
    if (!matches) return [];
    
    const links: Reference[] = matches.map(url => ({
      title: "Referenced Link",
      link: url,
      url: url,
      snippet: `Link referenced in the response: ${url}`
    }));
    
    return links;
  } catch (error) {
    console.error("Error extracting links:", error);
    return [];
  }
};

/**
 * Combines links from the message with search results, removing duplicates
 * @param extractedLinks Links extracted from the message
 * @param searchResults Results from the search function
 * @returns Reference[] Combined array of unique references
 */
export const combineLinksAndSearchResults = (
  extractedLinks: Reference[],
  searchResults: Reference[]
): Reference[] => {
  // Create a combined array of references
  const combined = [...extractedLinks, ...searchResults];
  
  // Filter out duplicates based on URL
  const uniqueUrls = new Set();
  const unique = combined.filter(ref => {
    const url = ref.link || ref.url;
    if (uniqueUrls.has(url)) return false;
    uniqueUrls.add(url);
    return true;
  });
  
  return unique;
};
