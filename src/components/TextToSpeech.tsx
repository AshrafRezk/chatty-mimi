
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Volume2, Square } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Language } from "@/types";

interface TextToSpeechProps {
  text: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "default";
  autoplay?: boolean;
}

const TextToSpeech = ({ text, size = "sm", variant = "ghost", autoplay = false }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisUtterance | null>(null);
  const { state } = useChat();
  const { language, isVoiceMode, mood, aiConfig } = state;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);
  
  // Update text ref when text prop changes
  useEffect(() => {
    textRef.current = text;
  }, [text]);
  
  // Get emotion from text
  const detectEmotion = (text: string): {pitch: number, rate: number} => {
    const lowerText = text.toLowerCase();
    
    // Simple emotion detection based on keywords
    if (lowerText.includes('happy') || 
        lowerText.includes('great') || 
        lowerText.includes('excellent') ||
        lowerText.includes('wonderful')) {
      return { pitch: 1.1, rate: 1.05 }; // Happy - higher pitch, slightly faster
    }
    
    if (lowerText.includes('sad') || 
        lowerText.includes('sorry') || 
        lowerText.includes('unfortunate')) {
      return { pitch: 0.9, rate: 0.9 }; // Sad - lower pitch, slower
    }
    
    if (lowerText.includes('exciting') || 
        lowerText.includes('amazing') || 
        lowerText.includes('wow')) {
      return { pitch: 1.15, rate: 1.1 }; // Excited - highest pitch, fastest
    }
    
    if (lowerText.includes('calm') || 
        lowerText.includes('relax') || 
        lowerText.includes('gentle')) {
      return { pitch: 1.0, rate: 0.85 }; // Calm - normal pitch, very slow
    }
    
    // Default/neutral emotion with slight humanization
    return { pitch: 1.05, rate: 0.95 };
  };
  
  // Get voice characteristics based on persona
  const getPersonaVoiceSettings = (): {pitch: number, rate: number} => {
    switch(aiConfig.persona) {
      case 'medicine':
        return { pitch: 1.05, rate: 0.9 }; // Authoritative, careful
      case 'legal':
        return { pitch: 0.95, rate: 0.9 }; // Deep, precise, deliberate 
      case 'software':
        return { pitch: 1.0, rate: 1.0 }; // Clear, straightforward
      case 'education':
        return { pitch: 1.05, rate: 0.9 }; // Warm, explanatory
      case 'diet_coach':
        return { pitch: 1.1, rate: 1.0 }; // Encouraging, energetic
      case 'finance': 
        return { pitch: 0.95, rate: 0.95 }; // Serious, trustworthy
      case 'real_estate':
        return { pitch: 1.05, rate: 0.95 }; // Professional, enthusiastic
      default:
        return { pitch: 1.0, rate: 0.97 }; // Default natural voice
    }
  };
  
  useEffect(() => {
    // Check if browser supports speech synthesis
    setIsSpeechSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      utteranceRef.current = new SpeechSynthesisUtterance();
      
      // Set appropriate voice based on language
      const setVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const langCode = getSpeechLanguageCode(language);
        
        // Try to find a voice that matches the language
        const preferredVoice = voices.find(voice => voice.lang.includes(langCode));
        
        if (preferredVoice) {
          utteranceRef.current!.voice = preferredVoice;
          console.log(`Set voice to: ${preferredVoice.name} (${preferredVoice.lang})`);
        } else {
          // If no matching voice found, use default voice
          console.log('No voice found for language:', langCode);
        }
      };
      
      // Try to set voices immediately (Chrome)
      if (window.speechSynthesis.getVoices().length) {
        setVoices();
      } else {
        // Wait for voices to be loaded (Firefox, Safari)
        window.speechSynthesis.addEventListener('voiceschanged', setVoices);
      }
      
      // Configure event handlers
      utteranceRef.current.onstart = () => setIsPlaying(true);
      utteranceRef.current.onend = () => setIsPlaying(false);
      utteranceRef.current.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsPlaying(false);
        toast.error(language === 'ar' ? 'حدث خطأ أثناء التشغيل' : 'Error playing audio');
      };
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', () => {});
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Helper function to get the speech language code
  const getSpeechLanguageCode = (lang: Language): string => {
    // Map language codes to appropriate speech synthesis language codes
    switch (lang) {
      case 'ar': return 'ar-SA';
      case 'en': return 'en-US';
      default: return 'en-US';
    }
  };
  
  useEffect(() => {
    // Set language when it changes
    if (utteranceRef.current) {
      const speechLang = getSpeechLanguageCode(language);
      utteranceRef.current.lang = speechLang;
      console.log("Text-to-speech language set to:", speechLang);
      
      // Try to find a voice for this language again
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.lang.includes(language));
      if (preferredVoice) {
        utteranceRef.current.voice = preferredVoice;
      }
    }
  }, [language]);
  
  // Handle autoplay when in voice mode
  useEffect(() => {
    if (autoplay && isVoiceMode && text && isSpeechSupported && !isPlaying) {
      speak();
    }
  }, [text, isVoiceMode, autoplay, isPlaying]);
  
  useEffect(() => {
    // Clean up any speech when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const speak = () => {
    if (!isSpeechSupported || !utteranceRef.current) return;
    
    // If already speaking, stop current speech
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    // Set the text to speak
    utteranceRef.current.text = textRef.current;
    
    // Get emotion-based voice settings
    const emotionSettings = detectEmotion(textRef.current);
    
    // Get persona-based voice settings
    const personaSettings = getPersonaVoiceSettings();
    
    // Apply voice settings with a blend of emotion and persona characteristics
    utteranceRef.current.pitch = (emotionSettings.pitch + personaSettings.pitch) / 2;
    utteranceRef.current.rate = (emotionSettings.rate + personaSettings.rate) / 2;
    
    // Apply mood adjustments
    if (mood === 'calm') {
      utteranceRef.current.rate *= 0.95; // Slower for calm mood
    } else if (mood === 'friendly') {
      utteranceRef.current.pitch *= 1.05; // Slightly higher pitch for friendly mood
    } else if (mood === 'deep') {
      utteranceRef.current.rate *= 0.9;  // Slower for deep mood
      utteranceRef.current.pitch *= 0.95; // Lower pitch for deep mood
    }
    
    // Add small random variations for more natural sound
    utteranceRef.current.pitch *= (0.98 + Math.random() * 0.04); // +/- 2%
    utteranceRef.current.rate *= (0.98 + Math.random() * 0.04);  // +/- 2%
    
    // Start speaking
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utteranceRef.current);
  };
  
  // Don't render if speech synthesis is not supported or in voice mode with autoplay
  if (!isSpeechSupported || (isVoiceMode && autoplay)) return null;
  
  return (
    <Button
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      variant={variant}
      className={cn(
        "rounded-full",
        size === "sm" ? "h-8 w-8 p-0" : "px-3"
      )}
      onClick={speak}
      title={isPlaying ? "Stop speaking" : "Listen"}
      aria-label={isPlaying ? "Stop speaking" : "Listen"}
    >
      {isPlaying ? (
        <Square className={cn("h-4 w-4", size !== "sm" && "mr-2")} />
      ) : (
        <Volume2 className={cn("h-4 w-4", size !== "sm" && "mr-2")} />
      )}
      {size !== "sm" && (isPlaying ? 
        (language === 'ar' ? "إيقاف" : "Stop") : 
        (language === 'ar' ? "استماع" : "Listen")
      )}
    </Button>
  );
};

export default TextToSpeech;
