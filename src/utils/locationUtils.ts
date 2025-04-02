
import { Language, UserLocation } from "../types";

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
  
  // Multilingual welcome messages
  switch (language) {
    case 'ar':
      return `أهلاً بك من ${city}، ${country}!`;
    case 'fr':
      return `Bienvenue de ${city}, ${country}!`;
    case 'es':
      return `¡Bienvenido desde ${city}, ${country}!`;
    case 'de':
      return `Willkommen aus ${city}, ${country}!`;
    case 'it':
      return `Benvenuto da ${city}, ${country}!`;
    case 'pt':
      return `Bem-vindo de ${city}, ${country}!`;
    case 'ru':
      return `Добро пожаловать из ${city}, ${country}!`;
    case 'zh':
      return `来自${country}${city}的欢迎!`;
    case 'ja':
      return `${country}の${city}からようこそ!`;
    case 'ko':
      return `${country} ${city}에서 환영합니다!`;
    case 'tr':
      return `${city}, ${country}'den hoş geldiniz!`;
    default:
      return `Welcome from ${city}, ${country}!`;
  }
};

export const getDefaultLanguageFromLocation = (countryCode: string): Language => {
  // Language mappings by country code
  const languageMappings: Record<string, Language> = {
    // Arabic speaking countries
    'sa': 'ar', 'ae': 'ar', 'qa': 'ar', 'kw': 'ar', 'om': 'ar', 
    'bh': 'ar', 'eg': 'ar', 'jo': 'ar', 'lb': 'ar', 'sy': 'ar', 
    'iq': 'ar', 'ps': 'ar', 'ye': 'ar', 'sd': 'ar', 'ma': 'ar', 
    'dz': 'ar', 'tn': 'ar', 'ly': 'ar',
    
    // French speaking countries
    'fr': 'fr', 'be': 'fr', 'ch': 'fr', 'lu': 'fr', 'mc': 'fr',
    'sn': 'fr', 'ci': 'fr', 'ml': 'fr', 'cd': 'fr', 'mg': 'fr',
    'cm': 'fr', 'ca': 'fr',
    
    // Spanish speaking countries
    'es': 'es', 'mx': 'es', 'co': 'es', 'ar': 'es', 'pe': 'es',
    've': 'es', 'cl': 'es', 'ec': 'es', 'gt': 'es', 'cu': 'es',
    'bo': 'es', 'do': 'es', 'hn': 'es', 'py': 'es', 'sv': 'es',
    'ni': 'es', 'cr': 'es', 'pa': 'es', 'uy': 'es', 'pr': 'es',
    
    // German speaking countries
    'de': 'de', 'at': 'de', 'li': 'de',
    
    // Italian speaking countries
    'it': 'it', 'sm': 'it', 'va': 'it',
    
    // Portuguese speaking countries
    'pt': 'pt', 'br': 'pt', 'ao': 'pt', 'mz': 'pt', 'gw': 'pt',
    
    // Russian speaking countries
    'ru': 'ru', 'by': 'ru', 'kz': 'ru', 'kg': 'ru',
    
    // Chinese speaking regions
    'cn': 'zh', 'tw': 'zh', 'hk': 'zh', 'sg': 'zh',
    
    // Japanese
    'jp': 'ja',
    
    // Korean
    'kr': 'ko',
    
    // Turkish
    'tr': 'tr'
  };
  
  return languageMappings[countryCode.toLowerCase()] || 'en';
};
