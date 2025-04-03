
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// Add global type definitions for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }
}

interface UseSpeechRecognitionProps {
  language: string;
  onTranscript?: (transcript: string) => void;
  onAudioData?: (audioData: Float32Array) => void;
  autoStart?: boolean;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  audioBuffer: Float32Array | null;
  error: string | null;
}

/**
 * Custom hook for speech recognition functionality
 */
const useSpeechRecognition = ({
  language,
  onTranscript,
  onAudioData,
  autoStart = false
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<Float32Array | null>(null);
  
  const recognitionRef = useRef<any | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const silenceTimeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const recognitionRestartAttempts = useRef(0);

  // Get speech recognition language code
  const getSpeechLanguageCode = useCallback((lang: string): string => {
    // Map language codes to speech recognition language codes
    switch (lang) {
      case 'ar': return 'ar-SA';
      case 'en': return 'en-US';
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'de': return 'de-DE';
      case 'it': return 'it-IT';
      case 'pt': return 'pt-PT';
      case 'ru': return 'ru-RU';
      case 'zh': return 'zh-CN';
      case 'ja': return 'ja-JP';
      case 'ko': return 'ko-KR';
      case 'tr': return 'tr-TR';
      case 'no': return 'no-NO';
      default: return navigator.language || 'en-US';
    }
  }, []);

  // Clean up resources
  const cleanupResources = useCallback(() => {
    // Clean up recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
    }

    // Clean up audio processing
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.disconnect();
      } catch (e) {
        console.warn('Error disconnecting audio source:', e);
      }
      audioSourceRef.current = null;
    }
    
    if (audioProcessorRef.current) {
      try {
        audioProcessorRef.current.disconnect();
      } catch (e) {
        console.warn('Error disconnecting audio processor:', e);
      }
      audioProcessorRef.current = null;
    }
    
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn('Error stopping audio tracks:', e);
      }
      audioStreamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close().catch(console.error);
      } catch (e) {
        console.warn('Error closing audio context:', e);
      }
      audioContextRef.current = null;
    }

    // Clear any timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Reset restart attempts
    recognitionRestartAttempts.current = 0;
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    // Check which speech recognition API is supported
    const SpeechRecognition = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition || 
      window.mozSpeechRecognition || 
      window.msSpeechRecognition;
      
    const supported = !!SpeechRecognition;
    setIsSupported(supported);
    
    if (supported) {
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition parameters
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set language
      const speechLang = getSpeechLanguageCode(language);
      recognitionRef.current.lang = speechLang;
      console.log("Speech recognition initialized with language:", speechLang);
      
      // Setup event handlers
      recognitionRef.current.onresult = (event: any) => {
        if (!isMountedRef.current) return;
        
        let interimTranscript = '';
        let finalTranscript = finalTranscriptRef.current;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            finalTranscriptRef.current = finalTranscript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript + interimTranscript;
        console.log("Speech recognition transcript:", fullTranscript);
        setTranscript(fullTranscript);
        
        if (onTranscript) {
          onTranscript(fullTranscript);
        }
        
        // Reset silence timeout when voice is detected
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        // Set a new silence timeout (2 seconds)
        silenceTimeoutRef.current = window.setTimeout(() => {
          console.log("Silence detected - 2 seconds of no speech");
        }, 2000);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        if (!isMountedRef.current) return;
        console.error('Speech recognition error', event.error);
        
        // Handle specific error types
        if (event.error === 'not-allowed') {
          setError('microphone-permission');
          toast.error('Microphone permission denied. Please check browser settings.');
        } else if (event.error === 'network') {
          setError('network');
          toast.error('Network error. Please check your connection.');
        } else if (event.error !== 'no-speech') {
          setError(event.error);
          toast.error('Speech recognition error. Please try again.');
        }
        
        // Only stop listening on critical errors
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
        if (!isMountedRef.current) return;
        console.log("Speech recognition ended");
        
        // Only restart if we're not actively stopping it
        if (isListening && recognitionRestartAttempts.current < 5) {
          try {
            console.log("Restarting speech recognition, attempt:", recognitionRestartAttempts.current + 1);
            recognitionRestartAttempts.current += 1;
            
            // Add a small delay before restarting to avoid rapid restarts
            setTimeout(() => {
              if (isMountedRef.current && isListening) {
                try {
                  recognitionRef.current?.start();
                } catch (e) {
                  console.warn('Could not restart recognition', e);
                  setIsListening(false);
                }
              }
            }, 300);
          } catch (e) {
            console.warn('Could not schedule recognition restart', e);
            setIsListening(false);
          }
        } else if (recognitionRestartAttempts.current >= 5) {
          console.warn('Too many restart attempts, stopping recognition');
          setIsListening(false);
          setError('too-many-restarts');
          toast.error('Speech recognition failed after multiple attempts');
        }
      };
    } else {
      setError('not-supported');
      toast.error('Speech recognition is not supported by your browser');
    }
    
    return () => {
      isMountedRef.current = false;
      cleanupResources();
    };
  }, [language, getSpeechLanguageCode, cleanupResources]);
  
  // Update recognition language if language changes
  useEffect(() => {
    if (recognitionRef.current) {
      const speechLang = getSpeechLanguageCode(language);
      recognitionRef.current.lang = speechLang;
      console.log("Speech recognition language updated:", speechLang);
    }
  }, [language, getSpeechLanguageCode]);
  
  // Setup audio processing for music recognition if onAudioData is provided
  useEffect(() => {
    if (!onAudioData || !isListening) return;
    
    const setupAudioProcessing = async () => {
      try {
        console.log("Setting up audio processing");
        
        // Get microphone access
        audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // Create audio context with fallbacks
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) {
          console.error("AudioContext not supported");
          return;
        }
        
        audioContextRef.current = new AudioContext();
        
        // Create source node
        audioSourceRef.current = audioContextRef.current.createMediaStreamSource(audioStreamRef.current);
        
        // Use ScriptProcessor for broader compatibility but prepare for worklet transition
        // ScriptProcessor is deprecated but still has wider browser support
        audioProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        // Process audio data
        audioProcessorRef.current.onaudioprocess = (e) => {
          if (!isMountedRef.current) return;
          const inputData = e.inputBuffer.getChannelData(0);
          setAudioBuffer(new Float32Array(inputData));
          
          // Pass audio data to parent component
          onAudioData(new Float32Array(inputData));
        };
        
        // Connect nodes
        audioSourceRef.current.connect(audioProcessorRef.current);
        audioProcessorRef.current.connect(audioContextRef.current.destination);
        
        console.log("Audio processing setup complete");
      } catch (error: any) {
        console.error('Error setting up audio processing:', error);
        
        if (error.name === 'NotAllowedError') {
          toast.error('Microphone access denied. Please check your browser settings.');
          setError('microphone-permission');
        } else if (error.name === 'NotFoundError') {
          toast.error('No microphone detected. Please check your device.');
          setError('no-microphone');
        } else {
          toast.error('Could not access microphone for audio processing');
          setError('audio-setup-failed');
        }
      }
    };
    
    setupAudioProcessing();
    
    return () => {
      // Clean up audio processing resources
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.disconnect();
        } catch (e) {}
        audioSourceRef.current = null;
      }
      
      if (audioProcessorRef.current) {
        try {
          audioProcessorRef.current.disconnect();
        } catch (e) {}
        audioProcessorRef.current = null;
      }
      
      if (audioStreamRef.current) {
        try {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
        audioStreamRef.current = null;
      }
      
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close().catch(console.error);
        } catch (e) {}
        audioContextRef.current = null;
      }
    };
  }, [isListening, onAudioData]);
  
  // Handle autostart
  useEffect(() => {
    if (autoStart && isSupported && !isListening) {
      startListening();
    }
    
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [autoStart, isSupported]);
  
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      toast.error('Speech recognition is not supported');
      return;
    }
    
    setError(null);
    recognitionRestartAttempts.current = 0;
    
    try {
      console.log("Starting speech recognition");
      recognitionRef.current.start();
      setIsListening(true);
      
      // Don't clear transcript when restarting after a pause
      if (!transcript) {
        setTranscript(''); // Clear transcript when starting fresh
        finalTranscriptRef.current = ''; // Reset final transcript reference
      }
      
      // Request microphone access explicitly to ensure permissions
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log("Microphone permission granted");
          
          // Add a visual toast to show listening has started
          toast.success(language === 'ar' ? 'بدأ الاستماع' : 'Listening started', {
            duration: 2000,
          });
        })
        .catch(err => {
          console.error("Microphone permission denied:", err);
          toast.error(language === 'ar' ? 'تم رفض إذن الميكروفون' : 'Microphone permission denied');
          setIsListening(false);
          setError('microphone-permission');
        });
    } catch (error: any) {
      console.error('Error starting speech recognition', error);
      setError(error.message || 'start-failed');
      toast.error('Error starting speech recognition');
      setIsListening(false);
    }
  }, [isSupported, language, transcript]);
  
  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      console.log("Stopping speech recognition");
      recognitionRef.current.stop();
      setIsListening(false);
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }
  }, [isSupported]);
  
  const resetTranscript = useCallback(() => {
    console.log("Resetting transcript");
    setTranscript('');
    finalTranscriptRef.current = '';
  }, []);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    audioBuffer,
    error
  };
};

export default useSpeechRecognition;
