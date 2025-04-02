
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Phone, PhoneOff, User, X } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Motion } from './ui/motion';
import { toast } from 'sonner';

interface VoiceChatProps {
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

const VoiceChat = ({ onSendMessage, onClose }: VoiceChatProps) => {
  const { state } = useChat();
  const { language, mood } = state;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isMouthMoving, setIsMouthMoving] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      
      recognitionRef.current.onresult = (event) => {
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
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        // Only reset if we're not actively stopping it
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    } else {
      toast.error('Speech recognition is not supported by your browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        if (isListening) {
          recognitionRef.current.stop();
        }
      }
    };
  }, [language]);
  
  // Effect for handling animation when AI is speaking
  useEffect(() => {
    const id = setInterval(() => {
      if (speechSynthesis.speaking) {
        setIsMouthMoving(prev => !prev);
      } else {
        setIsMouthMoving(false);
      }
    }, 150);
    
    return () => clearInterval(id);
  }, []);
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // If there's transcript, send it as a message
      if (transcript.trim()) {
        onSendMessage(transcript.trim());
        setTranscript('');
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition', error);
        toast.error('Error starting speech recognition');
      }
    }
  };
  
  const handleSubmit = () => {
    if (transcript.trim()) {
      onSendMessage(transcript.trim());
      setTranscript('');
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };
  
  const getBorderColor = () => {
    switch(mood) {
      case 'calm': return 'border-blue-300';
      case 'friendly': return 'border-green-300';
      case 'deep': return 'border-purple-300';
      case 'focus': return 'border-orange-300';
      default: return 'border-gray-300';
    }
  };
  
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30",
      )}
    >
      <Motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "w-full max-w-md rounded-3xl shadow-lg overflow-hidden",
          mood === 'deep' || mood === 'focus' ? "bg-gray-900" : "bg-white",
          getBorderColor(),
          "border-4"
        )}
      >
        <div className="p-6 flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full" 
            onClick={onClose}
          >
            <X />
          </Button>
          
          <div className="flex flex-col items-center mb-6">
            <div className={cn(
              "relative rounded-full overflow-hidden w-32 h-32 mb-2",
              getBorderColor(),
              "border-2"
            )}>
              <Avatar className="w-full h-full">
                <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              
              {/* Simple mouth animation */}
              <div className={cn(
                "absolute bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-2 rounded-full transition-all duration-150",
                mood === 'deep' || mood === 'focus' ? "bg-white/70" : "bg-gray-800/70",
                isMouthMoving ? "h-4 rounded-full" : "h-1"
              )}/>
            </div>
            
            <h2 className={cn(
              "text-xl font-medium",
              mood === 'deep' || mood === 'focus' ? "text-white" : "text-gray-800"
            )}>
              {language === 'ar' ? 'مساعد صوتي' : 'Voice Assistant'}
            </h2>
          </div>
          
          <div className={cn(
            "w-full p-4 mb-4 rounded-xl min-h-16 text-center",
            mood === 'deep' || mood === 'focus' ? "bg-gray-800/50 text-white" : "bg-gray-100 text-gray-800"
          )}>
            {transcript || (language === 'ar' ? 'اضغط على الميكروفون وابدأ الحديث...' : 'Tap the microphone and start speaking...')}
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={toggleListening}
              className={cn(
                "rounded-full h-16 w-16 flex items-center justify-center transition-all",
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!transcript.trim()}
              className="rounded-full h-16 w-16 flex items-center justify-center bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
            >
              <Phone size={24} />
            </Button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default VoiceChat;
