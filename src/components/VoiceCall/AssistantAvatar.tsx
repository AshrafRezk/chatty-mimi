
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
  const [mouthWidth, setMouthWidth] = useState(10);
  const [mouthHeight, setMouthHeight] = useState(1);
  const [eyeState, setEyeState] = useState<'open' | 'half' | 'closed'>('open');
  const [eyeDirection, setEyeDirection] = useState<'center' | 'left' | 'right' | 'up' | 'down'>('center');
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
  
  // Enhanced eye and mouth animations
  useEffect(() => {
    let mouthInterval: number | undefined;
    let blinkInterval: number | undefined;
    let gazeInterval: number | undefined;
    
    if (isSpeaking) {
      // More dynamic speaking pattern with variable mouth shapes
      mouthInterval = window.setInterval(() => {
        setMouthOpen(prev => !prev);
        // Create more natural animation with variable mouth shapes
        setMouthWidth(8 + Math.random() * 10); // More variation for male appearance
        setMouthHeight(1 + Math.random() * 7); // Increased height variation
      }, 100); // Slightly faster for more responsive animation
      
      // Add occasional blinking during speech
      blinkInterval = window.setInterval(() => {
        setEyeState('closed');
        setTimeout(() => setEyeState('half'), 80);
        setTimeout(() => setEyeState('open'), 160);
      }, 3000);
      
      // Eye movement while speaking
      gazeInterval = window.setInterval(() => {
        const gazeDirections: ('center' | 'left' | 'right' | 'up' | 'down')[] = 
          ['center', 'center', 'center', 'left', 'right', 'up', 'down']; // Weighted toward center
        const randomDirection = gazeDirections[Math.floor(Math.random() * gazeDirections.length)];
        setEyeDirection(randomDirection);
      }, 2000);
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
      
      // Occasional eye movement when not speaking
      gazeInterval = window.setInterval(() => {
        const gazeDirections: ('center' | 'left' | 'right')[] = ['center', 'center', 'center', 'left', 'right'];
        const randomDirection = gazeDirections[Math.floor(Math.random() * gazeDirections.length)];
        setEyeDirection(randomDirection as 'center' | 'left' | 'right' | 'up' | 'down');
      }, 3000);
    }
    
    return () => {
      if (mouthInterval) window.clearInterval(mouthInterval);
      if (blinkInterval) window.clearInterval(blinkInterval);
      if (gazeInterval) window.clearInterval(gazeInterval);
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
  
  const getEyeTransform = () => {
    switch(eyeDirection) {
      case 'left': return 'translateX(-3px)';
      case 'right': return 'translateX(3px)';
      case 'up': return 'translateY(-2px)';
      case 'down': return 'translateY(2px)';
      default: return 'translate(0, 0)';
    }
  };
  
  const getEyeExpression = () => {
    switch(expressionType) {
      case 'happy': 
        return {
          shape: 'rounded-b-full',
          height: `${getEyeHeight() * 0.8}px`,
          width: '10px',
          transform: getEyeTransform()
        };
      case 'thinking':
        return {
          shape: 'rounded-full',
          height: `${getEyeHeight() * 0.7}px`,
          width: '8px',
          transform: getEyeTransform()
        };
      case 'surprised':
        return {
          shape: 'rounded-full',
          height: `${getEyeHeight() * 1.5}px`,
          width: '12px',
          transform: getEyeTransform()
        };
      default:
        return {
          shape: 'rounded-full',
          height: `${getEyeHeight()}px`,
          width: '10px',
          transform: getEyeTransform()
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
            height: '2px',
            width: '14px'
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
      case 'christianity':
        return 'bg-gradient-to-b from-blue-200 to-blue-400';
      case 'islam':
        return 'bg-gradient-to-b from-teal-200 to-teal-400';
      default:
        return 'bg-gradient-to-b from-blue-100 to-blue-300';
    }
  };
  
  const mouthExpression = getMouthExpression();
  const eyeExpression = getEyeExpression();
  
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
      
      {/* Face features with enhanced animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyebrows - more pronounced for masculine look */}
        <div className="flex justify-between w-16 mb-1">
          <Motion.div 
            animate={isSpeaking ? {
              y: expressionType === 'surprised' ? -2 : expressionType === 'thinking' ? -1 : 0
            } : {}}
            className="w-10 h-1.5 bg-gray-800 rounded-full"
            style={{ marginLeft: '-8px' }}
          />
          <Motion.div 
            animate={isSpeaking ? {
              y: expressionType === 'surprised' ? -2 : expressionType === 'thinking' ? 1 : 0
            } : {}}
            className="w-10 h-1.5 bg-gray-800 rounded-full"
            style={{ marginRight: '-8px' }}
          />
        </div>
        
        {/* Eyes - with movement */}
        <div className="flex justify-between w-16 mt-1">
          <Motion.div
            animate={isSpeaking ? {
              scale: eyeState === 'closed' ? 0.8 : 1
            } : {}}
            className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full"
          >
            <div className={cn(
              eyeExpression.shape,
              "transition-all duration-150",
              "bg-gray-800"
            )}
            style={{
              width: eyeExpression.width,
              height: eyeExpression.height,
              transform: eyeExpression.transform
            }}
            />
          </Motion.div>
          
          <Motion.div
            animate={isSpeaking ? {
              scale: eyeState === 'closed' ? 0.8 : 1
            } : {}}
            className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full"
          >
            <div className={cn(
              eyeExpression.shape,
              "transition-all duration-150",
              "bg-gray-800"
            )}
            style={{
              width: eyeExpression.width,
              height: eyeExpression.height,
              transform: eyeExpression.transform
            }}
            />
          </Motion.div>
        </div>
        
        {/* Animated mouth */}
        <Motion.div 
          animate={mouthOpen ? {
            scaleY: [1, 1.2, 1],
            transition: { repeat: Infinity, duration: 0.3 }
          } : {}}
          className={cn(
            mouthExpression.shape,
            "transition-all duration-100",
            "bg-gray-800/90",
            "mt-6"
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
    </Motion.div>
  );
};

export default AssistantAvatar;
