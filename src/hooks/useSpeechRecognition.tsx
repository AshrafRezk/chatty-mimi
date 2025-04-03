
import { useState, useEffect, useRef, useCallback } from 'react';
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

  // Get speech recognition language code
  const getSpeechLanguageCode = useCallback((lang: string): string => {
    // Map language codes to speech recognition language codes
    switch (lang) {
      case 'ar': return 'ar-SA';
      case 'en': return 'en-US';
      default: return lang || navigator.language || 'en-US';
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
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    // Clear any timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setIsSupported(supported);
    
    if (supported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
        setError(event.error);
        
        // Only show toast for errors other than "no-speech"
        if (event.error !== 'no-speech') {
          toast.error('Speech recognition error. Please try again.');
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
        if (!isMountedRef.current) return;
        console.log("Speech recognition ended");
        // Only restart if we're not actively stopping it
        if (isListening) {
          try {
            console.log("Restarting speech recognition");
            recognitionRef.current?.start();
          } catch (e) {
            console.warn('Could not restart recognition', e);
          }
        }
      };
    } else {
      setError('Speech recognition not supported');
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
        
        // Create audio context
        audioContextRef.current = new AudioContext();
        
        // Create source node
        audioSourceRef.current = audioContextRef.current.createMediaStreamSource(audioStreamRef.current);
        
        // Create processor node - use at least 4096 buffer size to prevent audio glitches
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
      } catch (error) {
        console.error('Error setting up audio processing:', error);
        toast.error('Could not access microphone for audio processing');
      }
    };
    
    setupAudioProcessing();
    
    return () => {
      // Clean up audio processing resources
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      
      if (audioProcessorRef.current) {
        audioProcessorRef.current.disconnect();
        audioProcessorRef.current = null;
      }
      
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
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
        });
    } catch (error: any) {
      console.error('Error starting speech recognition', error);
      setError(error.message);
      toast.error('Error starting speech recognition');
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
