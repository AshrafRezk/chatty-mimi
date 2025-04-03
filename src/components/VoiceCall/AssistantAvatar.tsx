
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface AssistantAvatarProps {
  isSpeaking: boolean;
  mood: string;
  status: 'connecting' | 'active' | 'ended';
}

const AssistantAvatar = ({ isSpeaking, mood, status }: AssistantAvatarProps) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [mouthWidth, setMouthWidth] = useState(10);
  const [mouthHeight, setMouthHeight] = useState(1);
  const [eyeState, setEyeState] = useState<'open' | 'half' | 'closed'>('open');
  
  useEffect(() => {
    let mouthInterval: number;
    let blinkInterval: number;
    
    if (isSpeaking) {
      // More dynamic speaking pattern with variable mouth shapes
      mouthInterval = window.setInterval(() => {
        setMouthOpen(prev => !prev);
        // Create more natural animation with variable mouth shapes
        setMouthWidth(8 + Math.random() * 8); // More variation
        setMouthHeight(2 + Math.random() * 6); // Increased height variation
      }, 100); // Slightly faster for more responsive animation
      
      // Add occasional blinking during speech
      blinkInterval = window.setInterval(() => {
        setEyeState('closed');
        setTimeout(() => setEyeState('half'), 80);
        setTimeout(() => setEyeState('open'), 160);
      }, 3000);
    } else {
      setMouthOpen(false);
      setMouthWidth(10);
      setMouthHeight(1);
      
      // Normal blinking pattern when not speaking
      blinkInterval = window.setInterval(() => {
        setEyeState('closed');
        setTimeout(() => setEyeState('half'), 60);
        setTimeout(() => setEyeState('open'), 120);
      }, 4000);
    }
    
    return () => {
      window.clearInterval(mouthInterval);
      window.clearInterval(blinkInterval);
    };
  }, [isSpeaking]);
  
  const getBorderColor = () => {
    switch(mood) {
      case 'calm': return 'border-blue-300';
      case 'friendly': return 'border-green-300';
      case 'deep': return 'border-purple-300';
      case 'focus': return 'border-orange-300';
      default: return 'border-gray-300';
    }
  };
  
  const getLoadingAnimation = () => {
    if (status === 'connecting') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-mimi-primary animate-spin"></div>
        </div>
      );
    }
    return null;
  };
  
  const getEyeHeight = () => {
    switch(eyeState) {
      case 'closed': return 0.5;
      case 'half': return 1;
      case 'open': return 2.5;
      default: return 2;
    }
  };
  
  return (
    <div className={cn(
      "relative rounded-full overflow-hidden w-32 h-32 mb-4",
      getBorderColor(),
      "border-4 shadow-lg",
      status === 'ended' ? "opacity-60" : "opacity-100",
      status === 'connecting' ? "animate-pulse" : ""
    )}>
      <Avatar className="w-full h-full">
        <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
        <AvatarFallback className="bg-gradient-to-b from-mimi-100 to-mimi-200">
          <User className="w-12 h-12 text-mimi-primary" />
        </AvatarFallback>
      </Avatar>
      
      {/* Loading animation */}
      {getLoadingAnimation()}
      
      {/* Face features */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes */}
        <div className="flex justify-between w-16 mt-2">
          <div className={cn(
            "rounded-full transition-all duration-150",
            mood === 'deep' || mood === 'focus' ? "bg-white" : "bg-gray-800"
          )}
          style={{
            width: '10px',
            height: `${getEyeHeight()}px`,
            transform: isSpeaking ? 'scaleY(1.1)' : 'scaleY(1)'
          }}
          />
          <div className={cn(
            "rounded-full transition-all duration-150",
            mood === 'deep' || mood === 'focus' ? "bg-white" : "bg-gray-800"
          )}
          style={{
            width: '10px',
            height: `${getEyeHeight()}px`,
            transform: isSpeaking ? 'scaleY(1.1)' : 'scaleY(1)'
          }}
          />
        </div>
        
        {/* Animated mouth */}
        <div 
          className={cn(
            "rounded-full transition-all duration-100",
            mood === 'deep' || mood === 'focus' ? "bg-white/90" : "bg-gray-800/90",
            "mt-8"
          )}
          style={{
            width: `${mouthWidth}px`,
            height: `${mouthOpen ? mouthHeight : 1}px`,
            borderRadius: mouthOpen ? '30%' : '50%'
          }}
        />
      </div>
      
      {/* Animation overlay effect */}
      {isSpeaking && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-mimi-primary/10 animate-pulse-slow" />
      )}
    </div>
  );
};

export default AssistantAvatar;
