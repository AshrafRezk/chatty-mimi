
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Persona, Mood } from '@/types';
import { Motion } from '../ui/motion';

interface AssistantAvatarProps {
  isSpeaking: boolean;
  mood: Mood;
  status: 'connecting' | 'active' | 'ended';
  persona?: Persona;
}

const AssistantAvatar = ({ isSpeaking, mood, status, persona = 'general' }: AssistantAvatarProps) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [eyeState, setEyeState] = useState<'open' | 'half' | 'closed'>('open');
  
  // Simpler mouth animation when speaking
  useEffect(() => {
    let mouthInterval: number | undefined;
    let blinkInterval: number | undefined;
    
    if (isSpeaking) {
      // Simple mouth open/close animation
      mouthInterval = window.setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 200);
      
      // Occasional blinking
      blinkInterval = window.setInterval(() => {
        setEyeState('closed');
        setTimeout(() => setEyeState('half'), 80);
        setTimeout(() => setEyeState('open'), 160);
      }, 4000);
    } else {
      setMouthOpen(false);
      
      // Less frequent blinking when not speaking
      blinkInterval = window.setInterval(() => {
        setEyeState('closed');
        setTimeout(() => setEyeState('half'), 60);
        setTimeout(() => setEyeState('open'), 120);
      }, 6000);
    }
    
    return () => {
      if (mouthInterval) window.clearInterval(mouthInterval);
      if (blinkInterval) window.clearInterval(blinkInterval);
    };
  }, [isSpeaking]);
  
  const getBorderColor = () => {
    switch(mood) {
      case 'calm': return 'border-blue-400';
      case 'friendly': return 'border-green-400';
      case 'deep': return 'border-blue-600';
      case 'focus': return 'border-blue-800';
      default: return 'border-blue-500';
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
      case 'half': return 2;
      case 'open': return 4;
      default: return 3;
    }
  };
  
  const getAvatarImage = () => {
    // Return persona-specific avatar image
    switch(persona) {
      case 'software':
        return "/placeholder.svg";
      case 'medicine':
        return "/placeholder.svg";
      case 'diet_coach':
        return "/placeholder.svg";
      case 'real_estate':
        return "/placeholder.svg";
      default:
        return "/placeholder.svg";
    }
  };
  
  const getBackgroundGradient = () => {
    switch(persona) {
      case 'software':
        return 'bg-gradient-to-b from-blue-100 to-blue-300';
      case 'medicine':
        return 'bg-gradient-to-b from-blue-200 to-blue-400';
      case 'architecture':
        return 'bg-gradient-to-b from-slate-100 to-slate-300';
      case 'finance':
        return 'bg-gradient-to-b from-blue-700 to-blue-900';
      case 'diet_coach':
        return 'bg-gradient-to-b from-teal-100 to-teal-300';
      case 'real_estate':
        return 'bg-gradient-to-b from-indigo-100 to-indigo-300';
      case 'education':
        return 'bg-gradient-to-b from-sky-100 to-sky-300';
      case 'legal':
        return 'bg-gradient-to-b from-slate-200 to-slate-400';
      default:
        return 'bg-gradient-to-b from-blue-100 to-blue-300';
    }
  };
  
  // Get persona icon for the badge
  const getPersonaIcon = () => {
    switch(persona) {
      case 'software': return '💻';
      case 'medicine': return '⚕️';
      case 'architecture': return '🏛️';
      case 'finance': return '📊';
      case 'diet_coach': return '🥗';
      case 'real_estate': return '🏠';
      case 'education': return '📚';
      case 'legal': return '⚖️';
      default: return '🤖';
    }
  };
  
  return (
    <Motion.div 
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-full overflow-hidden w-32 h-32 mb-4",
        getBorderColor(),
        "border-4 shadow-lg",
        status === 'ended' ? "opacity-60" : "opacity-100",
        status === 'connecting' ? "animate-pulse" : ""
      )}
    >
      <Avatar className="w-full h-full">
        <AvatarImage src={getAvatarImage()} alt="M.I.M.I Assistant" />
        <AvatarFallback className={getBackgroundGradient()}>
          <User className="w-12 h-12 text-mimi-primary" />
        </AvatarFallback>
      </Avatar>
      
      {/* Loading animation */}
      {getLoadingAnimation()}
      
      {/* Face features with minimal animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes */}
        <div className="flex justify-between w-16 mt-1">
          <div 
            className="relative flex items-center justify-center w-6 h-6 bg-white rounded-full"
          >
            <div className="transition-all duration-150 bg-gray-800 rounded-full"
              style={{
                width: '8px',
                height: `${getEyeHeight()}px`,
              }}
            />
          </div>
          
          <div 
            className="relative flex items-center justify-center w-6 h-6 bg-white rounded-full"
          >
            <div className="transition-all duration-150 bg-gray-800 rounded-full"
              style={{
                width: '8px',
                height: `${getEyeHeight()}px`,
              }}
            />
          </div>
        </div>
        
        {/* Simplified mouth */}
        <div 
          className="bg-gray-800/90 rounded-full mt-4 transition-all duration-100"
          style={{
            width: mouthOpen ? '14px' : '10px',
            height: mouthOpen ? '8px' : '2px',
          }}
        />
      </div>
      
      {/* Persona Badge on Shirt */}
      <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-lg">
        {getPersonaIcon()}
      </div>
      
      {/* Animation overlay effect */}
      {isSpeaking && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-mimi-primary/10 animate-pulse-slow" />
      )}
    </Motion.div>
  );
};

export default AssistantAvatar;
