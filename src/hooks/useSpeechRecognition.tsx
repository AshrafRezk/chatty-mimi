
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Add global type definitions for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseSpeechRecognitionProps {
  language: string;
  onTranscript?: (transcript: string) => void;
  autoStart?: boolean;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

const useSpeechRecognition = ({ 
  language, 
  onTranscript,
  autoStart = false
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setIsSupported(supported);
    
    if (supported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const newTranscript = finalTranscript || interimTranscript;
        setTranscript(newTranscript);
        onTranscript?.(newTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        // Only restart if we're not actively stopping it
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
      
      if (autoStart) {
        startListening();
      }
    } else if (!supported) {
      toast.error('Speech recognition is not supported by your browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error('Error stopping recognition', e);
          }
        }
      }
    };
  }, [language]);
  
  // Update recognition language if language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    }
  }, [language]);
  
  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      toast.error('Speech recognition is not supported');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition', error);
      toast.error('Error starting speech recognition');
    }
  };
  
  const stopListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }
  };
  
  const resetTranscript = () => {
    setTranscript('');
  };
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};

export default useSpeechRecognition;
