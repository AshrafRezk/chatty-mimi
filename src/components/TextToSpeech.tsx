
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Play, Square, Volume2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TextToSpeechProps {
  text: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "default";
  autoplay?: boolean;
}

const TextToSpeech = ({ text, size = "sm", variant = "ghost", autoplay = false }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const { state } = useChat();
  const { language, isVoiceMode } = state;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);
  
  // Update text ref when text prop changes
  useEffect(() => {
    textRef.current = text;
  }, [text]);
  
  useEffect(() => {
    // Check if browser supports speech synthesis
    setIsSpeechSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      utteranceRef.current = new SpeechSynthesisUtterance();
      
      // Set appropriate voice based on language
      const setVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const langCode = language === 'ar' ? 'ar' : 'en';
        
        // Try to find a voice that matches the language
        const preferredVoice = voices.find(voice => voice.lang.includes(langCode));
        
        if (preferredVoice) {
          utteranceRef.current!.voice = preferredVoice;
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
  
  useEffect(() => {
    // Set language when it changes
    if (utteranceRef.current) {
      utteranceRef.current.lang = language === 'ar' ? 'ar-EG' : 'en-US';
    }
  }, [language]);
  
  // Handle autoplay when in voice mode
  useEffect(() => {
    if (autoplay && isVoiceMode && text && isSpeechSupported && !isPlaying) {
      speak();
    }
  }, [text, isVoiceMode, autoplay]);
  
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
    
    // Set pitch and rate for more natural sounding voice
    utteranceRef.current.pitch = 1.0;
    utteranceRef.current.rate = 1.0;
    
    // Start speaking
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
