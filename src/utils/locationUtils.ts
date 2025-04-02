
import { UserLocation } from "../types";

export const detectUserLocation = async (): Promise<UserLocation | null> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    
    const data = await response.json();
    return {
      city: data.city,
      country: data.country_name,
      countryCode: data.country_code.toLowerCase()
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

export const getWelcomeMessage = (location: UserLocation | null, language: string): string => {
  if (!location) {
    return language === 'ar' ? "أهلاً بك!" : "Welcome!";
  }
  
  const { city, country } = location;
  
  if (language === 'ar') {
    return `أهلاً بك من ${city}، ${country}!`;
  } else {
    return `Welcome from ${city}, ${country}!`;
  }
};

export const getDefaultLanguageFromLocation = (countryCode: string): 'en' | 'ar' => {
  // List of Arabic-speaking countries
  const arabicCountries = ['sa', 'ae', 'qa', 'kw', 'om', 'bh', 'eg', 'jo', 'lb', 'sy', 'iq', 'ps', 'ye', 'sd', 'ma', 'dz', 'tn', 'ly'];
  
  return arabicCountries.includes(countryCode.toLowerCase()) ? 'ar' : 'en';
};
