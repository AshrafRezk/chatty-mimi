
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Play, Square, Volume2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

interface TextToSpeechProps {
  text: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "default";
}

const TextToSpeech = ({ text, size = "sm", variant = "ghost" }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const { state } = useChat();
  const { language } = state;
  
  useEffect(() => {
    // Check if browser supports speech synthesis
    setIsSpeechSupported('speechSynthesis' in window);
  }, []);
  
  useEffect(() => {
    // Clean up any speech when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const speak = () => {
    if (!isSpeechSupported) return;
    
    // If already speaking, stop current speech
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the language based on current app language
    if (language === 'ar') {
      utterance.lang = 'ar-EG'; // Arabic
    } else {
      utterance.lang = 'en-US'; // English
    }
    
    // Event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };
  
  // Don't render if speech synthesis is not supported
  if (!isSpeechSupported) return null;
  
  return (
    <Button
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      variant={variant}
      className={cn(
        "rounded-full",
        size === "sm" ? "h-8 w-8 p-0" : "px-3"
      )}
      onClick={speak}
    >
      {isPlaying ? (
        <Square className={cn("h-4 w-4", size !== "sm" && "mr-2")} />
      ) : (
        <Volume2 className={cn("h-4 w-4", size !== "sm" && "mr-2")} />
      )}
      {size !== "sm" && (isPlaying ? "Stop" : "Listen")}
    </Button>
  );
};

export default TextToSpeech;
