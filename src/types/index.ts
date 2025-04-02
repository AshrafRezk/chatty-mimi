
export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'tr' | 'no';

export type Theme = 'light' | 'dark' | 'system' | 'auto';

export type Mood = 'calm' | 'friendly' | 'deep' | 'focus';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
}

export interface UserLocation {
  city: string;
  country: string;
  countryCode: string;
}

export interface ChatState {
  messages: Message[];
  language: Language;
  mood: Mood;
  isTyping: boolean;
  userLocation: UserLocation | null;
  isFreeLimit: boolean;
  theme: Theme;
}
