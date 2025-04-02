export type Language = 'en' | 'ar';
export type Mood = 'calm' | 'friendly' | 'deep' | 'focus';
export type Theme = 'light' | 'dark' | 'system';
export type Persona = 
  'general' | 
  'software' | 
  'medicine' | 
  'architecture' | 
  'project_management' | 
  'finance' | 
  'education' | 
  'legal' | 
  'christianity' | 
  'islam' |
  'diet_coach' |
  'real_estate';

export interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  imageSrc?: string;
  references?: Reference[];
  certaintyScore?: number;
  nutritionData?: NutritionData;
  propertyData?: PropertyData;
}

export interface Reference {
  title: string;
  url: string;
  snippet: string;
}

export interface UserLocation {
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface NutritionData {
  calories: number;
  protein: number;
  fats: number;
  carbohydrates: number;
}

export interface PaymentPlan {
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
  paymentPlan?: PaymentPlan;
}

export interface AIConfig {
  service: string;
  contextLength: number;
  persona: Persona;
  webSearch: boolean;
}

export interface ChatState {
  messages: Message[];
  language: Language;
  mood: Mood;
  isTyping: boolean;
  userLocation: UserLocation | null;
  isFreeLimit: boolean;
  theme: Theme;
  aiConfig: AIConfig;
  isVoiceMode: boolean;
}

export interface PropertyImage {
  url: string;
  title: string;
  description?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  imageSrc?: string;
  references?: Reference[];
  certaintyScore?: number;
  nutritionData?: NutritionData;
  propertyData?: PropertyData;
  propertyImages?: PropertyImage[];
}
