
// Define available languages
export type Language = 'en' | 'ar';

// Define available moods
export type Mood = 'calm' | 'friendly' | 'deep' | 'focus';

// Define persona types
export type Persona = 'general';

// Interface for user messages
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  imageSrc?: string;
  references?: Reference[];
  certaintyScore?: number;
  nutritionData?: NutritionData;
  propertyData?: PropertyData;
  propertyImages?: PropertyImage[];
}

// Interface for user location
export interface UserLocation {
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Interface for chat state
export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  language: Language;
  mood: Mood;
  userLocation: UserLocation | null;
  aiConfig: {
    persona: Persona;
    useMultimodal: boolean;
  };
  currentConversationId: string | null;
  isFreeLimit: boolean;
  isVoiceMode: boolean;
}

// Interface for references/sources
export interface Reference {
  title: string;
  link: string;
  snippet: string;
}

// Interface for nutrition data
export interface NutritionData {
  calories: number;
  protein: number;
  fats: number;
  carbohydrates: number;
}

// Interface for property data
export interface PropertyData {
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  paymentPlan?: {
    downPayment: number;
    monthlyInstallment: number;
    years: number;
  };
}

// Interface for property images
export interface PropertyImage {
  url: string;
  description: string;
  title: string; // Added the required title property
}
