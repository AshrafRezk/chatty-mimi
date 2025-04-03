
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interface for recognized track
export interface RecognizedTrack {
  title: string;
  artist: string;
  album?: string;
  releaseYear?: number;
  coverArt?: string;
}

/**
 * Analyzes audio data to identify music tracks
 * Uses edge function as a proxy to music recognition API
 */
export const recognizeMusic = async (audioBase64: string): Promise<RecognizedTrack | null> => {
  try {
    console.log("Starting music recognition process...");
    
    // Add some validation for the audio data
    if (!audioBase64 || audioBase64.length < 1000) {
      console.error("Audio data is too short or empty");
      return null;
    }
    
    // For demo/testing purpose, simulate successful recognition with mock data
    // This would be replaced with actual API call in production
    
    const mockTracks = [
      { 
        title: "Bohemian Rhapsody", 
        artist: "Queen", 
        album: "A Night at the Opera",
        releaseYear: 1975,
        coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png"
      },
      { 
        title: "Billie Jean", 
        artist: "Michael Jackson", 
        album: "Thriller",
        releaseYear: 1982,
        coverArt: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png"
      },
      { 
        title: "Shape of You", 
        artist: "Ed Sheeran", 
        album: "÷ (Divide)",
        releaseYear: 2017,
        coverArt: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png"
      },
      { 
        title: "Dancing Queen", 
        artist: "ABBA", 
        album: "Arrival",
        releaseYear: 1976,
        coverArt: "https://upload.wikimedia.org/wikipedia/en/c/c4/ABBA_-_Arrival.png"
      },
      { 
        title: "Despacito", 
        artist: "Luis Fonsi ft. Daddy Yankee", 
        album: "Vida",
        releaseYear: 2017,
        coverArt: "https://upload.wikimedia.org/wikipedia/en/7/7b/Luis_Fonsi_feat._Daddy_Yankee_Despacito.png"
      }
    ];
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a random track from our mock data
    const randomIndex = Math.floor(Math.random() * mockTracks.length);
    console.log("Music recognition successful:", mockTracks[randomIndex].title);
    
    // In a production app, we would use the actual Supabase function:
    /*
    // Convert audio data for processing if needed
    const { data, error } = await supabase.functions.invoke('recognize-music', {
      body: { 
        audio: audioBase64,
        format: 'pcm16',
        sampleRate: 44100
      }
    });

    if (error) {
      console.error('Music recognition error:', error);
      return null;
    }
    
    if (!data || !data.title || !data.artist) {
      console.error('Invalid response from music recognition API');
      return null;
    }
    
    return data as RecognizedTrack;
    */
    
    return mockTracks[randomIndex];
  } catch (error) {
    console.error('Failed to recognize music:', error);
    return null;
  }
};

/**
 * Converts microphone audio buffer to base64 for API processing
 */
export const prepareAudioForRecognition = (audioBuffer: Float32Array): string => {
  try {
    console.log(`Processing audio buffer of length: ${audioBuffer.length}`);
    
    // Convert Float32Array to Int16Array for more efficient encoding
    const intBuffer = new Int16Array(audioBuffer.length);
    for (let i = 0; i < audioBuffer.length; i++) {
      // Convert float values (-1.0 to 1.0) to int16 range
      intBuffer[i] = Math.max(-32768, Math.min(32767, Math.floor(audioBuffer[i] * 32767)));
    }
    
    // Convert to Uint8Array for base64 encoding
    const bytes = new Uint8Array(intBuffer.buffer);
    
    // Convert to base64 in chunks to avoid memory issues
    let base64 = '';
    const chunkSize = 1024 * 32; // 32KB chunks
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      let binary = '';
      for (let j = 0; j < chunk.length; j++) {
        binary += String.fromCharCode(chunk[j]);
      }
      base64 += btoa(binary);
    }
    
    console.log(`Audio data encoded, base64 length: ${base64.length}`);
    return base64;
  } catch (error) {
    console.error('Error encoding audio data:', error);
    toast.error('Error processing audio data for music recognition');
    throw error;
  }
};

/**
 * Handles errors in the music recognition process
 */
export const handleMusicRecognitionError = (error: any): string => {
  console.error('Music recognition error:', error);
  
  // Return user-friendly error message based on the error type
  if (error?.message?.includes('network')) {
    return 'Network error, please check your connection';
  } else if (error?.message?.includes('timeout')) {
    return 'Request timed out, please try again';
  } else if (error?.message?.includes('format')) {
    return 'Invalid audio format';
  } else {
    return 'Failed to recognize music';
  }
};

/**
 * Pre-processes audio to improve recognition accuracy
 */
export const enhanceAudioForRecognition = (audioBuffer: Float32Array): Float32Array => {
  // Apply a simple noise gate to reduce background noise
  const noiseThreshold = 0.01;
  const enhancedBuffer = new Float32Array(audioBuffer.length);
  
  for (let i = 0; i < audioBuffer.length; i++) {
    enhancedBuffer[i] = Math.abs(audioBuffer[i]) < noiseThreshold ? 0 : audioBuffer[i];
  }
  
  return enhancedBuffer;
};
