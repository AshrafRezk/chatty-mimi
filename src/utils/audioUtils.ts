
/**
 * Utility functions for audio processing
 */

// Convert audio data to WAV format for playback
export const createWavBlob = (pcmData: Float32Array, sampleRate = 44100): Blob => {
  // Convert Float32Array to Int16Array
  const int16Data = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Create WAV header
  const buffer = new ArrayBuffer(44 + int16Data.length * 2);
  const view = new DataView(buffer);
  
  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 32 + int16Data.length * 2, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, 1, true); // num channels (mono)
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.length * 2, true);
  
  // Write audio data
  const offset = 44;
  for (let i = 0; i < int16Data.length; i++) {
    view.setInt16(offset + i * 2, int16Data[i], true);
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
};

// Helper function to write a string to a DataView
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

// Play audio from Float32Array data
export const playAudioBuffer = async (audioData: Float32Array) => {
  try {
    const audioContext = new AudioContext();
    const audioBuffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
    
    // Fill the buffer with our audio data
    audioBuffer.getChannelData(0).set(audioData);
    
    // Create a buffer source and play it
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    
    return new Promise<void>((resolve) => {
      source.onended = () => {
        audioContext.close();
        resolve();
      };
    });
  } catch (error) {
    console.error('Error playing audio buffer:', error);
    throw error;
  }
};

// Detect silence in audio buffer to help with voice activity detection
export const detectSilence = (
  audioBuffer: Float32Array,
  silenceThreshold = 0.01,
  minSilenceDuration = 0.5,
  sampleRate = 44100
): boolean => {
  const bufferLength = audioBuffer.length;
  const minSilenceSamples = minSilenceDuration * sampleRate;
  let silentSamples = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    if (Math.abs(audioBuffer[i]) < silenceThreshold) {
      silentSamples++;
    } else {
      silentSamples = 0;
    }
    
    if (silentSamples >= minSilenceSamples) {
      return true;
    }
  }
  
  return false;
};

// Load audio files
export const loadAudio = (url: string): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    const audioContext = new AudioContext();
    
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        resolve(audioBuffer);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Play notification sounds
export const playNotificationSound = async (soundType: 'sent' | 'received') => {
  try {
    const soundUrl = soundType === 'sent' 
      ? '/sounds/message-sent.mp3' 
      : '/sounds/message-received.mp3';
    
    const audio = new Audio(soundUrl);
    await audio.play();
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};
