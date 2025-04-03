
export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'tr' | 'no';
export type Theme = 'light' | 'dark' | 'system';
export type Persona = 
  | 'general' 
  | 'professional' 
  | 'creative' 
  | 'academic' 
  | 'software' 
  | 'medicine' 
  | 'architecture' 
  | 'project_management' 
  | 'finance' 
  | 'education' 
  | 'legal' 
  | 'christianity'
  | 'islam'
  | 'diet_coach'
  | 'real_estate';

export interface Reference {
  title: string;
  url: string;
  snippet: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  fats: number;
  carbohydrates: number;
}

export interface PropertyPaymentPlan {
  downPayment: number;
  monthlyInstallment: number;
  years: number;
}

export interface PropertyData {
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  paymentPlan?: PropertyPaymentPlan;
}

export interface PropertyImage {
  url: string;
  caption?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  imageSrc?: string | null;
  references?: Reference[];
  certaintyScore?: number;
  nutritionData?: NutritionData;
  propertyData?: PropertyData;
  propertyImages?: PropertyImage[];
}

export interface UserLocation {
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface AIConfig {
  service: 'mimi' | 'google';
  contextLength: number;
  persona: Persona;
  webSearch: boolean;
}

export interface ChatState {
  messages: Message[];
  language: Language;
  mood: string;
  isTyping: boolean;
  userLocation: UserLocation | null;
  isFreeLimit: boolean;
  theme: Theme;
  aiConfig: AIConfig;
  isVoiceMode: boolean;
  currentConversationId: string | null;
  conversationHistory: any[];
  isGuestMode: boolean;
}
