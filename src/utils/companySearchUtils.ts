
import { CompanySearchResult, LeadStakeholder, ScoutedCompany } from '@/types/leadGenAI';
import { performWebSearch } from "./searchUtils";

// SerpAPI key for fallback
const SERP_API_KEY = "263cc5c809e5caa1936eb9c857a4c67a5db533ffaf8e7831aa1fe8465cedc60c";

/**
 * Search for companies using Google Search API with existing integration
 * @param query Company name to search for
 * @returns Promise<CompanySearchResult[]> Array of company matches
 */
export const searchCompanies = async (query: string): Promise<CompanySearchResult[]> => {
  try {
    if (query.length < 3) return [];
    
    // Use existing Google Search integration
    const searchQuery = `"official site" ${query} company`;
    const searchResults = await performWebSearch(searchQuery);
    
    // Extract company information from search results
    const companies: CompanySearchResult[] = searchResults
      .slice(0, 5)
      .map(result => {
        // Extract domain from URL
        let website = result.url || "";
        try {
          const url = new URL(website);
          website = url.hostname;
        } catch (e) {
          // Invalid URL, keep as is
        }
        
        return {
          name: result.title?.replace(/\s*\|\s*.*$|\s*-\s*.*$/, "") || query,
          website,
          favicon: website ? `https://www.google.com/s2/favicons?domain=${website}` : undefined
        };
      })
      .filter(company => company.website);
      
    return companies;
  } catch (error) {
    console.error("Error searching companies:", error);
    return [];
  }
};

/**
 * Scout for potential leads based on provider company and services
 * @param providerCompany Your company name
 * @param providerServices Your services
 * @param targetIndustry Target industry to scout
 * @returns Promise<ScoutedCompany[]> Array of potential leads
 */
export const scoutForLeads = async (
  providerCompany: string,
  providerServices: string,
  targetIndustry: string
): Promise<ScoutedCompany[]> => {
  try {
    // Create search queries to find potential leads
    const queries = [
      `${targetIndustry} companies looking for "${providerServices}"`,
      `${targetIndustry} companies hiring for roles related to "${providerServices}"`,
      `${targetIndustry} companies "actively seeking" "${providerServices}" vendors`,
      `${targetIndustry} startups that need "${providerServices}"`
    ];
    
    const allResults: any[] = [];
    const uniqueCompanies = new Map();
    
    // Search for potential leads using each query
    for (const query of queries) {
      const results = await performWebSearch(query);
      allResults.push(...results);
      
      // Process results to extract company names
      for (const result of results) {
        // Extract company name from title or URL
        let companyName = extractCompanyNameFromResult(result);
        if (!companyName || companyName.length < 3) continue;
        
        // Skip if we already have this company
        if (uniqueCompanies.has(companyName.toLowerCase())) continue;
        
        // Get company website from search result
        let website = result.url || "";
        try {
          const url = new URL(website);
          website = url.hostname;
        } catch (e) {
          continue; // Skip invalid URLs
        }
        
        // Calculate match score based on keyword relevance
        const matchScore = calculateMatchScore(result, providerServices);
        
        // Skip low-relevance results
        if (matchScore < 4) continue;
        
        uniqueCompanies.set(companyName.toLowerCase(), {
          name: companyName,
          website,
          description: result.snippet || "",
          matchScore,
          contacts: [] // Will be populated later
        });
      }
    }
    
    // Convert map to array
    const companies: ScoutedCompany[] = Array.from(uniqueCompanies.values());
    
    // Get top 5 companies with highest match scores
    const topCompanies = companies
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
    
    // Fetch contacts for each top company
    for (const company of topCompanies) {
      const contacts = await scrapeStakeholders(company.name, company.website);
      company.contacts = contacts;
    }
    
    return topCompanies;
  } catch (error) {
    console.error("Error scouting for leads:", error);
    return [];
  }
};

/**
 * Extract company name from search result
 */
const extractCompanyNameFromResult = (result: any): string => {
  let name = "";
  
  if (result.title) {
    // Try to extract company name from title
    // Split by common separators
    const parts = result.title.split(/\s*[\|\-]\s*/);
    name = parts[0].trim();
  }
  
  if (!name && result.url) {
    try {
      // Try to extract from URL domain
      const url = new URL(result.url);
      // Get domain without TLD
      name = url.hostname.split('.')[0];
      // Convert to title case
      name = name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {
      // Invalid URL, ignore
    }
  }
  
  return name;
};

/**
 * Calculate match score based on keywords in search result
 */
const calculateMatchScore = (result: any, services: string): number => {
  let score = 5; // Base score
  
  const keywords = [
    "looking for", "hiring", "seeking", "need", "requires",
    "request for proposal", "RFP", "vendor", "provider"
  ];
  
  // Also add service keywords
  const serviceKeywords = services
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Check snippet and title for keywords
  const text = `${result.title || ""} ${result.snippet || ""}`.toLowerCase();
  
  // Check for service keywords
  serviceKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 0.5;
    }
  });
  
  // Check for intent keywords
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 1;
    }
  });
  
  // Recency bonus
  if (text.includes("recent") || text.includes("2023") || text.includes("2024")) {
    score += 1;
  }
  
  return Math.min(10, Math.round(score));
};

/**
 * Scrape stakeholders from a company using Google Search
 * @param companyName Target company name
 * @param companyWebsite Target company website
 * @returns Array of stakeholders with name, title, LinkedIn profile
 */
export const scrapeStakeholders = async (
  companyName: string,
  companyWebsite: string
): Promise<LeadStakeholder[]> => {
  try {
    // Search for leadership team
    const queries = [
      `${companyName} leadership team "linkedin"`,
      `${companyName} "CTO" OR "CIO" OR "Head of IT" linkedin`,
      `${companyName} "VP of IT" OR "Director of Technology" linkedin`,
      `${companyWebsite} leadership team`
    ];
    
    let allResults: any[] = [];
    
    for (const query of queries) {
      const results = await performWebSearch(query);
      allResults = [...allResults, ...results];
      
      // If we have enough results, stop searching
      if (allResults.length > 10) break;
    }
    
    // Process results to extract people information
    const stakeholders = extractPeopleFromSearchResults(allResults, companyName);
    
    return stakeholders.slice(0, 5); // Return top 5 stakeholders
  } catch (error) {
    console.error("Error scraping stakeholders:", error);
    return [];
  }
};

/**
 * Extract people information from search results
 */
const extractPeopleFromSearchResults = (searchResults: any[], companyName: string): LeadStakeholder[] => {
  const people: LeadStakeholder[] = [];
  const seenNames = new Set();
  
  for (const result of searchResults) {
    // Skip if not related to LinkedIn
    if (!result.url?.includes('linkedin.com/')) continue;
    
    // Try to extract name and title from the search result
    const title = result.title || '';
    const snippet = result.snippet || '';
    
    // Basic extraction logic - can be improved
    let name = title.split('-')[0]?.trim();
    let position = title.split('-')[1]?.trim() || '';
    
    if (!position && snippet) {
      // Try to extract position from snippet
      position = snippet.match(/(?:CEO|CTO|CIO|Director|Head|VP|Vice President|Manager)(?:\sof\s[\w\s]+)?/i)?.[0] || '';
    }
    
    // Filter out irrelevant results
    if (!name || name.length > 40 || seenNames.has(name.toLowerCase())) continue;
    
    seenNames.add(name.toLowerCase());
    
    people.push({
      name,
      title: position || 'Unknown Position',
      linkedinUrl: result.url,
      email: '' // Email would require additional scraping
    });
  }
  
  return people;
};

/**
 * Scrape company intent signals (hiring, news, etc)
 */
export const scrapeCompanyIntent = async (
  companyName: string,
  companyWebsite: string
): Promise<any> => {
  try {
    // Search for recent news and hiring
    const queries = [
      `${companyName} hiring "IT" OR "technology" OR "CRM" recent`,
      `${companyName} "expansion" OR "growth" OR "digital transformation" recent`,
      `${companyName} "vendor" OR "partnership" OR "CRM" recent`
    ];
    
    let allResults: any[] = [];
    
    for (const query of queries) {
      const results = await performWebSearch(query);
      allResults = [...allResults, ...results];
    }
    
    // Process the results
    const newsItems = allResults.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.url
    }));
    
    // Calculate urgency score based on keywords
    const urgentKeywords = ['urgent', 'immediately', 'asap', 'quickly', 'soon', 'hiring', 'expansion'];
    
    let urgencyScore = 5; // Default
    const allText = allResults.map(r => `${r.title} ${r.snippet}`).join(' ').toLowerCase();
    
    urgentKeywords.forEach(keyword => {
      if (allText.includes(keyword)) urgencyScore += 1;
    });
    
    // Cap at 10
    urgencyScore = Math.min(10, urgencyScore);
    
    return {
      activitySummary: summarizeNews(newsItems),
      urgencyScore
    };
  } catch (error) {
    console.error("Error scraping company intent:", error);
    return {
      activitySummary: "Unable to gather company intent data.",
      urgencyScore: 5
    };
  }
};

/**
 * Summarize news items
 */
const summarizeNews = (newsItems: any[]): string => {
  if (newsItems.length === 0) {
    return "No recent activities found.";
  }
  
  // Extract most relevant snippets
  const topSnippets = newsItems
    .slice(0, 3)
    .map(item => item.snippet)
    .filter(Boolean);
    
  return topSnippets.join(' ') || "No significant activities found.";
};

/**
 * Generate sales plan using the Gemini API
 */
export const generateSalesPlan = async (
  providerCompany: string,
  providerServices: string,
  targetClient: string,
  stakeholders: any[],
  intent: any
): Promise<any> => {
  try {
    // Format stakeholders for prompt
    const stakeholdersList = stakeholders.map(s => `- ${s.name}, ${s.title}`).join('\n');
    
    // Create prompt for Gemini
    const prompt = `
      As an expert sales consultant, create a complete B2B sales strategy for:
      
      Provider Company: ${providerCompany}
      Services Offered: ${providerServices}
      
      Target Client: ${targetClient}
      
      Key Stakeholders:
      ${stakeholdersList}
      
      Recent Company Activities:
      ${intent.activitySummary}
      
      Urgency Score: ${intent.urgencyScore}/10
      
      Please generate:
      1. A cold call script (30-60 seconds)
      2. A 2-3 step email sequence
      3. Marketing approach recommendations
      
      Format each section clearly and be specific about the services offered.
    `;
    
    // Use existing Gemini integration (simplified for this example)
    const geminiResponse = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    
    if (!geminiResponse.ok) {
      throw new Error("Failed to generate sales plan");
    }
    
    const result = await geminiResponse.json();
    
    // Parse the response (this would need refinement based on actual Gemini output format)
    const text = result.text || result.generatedText || "";
    
    // Extract sections
    const coldCallSection = extractSection(text, "cold call script", "email sequence");
    const emailSection = extractSection(text, "email sequence", "marketing");
    const marketingSection = extractSection(text, "marketing", "");
    
    return {
      coldCallScript: coldCallSection || "Cold call script could not be generated.",
      emailSequence: emailSection || "Email sequence could not be generated.",
      marketingTips: marketingSection || "Marketing tips could not be generated."
    };
  } catch (error) {
    console.error("Error generating sales plan:", error);
    return {
      coldCallScript: "Could not generate cold call script due to an error.",
      emailSequence: "Could not generate email sequence due to an error.",
      marketingTips: "Could not generate marketing tips due to an error."
    };
  }
};

/**
 * Helper to extract a section from the AI-generated text
 */
const extractSection = (text: string, startMarker: string, endMarker: string): string => {
  const lowerText = text.toLowerCase();
  const startIdx = lowerText.indexOf(startMarker);
  
  if (startIdx === -1) return "";
  
  let endIdx = endMarker ? lowerText.indexOf(endMarker, startIdx) : text.length;
  if (endIdx === -1) endIdx = text.length;
  
  return text.substring(startIdx, endIdx).trim();
};
