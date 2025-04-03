
import { UserLocation, Language, Persona } from '../types';

/**
 * Detect user location through API
 */
export const detectUserLocation = async (): Promise<UserLocation | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      city: data.city,
      country: data.country_name,
      countryCode: data.country_code,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone || 'UTC' // Ensure timezone is included with a default
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    return null;
  }
};

/**
 * Find the preferred language based on user's location
 */
export const getDefaultLanguageFromLocation = (countryCode: string): Language => {
  if (!countryCode) return 'en';

  // Map common country codes to languages
  switch (countryCode.toUpperCase()) {
    // Arabic speaking countries
    case 'SA':
    case 'AE':
    case 'QA':
    case 'BH':
    case 'KW':
    case 'OM':
    case 'JO':
    case 'EG':
    case 'DZ':
    case 'MA':
    case 'TN':
    case 'LY':
    case 'YE':
      return 'ar';
      
    // Default to English
    default:
      return 'en';
  }
};

/**
 * Generate welcome message based on user location
 */
export const getWelcomeMessage = (location: UserLocation | null, language: Language): string => {
  if (language === 'ar') {
    return location ? 
      `مرحباً بك في ميمي! أنت تتصفح من ${location.city}, ${location.country}.` :
      'مرحباً بك في ميمي! كيف يمكنني مساعدتك اليوم؟';
  }
  
  return location ? 
    `Welcome to Mimi! You're browsing from ${location.city}, ${location.country}.` :
    'Welcome to Mimi! How can I help you today?';
};

/**
 * Generate persona-specific welcome message
 */
export const getPersonaWelcomeMessage = (persona: Persona, language: Language): string => {
  if (language === 'ar') {
    switch (persona) {
      case 'general':
        return 'أنا مساعدك الذكي الاصطناعي العام. يمكنني مساعدتك في مجموعة متنوعة من المهام.';
      default:
        return '';
    }
  }
  
  switch (persona) {
    case 'general':
      return 'I am your general AI assistant. I can help you with a variety of tasks.';
    default:
      return '';
  }
};
