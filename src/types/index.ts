
export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'tr' | 'no';

export type Theme = 'light' | 'dark' | 'system' | 'auto';

export type Mood = 'calm' | 'friendly' | 'deep' | 'focus';

export type Persona = 'general' | 'software' | 'medicine' | 'architecture' | 'project_management' | 'finance' | 'education' | 'legal' | 'christianity' | 'islam';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  references?: Reference[];
  certaintyScore?: number;
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
}

export interface AIConfig {
  service: 'mimi' | 'mock';
  contextLength?: number;
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
