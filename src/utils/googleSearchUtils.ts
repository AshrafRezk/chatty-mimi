import { Reference } from "@/types";

// Default API keys for Google Search
const DEFAULT_GOOGLE_API_KEY = "AIzaSyAVlJ8upjkeQdnXynHLFtLX8vXM39Q2CRE";
const DEFAULT_GOOGLE_CSE_ID = "e0f89b879ec0547bf";

// Get API keys from localStorage if available, otherwise use defaults
const getGoogleApiKey = (): string => {
  return localStorage.getItem('google_api_key') || DEFAULT_GOOGLE_API_KEY;
};

const getGoogleCseId = (): string => {
  return localStorage.getItem('google_cse_id') || DEFAULT_GOOGLE_CSE_ID;
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
 * Extract URLs from message text and convert them to reference format
 * @param text The message text to extract URLs from
 * @returns Array of reference objects
 */
export const extractLinksFromMessage = async (text: string): Promise<Reference[]> => {
  // Match URLs in the text
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  
  if (!matches || matches.length === 0) return [];
  
  const references: Reference[] = [];
  
  // Process each URL
  for (const url of matches) {
    try {
      // Clean the URL (remove trailing punctuation, etc.)
      let cleanUrl = url;
      if (cleanUrl.endsWith('.') || cleanUrl.endsWith(',') || 
          cleanUrl.endsWith(')') || cleanUrl.endsWith(']') || 
          cleanUrl.endsWith('"') || cleanUrl.endsWith("'")) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      
      const urlObj = new URL(cleanUrl);
      const domain = urlObj.hostname;
      
      // Create a more descriptive reference
      references.push({
        title: domain.replace(/^www\./, ''), // Remove 'www.' prefix for cleaner display
        url: cleanUrl,
        snippet: `Link referenced from ${domain}`
      });
      
      // Attempt to fetch metadata in the background to enhance reference details
      // This is done asynchronously to not block the UI
      fetch(`https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.data && data.data.title) {
            // Find and update the reference with metadata
            const index = references.findIndex(ref => ref.url === cleanUrl);
            if (index !== -1) {
              references[index].title = data.data.title;
              if (data.data.description) {
                references[index].snippet = data.data.description;
              }
            }
          }
        })
        .catch(() => {
          // If metadata fetch fails, keep the original reference
          console.log("Failed to fetch metadata for:", cleanUrl);
        });
      
    } catch (error) {
      console.warn("Error processing URL:", error);
      // Still add the URL even if we couldn't parse it properly
      try {
        references.push({
          title: new URL(url).hostname,
          url: url,
          snippet: "Link referenced in conversation"
        });
      } catch (e) {
        // If URL parsing fails, just skip this one
      }
    }
  }
  
  return references;
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

/**
 * Combine manually extracted links with search results
 */
export const combineLinksAndSearchResults = (links: Reference[], searchResults: Reference[]): Reference[] => {
  // Create a map of URLs to prevent duplicates
  const uniqueReferences = new Map<string, Reference>();
  
  // Add links first (they were explicitly mentioned in the message)
  for (const link of links) {
    uniqueReferences.set(link.url, link);
  }
  
  // Then add search results if they don't duplicate links
  for (const result of searchResults) {
    if (!uniqueReferences.has(result.url)) {
      uniqueReferences.set(result.url, result);
    }
  }
  
  // Return as array
  return Array.from(uniqueReferences.values());
};

export const formatSearchResults = (result: any): Reference[] => {
  if (!result || !result.organic) {
    return [];
  }
  
  return result.organic.map((item: any) => {
    return {
      title: item.title,
      link: item.url, // Changed url to link to match the Reference type
      url: item.url,  // Keep url for backward compatibility
      snippet: item.snippet
    };
  });
};

export const processGoogleSearchResult = (data: any) => {
  const references = data.organic.map((item: any) => ({
    title: item.title,
    link: item.link || item.url, // Ensure link is set correctly
    url: item.url, // Keep for backward compatibility
    snippet: item.snippet,
  }));
  
  return references;
};
