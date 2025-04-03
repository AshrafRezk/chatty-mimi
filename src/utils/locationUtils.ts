
import { UserLocation, Language } from '../types';

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
      
    // French speaking countries
    case 'FR':
    case 'BE':
    case 'CH':
    case 'CA':
    case 'CD':
    case 'CI':
    case 'MG':
    case 'NE':
      return 'fr';
      
    // Spanish speaking countries
    case 'ES':
    case 'MX':
    case 'CO':
    case 'AR':
    case 'PE':
    case 'VE':
    case 'CL':
    case 'EC':
      return 'es';
      
    // German speaking countries
    case 'DE':
    case 'AT':
    case 'CH':
      return 'de';
      
    // Italian
    case 'IT':
      return 'it';
      
    // Portuguese speaking countries
    case 'PT':
    case 'BR':
      return 'pt';
      
    // Russian
    case 'RU':
      return 'ru';
      
    // Chinese
    case 'CN':
    case 'TW':
    case 'HK':
      return 'zh';
      
    // Japanese
    case 'JP':
      return 'ja';
      
    // Korean
    case 'KR':
      return 'ko';
      
    // Turkish
    case 'TR':
      return 'tr';
      
    // Norwegian
    case 'NO':
      return 'no';
      
    // Default to English
    default:
      return 'en';
  }
};
