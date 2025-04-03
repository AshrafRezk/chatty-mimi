
import { supabase } from '@/integrations/supabase/client';

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
    // Convert audio data for processing if needed
    const { data, error } = await supabase.functions.invoke('recognize-music', {
      body: { audio: audioBase64 }
    });

    if (error) {
      console.error('Music recognition error:', error);
      return null;
    }

    return data as RecognizedTrack;
  } catch (error) {
    console.error('Failed to recognize music:', error);
    return null;
  }
};

/**
 * Converts microphone audio buffer to base64 for API processing
 */
export const prepareAudioForRecognition = (audioBuffer: Float32Array): string => {
  // Convert Float32Array to Int16Array for more efficient encoding
  const intBuffer = new Int16Array(audioBuffer.length);
  for (let i = 0; i < audioBuffer.length; i++) {
    // Convert float values (-1.0 to 1.0) to int16 range
    intBuffer[i] = Math.max(-32768, Math.min(32767, Math.floor(audioBuffer[i] * 32767)));
  }
  
  // Convert to Uint8Array for base64 encoding
  const bytes = new Uint8Array(intBuffer.buffer);
  
  // Convert to base64
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
