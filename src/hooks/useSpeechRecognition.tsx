
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

  // Initialize speech recognition
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
        console.log("Speech recognition result:", newTranscript);
        setTranscript(newTranscript);
        onTranscript?.(newTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(event.error);
        
        // Only show toast for errors other than "no-speech"
        if (event.error !== 'no-speech') {
          toast.error('Speech recognition error. Please try again.');
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
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
    } else if (!supported) {
      setError('Speech recognition not supported');
      toast.error('Speech recognition is not supported by your browser');
    }
    
    return () => {
      cleanupRecognition();
    };
  }, [language]);
  
  // Setup audio processing for music recognition if onAudioData is provided
  useEffect(() => {
    if (!onAudioData) return;
    
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
        toast.error('Could not access microphone for music recognition');
      }
    };
    
    if (isListening && onAudioData) {
      setupAudioProcessing();
    }
    
    return () => {
      cleanupAudioProcessing();
    };
  }, [isListening, onAudioData]);
  
  // Update recognition language if language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    }
  }, [language]);
  
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
  
  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      toast.error('Speech recognition is not supported');
      return;
    }
    
    setError(null);
    
    try {
      console.log("Starting speech recognition");
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error: any) {
      console.error('Error starting speech recognition', error);
      setError(error.message);
      toast.error('Error starting speech recognition');
    }
  };
  
  const stopListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      console.log("Stopping speech recognition");
      recognitionRef.current.stop();
      setIsListening(false);
      cleanupAudioProcessing();
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }
  };
  
  const resetTranscript = () => {
    console.log("Resetting transcript");
    setTranscript('');
  };
  
  const cleanupRecognition = () => {
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
  
  const cleanupAudioProcessing = () => {
    // Disconnect and clean up audio nodes
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
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };
  
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
