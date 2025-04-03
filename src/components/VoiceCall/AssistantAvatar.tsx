
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Persona, Mood } from '@/types';

interface AssistantAvatarProps {
  isSpeaking: boolean;
  mood: Mood;
  status: 'connecting' | 'active' | 'ended';
  persona?: Persona;
}

const AssistantAvatar = ({ isSpeaking, mood, status, persona = 'general' }: AssistantAvatarProps) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [mouthWidth, setMouthWidth] = useState(10);
  const [mouthHeight, setMouthHeight] = useState(1);
  const [eyeState, setEyeState] = useState<'open' | 'half' | 'closed'>('open');
  const [expressionType, setExpressionType] = useState<'neutral' | 'happy' | 'thinking' | 'surprised'>('neutral');
  
  // Set expression based on speaking status
  useEffect(() => {
    if (isSpeaking) {
      // Randomly change expressions while speaking to appear more human-like
      const expressions: ('neutral' | 'happy' | 'thinking' | 'surprised')[] = ['neutral', 'happy', 'thinking', 'surprised'];
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      setExpressionType(randomExpression);
    } else {
      setExpressionType('neutral');
    }
  }, [isSpeaking]);
  
  useEffect(() => {
    let mouthInterval: number | undefined;
    let blinkInterval: number | undefined;
    
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
      if (mouthInterval) window.clearInterval(mouthInterval);
      if (blinkInterval) window.clearInterval(blinkInterval);
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
  
  const getEyeExpression = () => {
    switch(expressionType) {
      case 'happy': 
        return {
          shape: 'rounded-b-full',
          height: `${getEyeHeight() * 0.8}px`,
          width: '10px'
        };
      case 'thinking':
        return {
          shape: 'rounded-full',
          height: `${getEyeHeight() * 0.7}px`,
          width: '8px'
        };
      case 'surprised':
        return {
          shape: 'rounded-full',
          height: `${getEyeHeight() * 1.5}px`,
          width: '12px'
        };
      default:
        return {
          shape: 'rounded-full',
          height: `${getEyeHeight()}px`,
          width: '10px'
        };
    }
  };
  
  const getMouthExpression = () => {
    if (!mouthOpen) {
      switch(expressionType) {
        case 'happy': 
          return {
            shape: 'rounded-t-full',
            height: '3px',
            width: '16px'
          };
        case 'thinking':
          return {
            shape: 'rounded-full',
            height: '2px',
            width: '8px',
            transform: 'translateX(-4px)'
          };
        case 'surprised':
          return {
            shape: 'rounded-full',
            height: '8px',
            width: '8px'
          };
        default:
          return {
            shape: 'rounded-full',
            height: '1px',
            width: '10px'
          };
      }
    }
    
    return {
      shape: 'rounded-full',
      height: `${mouthHeight}px`,
      width: `${mouthWidth}px`
    };
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
        return 'bg-gradient-to-b from-blue-100 to-blue-200';
      case 'medicine':
        return 'bg-gradient-to-b from-green-100 to-green-200';
      case 'architecture':
        return 'bg-gradient-to-b from-amber-100 to-amber-200';
      case 'finance':
        return 'bg-gradient-to-b from-emerald-100 to-emerald-200';
      case 'diet_coach':
        return 'bg-gradient-to-b from-lime-100 to-lime-200';
      case 'real_estate':
        return 'bg-gradient-to-b from-purple-100 to-purple-200';
      case 'education':
        return 'bg-gradient-to-b from-sky-100 to-sky-200';
      case 'legal':
        return 'bg-gradient-to-b from-indigo-100 to-indigo-200';
      case 'christianity':
        return 'bg-gradient-to-b from-yellow-100 to-yellow-200';
      case 'islam':
        return 'bg-gradient-to-b from-teal-100 to-teal-200';
      default:
        return 'bg-gradient-to-b from-mimi-100 to-mimi-200';
    }
  };
  
  const mouthExpression = getMouthExpression();
  const eyeExpression = getEyeExpression();
  
  return (
    <div className={cn(
      "relative rounded-full overflow-hidden w-32 h-32 mb-4",
      getBorderColor(),
      "border-4 shadow-lg",
      status === 'ended' ? "opacity-60" : "opacity-100",
      status === 'connecting' ? "animate-pulse" : ""
    )}>
      <Avatar className="w-full h-full">
        <AvatarImage src={getAvatarImage()} alt="AI Assistant" />
        <AvatarFallback className={getBackgroundGradient()}>
          {persona === 'software' ? (
            <div className="text-2xl">💻</div>
          ) : persona === 'medicine' ? (
            <div className="text-2xl">⚕️</div>
          ) : persona === 'architecture' ? (
            <div className="text-2xl">🏛️</div>
          ) : persona === 'finance' ? (
            <div className="text-2xl">📊</div>
          ) : persona === 'diet_coach' ? (
            <div className="text-2xl">🥗</div>
          ) : persona === 'real_estate' ? (
            <div className="text-2xl">🏠</div>
          ) : persona === 'education' ? (
            <div className="text-2xl">📚</div>
          ) : persona === 'legal' ? (
            <div className="text-2xl">⚖️</div>
          ) : persona === 'christianity' ? (
            <div className="text-2xl">✝️</div>
          ) : persona === 'islam' ? (
            <div className="text-2xl">☪️</div>
          ) : (
            <User className="w-12 h-12 text-mimi-primary" />
          )}
        </AvatarFallback>
      </Avatar>
      
      {/* Loading animation */}
      {getLoadingAnimation()}
      
      {/* Face features */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes */}
        <div className="flex justify-between w-16 mt-2">
          <div className={cn(
            eyeExpression.shape,
            "transition-all duration-150",
            mood === 'deep' || mood === 'focus' ? "bg-white" : "bg-gray-800"
          )}
          style={{
            width: eyeExpression.width,
            height: eyeExpression.height,
            transform: isSpeaking ? 'scaleY(1.1)' : 'scaleY(1)'
          }}
          />
          <div className={cn(
            eyeExpression.shape,
            "transition-all duration-150",
            mood === 'deep' || mood === 'focus' ? "bg-white" : "bg-gray-800"
          )}
          style={{
            width: eyeExpression.width,
            height: eyeExpression.height,
            transform: isSpeaking ? 'scaleY(1.1)' : 'scaleY(1)'
          }}
          />
        </div>
        
        {/* Animated mouth */}
        <div 
          className={cn(
            mouthExpression.shape,
            "transition-all duration-100",
            mood === 'deep' || mood === 'focus' ? "bg-white/90" : "bg-gray-800/90",
            "mt-8"
          )}
          style={{
            width: mouthExpression.width,
            height: mouthExpression.height,
            transform: mouthExpression.transform,
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
