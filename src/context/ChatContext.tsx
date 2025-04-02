import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AIConfig, ChatState, Language, Message, Persona, Theme, UserLocation } from '../types';
import { detectUserLocation, getDefaultLanguageFromLocation } from '../utils/locationUtils';

// Initial state
const initialState: ChatState = {
  messages: [],
  language: 'en',
  mood: 'friendly',
  isTyping: false,
  userLocation: null,
  isFreeLimit: false,
  theme: 'light',
  aiConfig: {
    service: 'mimi',
    contextLength: 5,
    persona: 'general',
    webSearch: true,
  },
  isVoiceMode: false,
};

// Action types
type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_MOOD'; payload: string }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_USER_LOCATION'; payload: UserLocation }
  | { type: 'SET_FREE_LIMIT'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_AI_CONFIG'; payload: Partial<AIConfig> }
  | { type: 'SET_PERSONA'; payload: Persona }
  | { type: 'TOGGLE_WEB_SEARCH'; payload: boolean }
  | { type: 'SET_VOICE_MODE'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' };

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_LANGUAGE':
      localStorage.setItem('mimi-language', action.payload);
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_MOOD':
      return state;
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'SET_USER_LOCATION':
      return {
        ...state,
        userLocation: action.payload,
      };
    case 'SET_FREE_LIMIT':
      return {
        ...state,
        isFreeLimit: action.payload,
      };
    case 'SET_THEME':
      localStorage.setItem('mimi-theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_AI_CONFIG':
      return {
        ...state,
        aiConfig: {
          ...state.aiConfig,
          ...action.payload,
        },
      };
    case 'SET_PERSONA':
      return {
        ...state,
        aiConfig: {
          ...state.aiConfig,
          persona: action.payload,
        },
      };
    case 'TOGGLE_WEB_SEARCH':
      return {
        ...state,
        aiConfig: {
          ...state.aiConfig,
          webSearch: action.payload,
        },
      };
    case 'SET_VOICE_MODE':
      return {
        ...state,
        isVoiceMode: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

// Create context
interface ChatContextType {
  state: ChatState;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLanguage: (language: Language) => void;
  setMood: (mood: string) => void;
  setTyping: (isTyping: boolean) => void;
  setTheme: (theme: Theme) => void;
  setAIConfig: (config: Partial<AIConfig>) => void;
  setPersona: (persona: Persona) => void;
  toggleWebSearch: (enabled: boolean) => void;
  setVoiceMode: (enabled: boolean) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('mimi-language') as Language;
    const savedTheme = localStorage.getItem('mimi-theme') as Theme;
    
    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
    
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: 'SET_THEME', payload: prefersDark ? 'dark' : 'light' });
      document.documentElement.classList.toggle('dark', prefersDark);
    }
    
    const getLocation = async () => {
      const location = await detectUserLocation();
      if (location) {
        dispatch({ type: 'SET_USER_LOCATION', payload: location });
        
        if (!savedLanguage) {
          const detectedLanguage = getDefaultLanguageFromLocation(location.countryCode);
          dispatch({ type: 'SET_LANGUAGE', payload: detectedLanguage });
        }
      }
    };
    
    getLocation();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (state.theme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
        dispatch({ type: 'SET_THEME', payload: e.matches ? 'dark' : 'light' });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  }, [state.theme, state.language]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

    if (state.messages.length >= 15 && message.sender === 'user') {
      dispatch({ type: 'SET_FREE_LIMIT', payload: true });
    }
  };

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const setMood = (mood: string) => {
    dispatch({ type: 'SET_MOOD', payload: mood });
  };

  const setTyping = (isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping });
  };

  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const setAIConfig = (config: Partial<AIConfig>) => {
    dispatch({ type: 'SET_AI_CONFIG', payload: config });
  };

  const setPersona = (persona: Persona) => {
    dispatch({ type: 'SET_PERSONA', payload: persona });
  };

  const toggleWebSearch = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_WEB_SEARCH', payload: enabled });
  };

  const setVoiceMode = (enabled: boolean) => {
    dispatch({ type: 'SET_VOICE_MODE', payload: enabled });
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        addMessage,
        setLanguage,
        setMood,
        setTyping,
        setTheme,
        setAIConfig,
        setPersona,
        toggleWebSearch,
        setVoiceMode,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
