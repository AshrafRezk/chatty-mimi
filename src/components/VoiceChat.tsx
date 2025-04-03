
import { useState, useEffect, useRef, useCallback } from 'react';
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
import VoiceCallAvatar from './VoiceCall/VoiceCallAvatar';
import TranscriptDisplay from './VoiceCall/TranscriptDisplay';

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
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{role: 'user' | 'assistant', text: string}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
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
    error
  } = useSpeechRecognition({ 
    language,
    autoStart: false,
    onAudioData: (data) => {
      if (isMusicMode) {
        audioDataRef.current = data;
      }
    },
    onTranscript: (text) => {
      // Update UI immediately with real-time transcription
      console.log("Transcript received:", text);
      setCurrentTranscript(text);
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
        
        // Add welcome message to transcript history
        const welcomeMessage = language === 'ar' 
          ? 'مرحباً بك في المكالمة الصوتية، كيف يمكنني مساعدتك اليوم؟'
          : 'Welcome to the voice call. How can I help you today?';
        
        setTranscriptHistory([{
          role: 'assistant',
          text: welcomeMessage
        }]);
        
        // Simulate AI speaking during welcome
        setIsSpeaking(true);
        
        // Simulate actual speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(welcomeMessage);
          utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
          utterance.volume = volume;
          utterance.onend = () => {
            setIsSpeaking(false);
          };
          window.speechSynthesis.speak(utterance);
        } else {
          // Fallback if speech synthesis not available
          setTimeout(() => setIsSpeaking(false), 3000);
        }
      }
    }, 1500);
    
    return () => {
      clearTimeout(connectionTimer);
    };
  }, [isSupported, language, startListening, volume]);
  
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
  
  // Update current transcript when main transcript changes
  useEffect(() => {
    setCurrentTranscript(transcript);
  }, [transcript]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopListening]);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      
      // If there's a valid transcript, submit it
      if (currentTranscript.trim()) {
        handleSubmit();
      }
    } else {
      setIsMusicMode(false);
      setRecognizedTrack(null);
      setCurrentTranscript('');
      resetTranscript();
      startListening();
    }
  }, [currentTranscript, isListening, resetTranscript, startListening, stopListening]);
  
  const handleSubmit = useCallback(async () => {
    if (currentTranscript.trim()) {
      // Play sending sound
      await playNotificationSound('sent');
      
      // Add user transcript to history
      setTranscriptHistory(prev => [...prev, {
        role: 'user',
        text: currentTranscript.trim()
      }]);
      
      // Send message
      onSendMessage(currentTranscript.trim());
      
      // Reset transcript and continue listening
      resetTranscript();
      setCurrentTranscript('');
      
      // Simulate AI thinking time
      setTimeout(() => {
        setIsSpeaking(true);
        
        // Simulate AI response time (1.5-3 seconds based on message length)
        const responseTime = Math.min(1500 + currentTranscript.length * 10, 3000);
        
        setTimeout(() => {
          // Generate simulated response
          const responses = [
            language === 'ar' ? 'بالطبع، سأساعدك في ذلك' : 'Of course, I can help you with that',
            language === 'ar' ? 'هذا سؤال مثير للاهتمام' : 'That\'s an interesting question',
            language === 'ar' ? 'دعني أبحث عن ذلك لك' : 'Let me look that up for you',
            language === 'ar' ? 'يسعدني مساعدتك' : 'I\'m happy to assist you'
          ];
          
          const responseIndex = Math.floor(Math.random() * responses.length);
          const aiResponse = responses[responseIndex];
          
          // Add AI response to transcript history
          setTranscriptHistory(prev => [...prev, {
            role: 'assistant',
            text: aiResponse
          }]);
          
          // Speak response using speech synthesis
          if ('speechSynthesis' in window) {
            try {
              const utterance = new SpeechSynthesisUtterance(aiResponse);
              utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
              utterance.volume = volume;
              
              utterance.onend = () => {
                setIsSpeaking(false);
                
                // Resume listening for user input
                if (callStatus === 'active' && isSupported) {
                  startListening();
                }
              };
              
              window.speechSynthesis.speak(utterance);
            } catch (err) {
              console.error("Speech synthesis error:", err);
              setIsSpeaking(false);
            }
          } else {
            // Fallback if speech synthesis not available
            setTimeout(() => {
              setIsSpeaking(false);
              
              // Resume listening
              if (callStatus === 'active' && isSupported) {
                startListening();
              }
            }, 2000);
          }
        }, responseTime);
      }, 500);
    }
  }, [callStatus, currentTranscript, isSupported, language, onSendMessage, resetTranscript, startListening, volume]);
  
  const handleEndCall = useCallback(() => {
    setCallStatus('ended');
    stopListening();
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Slight delay before closing modal
    setTimeout(() => {
      onClose();
    }, 500);
  }, [onClose, stopListening]);
  
  const toggleMusicMode = useCallback(() => {
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
  }, [isMusicMode, language]);
  
  const handleRecognizeMusic = useCallback(async () => {
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
        
        // Add music recognition result to transcript history
        setTranscriptHistory(prev => [...prev, {
          role: 'assistant',
          text: message
        }]);
        
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
  }, [isRecognizingMusic, language, onSendMessage]);
  
  const adjustVolume = useCallback(() => {
    // Cycle through volume levels: 1.0 -> 0.7 -> 0.4 -> 0.1 -> 1.0
    const newVolume = volume <= 0.1 ? 1.0 : volume - 0.3;
    setVolume(parseFloat(newVolume.toFixed(1)));
    
    toast.info(
      language === 'ar'
        ? `مستوى الصوت: ${Math.round(newVolume * 100)}%`
        : `Volume: ${Math.round(newVolume * 100)}%`
    );
  }, [language, volume]);
  
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
          <VoiceCallAvatar isSpeaking={isSpeaking} mood={mood} />
          
          <h2 className={cn(
            "text-xl font-semibold mb-2",
            mood === 'deep' || mood === 'focus' ? "text-white" : "text-gray-800"
          )}>
            {language === 'ar' ? 'مساعد ميمي' : 'Mimi Assistant'}
          </h2>
          
          <p className={cn(
            "text-sm mb-4",
            mood === 'deep' || mood === 'focus' ? "text-gray-300" : "text-gray-500"
          )}>
            {callStatus === 'connecting' ? 
              (language === 'ar' ? 'جارٍ الاتصال بالمساعد...' : 'Connecting to assistant...') :
              callStatus === 'active' ? 
                (language === 'ar' ? 'متصل الآن' : 'Call in progress') : 
                (language === 'ar' ? 'انتهى الاتصال' : 'Call ended')
            }
          </p>
          
          {/* Improved transcript display */}
          <TranscriptDisplay
            isListening={isListening}
            isMusicMode={isMusicMode}
            transcript={currentTranscript}
            mood={mood}
            language={language}
          />
          
          {/* Conversation history toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="mb-4 text-xs"
          >
            {showHistory ? 
              (language === 'ar' ? 'إخفاء المحادثة' : 'Hide Conversation') : 
              (language === 'ar' ? 'عرض المحادثة' : 'Show Conversation')
            }
          </Button>
          
          {/* Conversation history */}
          {showHistory && transcriptHistory.length > 0 && (
            <div className={cn(
              "w-full p-4 mb-4 rounded-xl max-h-40 overflow-y-auto",
              mood === 'deep' || mood === 'focus' ? "bg-gray-800/30 text-white" : "bg-gray-50 text-gray-800",
              "text-sm transition-all"
            )}>
              {transcriptHistory.map((item, index) => (
                <div key={index} className={cn(
                  "mb-2 py-1",
                  item.role === 'assistant' ? 'text-mimi-primary' : 'text-gray-700'
                )}>
                  <span className="font-semibold">
                    {item.role === 'assistant' ? 
                      (language === 'ar' ? 'المساعد: ' : 'Assistant: ') : 
                      (language === 'ar' ? 'أنت: ' : 'You: ')
                    }
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          )}
          
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
            hasTranscript={!!currentTranscript.trim()}
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
