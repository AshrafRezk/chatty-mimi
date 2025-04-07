import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { AIConfig, ChatState, Language, Message, Persona, Theme, UserLocation } from '../types';
import { detectUserLocation, getDefaultLanguageFromLocation } from '../utils/locationUtils';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { nanoid } from 'nanoid';
import { toast } from "sonner";

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
    useMultimodal: true
  },
  isVoiceMode: false,
  currentConversationId: null,
  conversationHistory: [],
  isGuestMode: false,
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
  | { type: 'SET_CURRENT_CONVERSATION_ID'; payload: string | null }
  | { type: 'SET_CONVERSATION_HISTORY'; payload: any[] }
  | { type: 'LOAD_CONVERSATION'; payload: { messages: Message[], conversationId: string } }
  | { type: 'SET_GUEST_MODE'; payload: boolean }
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
    case 'SET_CURRENT_CONVERSATION_ID':
      return {
        ...state,
        currentConversationId: action.payload,
      };
    case 'SET_CONVERSATION_HISTORY':
      return {
        ...state,
        conversationHistory: action.payload,
      };
    case 'LOAD_CONVERSATION':
      return {
        ...state,
        messages: action.payload.messages,
        currentConversationId: action.payload.conversationId,
      };
    case 'SET_GUEST_MODE':
      return {
        ...state,
        isGuestMode: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        currentConversationId: null,
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
  setGuestMode: (enabled: boolean) => void;
  clearMessages: () => void;
  createNewConversation: () => Promise<string | null>;
  loadConversation: (conversationId: string) => Promise<void>;
  fetchConversationHistory: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const [guestNoticeShown, setGuestNoticeShown] = useState(false);

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
    
    // Get conversation history if user is logged in
    if (user) {
      fetchConversationHistory();
      checkForCurrentConversation();
    } else if (!user && !guestNoticeShown && window.location.pathname === '/') {
      // Show guest mode notification
      dispatch({ type: 'SET_GUEST_MODE', payload: true });
      setGuestNoticeShown(true);
      
      setTimeout(() => {
        toast.info(
          state.language === 'ar' 
            ? 'أنت تستخدم الوضع الزائر. لا نجمع بياناتك، لكن تسجيل الدخول سيمنحك تجربة شخصية أفضل.'
            : 'You are using guest mode. We do not collect your data, but signing in will give you a better personalized experience.',
          {
            duration: 8000,
          }
        );
      }, 1500);
    }
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user, guestNoticeShown, state.language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  }, [state.theme, state.language]);

  // Check if there's a current conversation in local storage
  const checkForCurrentConversation = async () => {
    const currentConvId = localStorage.getItem('current-conversation-id');
    if (currentConvId && user) {
      // Verify this conversation belongs to the user
      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', currentConvId)
        .eq('user_id', user.id)
        .single();
      
      if (data && !error) {
        dispatch({ type: 'SET_CURRENT_CONVERSATION_ID', payload: currentConvId });
        loadConversation(currentConvId);
      } else {
        localStorage.removeItem('current-conversation-id');
      }
    }
  };

  const fetchConversationHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      dispatch({ type: 'SET_CONVERSATION_HISTORY', payload: data || [] });
    } catch (error) {
      console.error('Error fetching conversation history:', error);
    }
  };

  const createNewConversation = async () => {
    if (!user) {
      // For guest users, just clear messages
      dispatch({ type: 'CLEAR_MESSAGES' });
      return null;
    }
    
    try {
      // Create a new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: 'New conversation'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const conversationId = data.id;
      
      // Set as current conversation
      dispatch({ type: 'SET_CURRENT_CONVERSATION_ID', payload: conversationId });
      localStorage.setItem('current-conversation-id', conversationId);
      
      // Clear messages
      dispatch({ type: 'CLEAR_MESSAGES' });
      
      // Refresh conversation history
      fetchConversationHistory();
      
      return conversationId;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast.error('Failed to create new conversation');
      return null;
    }
  };

  const loadConversation = async (conversationId: string) => {
    if (!user) return;
    
    try {
      // Fetch messages for this conversation
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Format messages for display
      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.created_at).getTime(),
        imageSrc: msg.image_url,
      }));
      
      // Load conversation
      dispatch({ 
        type: 'LOAD_CONVERSATION', 
        payload: { 
          messages: formattedMessages, 
          conversationId 
        } 
      });
      
      // Update localStorage
      localStorage.setItem('current-conversation-id', conversationId);
      
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    let conversationId = state.currentConversationId;
    
    // Generate a temporary ID and timestamp for frontend display
    const tempId = nanoid();
    const timestamp = Date.now();
    
    // Add message to UI immediately
    const newMessageForUI: Message = {
      ...message,
      id: tempId,
      timestamp,
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: newMessageForUI });

    // If user is logged in, save to database
    if (user) {
      try {
        // If no conversation exists, create one
        if (!conversationId) {
          const newConvId = await createNewConversation();
          if (!newConvId) throw new Error('Failed to create conversation');
          conversationId = newConvId;
        }
        
        // Update conversation title based on first user message if it's still "New conversation"
        if (message.sender === 'user' && state.messages.length === 0) {
          const title = message.text.length > 30 
            ? `${message.text.substring(0, 30)}...` 
            : message.text;
          
          await supabase
            .from('conversations')
            .update({ title })
            .eq('id', conversationId);
            
          // Refresh conversation history
          fetchConversationHistory();
        }
        
        // Save message to database
        const messageData = {
          conversation_id: conversationId,
          user_id: user.id,
          text: message.text,
          sender: message.sender,
          image_url: message.imageSrc || null
        };
        
        const { data, error } = await supabase
          .from('messages')
          .insert(messageData)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        // Update conversation's updated_at timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }

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
  
  const setGuestMode = (enabled: boolean) => {
    dispatch({ type: 'SET_GUEST_MODE', payload: enabled });
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
        setGuestMode,
        clearMessages,
        createNewConversation,
        loadConversation,
        fetchConversationHistory
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
