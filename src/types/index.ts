export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark' | 'system';
export type Persona = 'general' | 'professional' | 'creative' | 'academic';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  imageSrc?: string | null;
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
