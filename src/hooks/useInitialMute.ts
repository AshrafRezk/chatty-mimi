
import { useState, useEffect } from 'react';

/**
 * A custom hook to ensure the microphone starts in muted state
 * @param initialState - Optional override for the initial state
 * @returns [isMuted, setMuted] - State and setter for mute status
 */
export function useInitialMute(initialState: boolean = true): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [isMuted, setMuted] = useState(initialState);
  
  // Effect to ensure the mic is muted on component mount
  useEffect(() => {
    setMuted(true);
    
    return () => {
      // Optional cleanup if needed
    };
  }, []);
  
  return [isMuted, setMuted];
}

export default useInitialMute;
