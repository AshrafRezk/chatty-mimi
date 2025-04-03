
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { PhoneOff } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { Motion } from './ui/motion';
import { toast } from 'sonner';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import CallTimer from './VoiceCall/CallTimer';
import AssistantAvatar from './VoiceCall/AssistantAvatar';
import CallControls from './VoiceCall/CallControls';
import MusicRecognition from './VoiceCall/MusicRecognition';
import { RecognizedTrack, recognizeMusic, prepareAudioForRecognition } from '@/utils/musicRecognition';
import { playNotificationSound } from '@/utils/audioUtils';

interface VoiceChatProps {
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

const VoiceChat = ({ onSendMessage, onClose }: VoiceChatProps) => {
  const { state } = useChat();
  const { language, mood } = state;
  
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMusicMode, setIsMusicMode] = useState(false);
  const [isRecognizingMusic, setIsRecognizingMusic] = useState(false);
  const [recognizedTrack, setRecognizedTrack] = useState<RecognizedTrack | null>(null);
  const [volume, setVolume] = useState(1.0);
  
  // Store audio data for music recognition
  const audioDataRef = useRef<Float32Array | null>(null);
  
  // Use the custom speech recognition hook
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    audioBuffer,
    error
  } = useSpeechRecognition({ 
    language,
    autoStart: false,
    onAudioData: (data) => {
      if (isMusicMode) {
        audioDataRef.current = data;
      }
    }
  });
  
  // Effect for call connection simulation
  useEffect(() => {
    // Simulate connecting and then active call
    const connectionTimer = setTimeout(() => {
      setCallStatus('active');
      // Auto start listening
      if (isSupported) {
        startListening();
        playNotificationSound('received');
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
  
  // Handle errors
  useEffect(() => {
    if (error && error !== 'no-speech') {
      toast.error(`Speech recognition error: ${error}`);
    }
  }, [error]);
  
  // Adjust speech synthesis volume
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Monitor for new utterances and set their volume
      const originalSpeak = window.speechSynthesis.speak;
      window.speechSynthesis.speak = function(utterance) {
        utterance.volume = volume;
        return originalSpeak.call(window.speechSynthesis, utterance);
      };
      
      return () => {
        window.speechSynthesis.speak = originalSpeak;
      };
    }
  }, [volume]);
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setIsMusicMode(false);
      setRecognizedTrack(null);
      startListening();
    }
  };
  
  const handleSubmit = async () => {
    if (transcript.trim()) {
      // Play sending sound
      await playNotificationSound('sent');
      
      // Send message
      onSendMessage(transcript.trim());
      
      // Reset transcript and continue listening
      resetTranscript();
      
      // Simulate AI thinking time
      setTimeout(() => {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      }, 500);
    }
  };
  
  const handleEndCall = () => {
    setCallStatus('ended');
    stopListening();
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Slight delay before closing modal
    setTimeout(() => {
      onClose();
    }, 500);
  };
  
  const toggleMusicMode = () => {
    if (isMusicMode) {
      setIsMusicMode(false);
      setRecognizedTrack(null);
    } else {
      setIsMusicMode(true);
      toast.info(
        language === 'ar' 
          ? 'وضع التعرف على الموسيقى. اضغط على زر التعرف عندما تسمع أغنية.' 
          : 'Music recognition mode. Press identify when you hear a song.'
      );
    }
  };
  
  const handleRecognizeMusic = async () => {
    if (!audioDataRef.current || isRecognizingMusic) return;
    
    setIsRecognizingMusic(true);
    
    try {
      // Convert audio data to base64 for API processing
      const audioBase64 = prepareAudioForRecognition(audioDataRef.current);
      
      // Send to recognition service
      const track = await recognizeMusic(audioBase64);
      
      if (track) {
        setRecognizedTrack(track);
        toast.success(
          language === 'ar'
            ? `تم التعرف على: ${track.title} لـ ${track.artist}`
            : `Identified: ${track.title} by ${track.artist}`
        );
        
        // Send the recognized track info to chat
        const message = language === 'ar'
          ? `لقد تعرفت على أغنية "${track.title}" للفنان ${track.artist} من ألبوم ${track.album || 'غير معروف'}.`
          : `I've identified the song "${track.title}" by ${track.artist} from the album ${track.album || 'unknown'}.`;
        
        onSendMessage(message);
      } else {
        toast.error(
          language === 'ar'
            ? 'لم أستطع التعرف على الموسيقى. حاول مرة أخرى.'
            : 'Could not identify the music. Try again.'
        );
      }
    } catch (error) {
      console.error('Music recognition error:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء التعرف على الموسيقى'
          : 'Error during music recognition'
      );
    } finally {
      setIsRecognizingMusic(false);
    }
  };
  
  const adjustVolume = () => {
    // Cycle through volume levels: 1.0 -> 0.7 -> 0.4 -> 0.1 -> 1.0
    const newVolume = volume <= 0.1 ? 1.0 : volume - 0.3;
    setVolume(parseFloat(newVolume.toFixed(1)));
    
    toast.info(
      language === 'ar'
        ? `مستوى الصوت: ${Math.round(newVolume * 100)}%`
        : `Volume: ${Math.round(newVolume * 100)}%`
    );
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
            {isMusicMode ? 
              (language === 'ar' ? 'وضع التعرف على الموسيقى نشط' : 'Music recognition mode active') :
              transcript || (
                isListening ? 
                  (language === 'ar' ? 'أنا أستمع...' : 'I\'m listening...') : 
                  (language === 'ar' ? 'اضغط على الميكروفون وابدأ الحديث' : 'Tap mic to speak')
              )
            }
          </div>
          
          {isMusicMode && (
            <MusicRecognition 
              onRecognizeMusic={handleRecognizeMusic}
              isRecognizing={isRecognizingMusic}
              recognizedTrack={recognizedTrack}
              disabled={callStatus !== 'active'}
            />
          )}
          
          <CallControls
            isListening={isListening}
            hasTranscript={!!transcript.trim()}
            callStatus={callStatus}
            onToggleMic={toggleListening}
            onSendMessage={handleSubmit}
            onToggleMusic={toggleMusicMode}
            isMusicMode={isMusicMode}
            onAdjustVolume={adjustVolume}
          />
          
          {volume < 1.0 && (
            <div className="mt-3 text-xs text-gray-500">
              {language === 'ar' ? `مستوى الصوت: ${Math.round(volume * 100)}%` : `Volume: ${Math.round(volume * 100)}%`}
            </div>
          )}
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default VoiceChat;
