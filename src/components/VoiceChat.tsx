
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { PhoneOff } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { Motion } from './ui/motion';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import CallTimer from './VoiceCall/CallTimer';
import AssistantAvatar from './VoiceCall/AssistantAvatar';
import CallControls from './VoiceCall/CallControls';

interface VoiceChatProps {
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

const VoiceChat = ({ onSendMessage, onClose }: VoiceChatProps) => {
  const { state } = useChat();
  const { language, mood } = state;
  
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use the custom speech recognition hook
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useSpeechRecognition({ 
    language,
    autoStart: false
  });
  
  // Effect for call connection simulation
  useEffect(() => {
    // Simulate connecting and then active call
    const connectionTimer = setTimeout(() => {
      setCallStatus('active');
      // Auto start listening
      if (isSupported) {
        startListening();
      }
    }, 1500);
    
    return () => {
      clearTimeout(connectionTimer);
    };
  }, [isSupported, startListening]);
  
  // Check if speech synthesis is speaking
  useEffect(() => {
    const checkSpeaking = setInterval(() => {
      if ('speechSynthesis' in window) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    }, 100);
    
    return () => clearInterval(checkSpeaking);
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleSubmit = () => {
    if (transcript.trim()) {
      onSendMessage(transcript.trim());
      resetTranscript();
      stopListening();
    }
  };
  
  const handleEndCall = () => {
    setCallStatus('ended');
    stopListening();
    
    // Slight delay before closing modal
    setTimeout(() => {
      onClose();
    }, 500);
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
          mood === 'calm' ? 'border-blue-300' :
          mood === 'friendly' ? 'border-green-300' :
          mood === 'deep' ? 'border-purple-300' :
          mood === 'focus' ? 'border-orange-300' : 'border-gray-300',
          "border-4"
        )}
      >
        <div className={cn(
          "p-4",
          mood === 'deep' || mood === 'focus' ? "bg-gray-800" : "bg-gray-50"
        )}>
          <div className="flex items-center justify-between mb-2">
            <CallTimer 
              status={callStatus} 
              language={language} 
              mood={mood} 
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-red-100" 
              onClick={handleEndCall}
            >
              <PhoneOff className="text-red-500" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <AssistantAvatar 
            isSpeaking={isSpeaking}
            mood={mood}
            status={callStatus}
          />
          
          <h2 className={cn(
            "text-xl font-semibold mb-2",
            mood === 'deep' || mood === 'focus' ? "text-white" : "text-gray-800"
          )}>
            {language === 'ar' ? 'مساعد ميمي' : 'Mimi Assistant'}
          </h2>
          
          <p className={cn(
            "text-sm mb-6",
            mood === 'deep' || mood === 'focus' ? "text-gray-300" : "text-gray-500"
          )}>
            {callStatus === 'connecting' ? 
              (language === 'ar' ? 'جارٍ الاتصال بالمساعد...' : 'Connecting to assistant...') :
              callStatus === 'active' ? 
                (language === 'ar' ? 'متصل الآن' : 'Call in progress') : 
                (language === 'ar' ? 'انتهى الاتصال' : 'Call ended')
            }
          </p>
          
          <div className={cn(
            "w-full p-4 mb-4 rounded-xl min-h-16",
            mood === 'deep' || mood === 'focus' ? "bg-gray-800/50 text-white" : "bg-gray-100 text-gray-800",
            "flex items-center justify-center text-center",
            callStatus !== 'active' && "opacity-60"
          )}>
            {transcript || (
              isListening ? 
                (language === 'ar' ? 'أنا أستمع...' : 'I\'m listening...') : 
                (language === 'ar' ? 'اضغط على الميكروفون وابدأ الحديث' : 'Tap mic to speak')
            )}
          </div>
          
          <CallControls
            isListening={isListening}
            hasTranscript={!!transcript.trim()}
            callStatus={callStatus}
            onToggleMic={toggleListening}
            onSendMessage={handleSubmit}
          />
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default VoiceChat;
