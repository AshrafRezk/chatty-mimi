
import React from 'react';
import { cn } from '@/lib/utils';
import { Motion } from '../ui/motion';
import { Mood, Persona } from '@/types';
import { 
  User, 
  HeartPulse, 
  Building2, 
  Code2, 
  BookOpen, 
  BarChart4, 
  Gavel, 
  Scale, 
  Salad, 
  Home 
} from 'lucide-react';

interface VoiceCallAvatarProps {
  isSpeaking: boolean;
  mood: Mood;
  persona?: Persona;
}

const VoiceCallAvatar = ({ isSpeaking, mood, persona = 'general' }: VoiceCallAvatarProps) => {
  // Get persona-specific icon
  const getPersonaIcon = () => {
    switch(persona) {
      case 'general': return <User className="h-12 w-12 text-mimi-primary" />;
      case 'medicine': return <HeartPulse className="h-12 w-12 text-red-500" />;
      case 'architecture': return <Building2 className="h-12 w-12 text-blue-500" />;
      case 'software': return <Code2 className="h-12 w-12 text-green-500" />;
      case 'education': return <BookOpen className="h-12 w-12 text-yellow-500" />;
      case 'finance': return <BarChart4 className="h-12 w-12 text-purple-500" />;
      case 'legal': return <Gavel className="h-12 w-12 text-amber-700" />;
      case 'diet_coach': return <Salad className="h-12 w-12 text-emerald-500" />;
      case 'real_estate': return <Home className="h-12 w-12 text-cyan-500" />;
      default: return <User className="h-12 w-12 text-mimi-primary" />;
    }
  };

  // Get persona-specific border color
  const getBorderColor = () => {
    switch(persona) {
      case 'medicine': return 'border-red-300';
      case 'architecture': return 'border-blue-300';
      case 'software': return 'border-green-300';
      case 'education': return 'border-yellow-300';
      case 'finance': return 'border-purple-300';
      case 'legal': return 'border-amber-300';
      case 'diet_coach': return 'border-emerald-300';
      case 'real_estate': return 'border-cyan-300';
      default:
        // Default to mood-based colors
        return mood === 'calm' ? 'border-blue-300' :
               mood === 'friendly' ? 'border-green-300' :
               mood === 'deep' ? 'border-purple-300' :
               mood === 'focus' ? 'border-orange-300' : 'border-gray-300';
    }
  };

  // Get persona-specific background color
  const getBackgroundColor = () => {
    switch(persona) {
      case 'medicine': return 'bg-red-50';
      case 'architecture': return 'bg-blue-50';
      case 'software': return 'bg-green-50';
      case 'education': return 'bg-yellow-50';
      case 'finance': return 'bg-purple-50';
      case 'legal': return 'bg-amber-50';
      case 'diet_coach': return 'bg-emerald-50';
      case 'real_estate': return 'bg-cyan-50';
      default:
        // Default to mood-based colors
        return mood === 'calm' ? 'bg-blue-50' :
               mood === 'friendly' ? 'bg-green-50' :
               mood === 'deep' ? 'bg-purple-900' :
               mood === 'focus' ? 'bg-orange-900' : 'bg-gray-50';
    }
  };

  return (
    <div className="relative mb-8">
      <Motion.div
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 1.5 }
        } : {}}
        className={cn(
          "h-32 w-32 rounded-full flex items-center justify-center shadow-lg border-4",
          getBorderColor(),
          getBackgroundColor()
        )}
      >
        <div className="flex items-center justify-center">
          {getPersonaIcon()}
        </div>
      </Motion.div>
      
      {/* Speech indicator dots */}
      {isSpeaking && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <Motion.div
            animate={{ 
              y: [0, -10, 0], 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className={cn(
              "h-3 w-3 rounded-full",
              mood === 'deep' || mood === 'focus' ? 'bg-white' : 'bg-mimi-primary'
            )}
          />
          <Motion.div
            animate={{ 
              y: [0, -8, 0], 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className={cn(
              "h-3 w-3 rounded-full",
              mood === 'deep' || mood === 'focus' ? 'bg-white' : 'bg-mimi-primary'
            )}
          />
          <Motion.div
            animate={{ 
              y: [0, -12, 0], 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className={cn(
              "h-3 w-3 rounded-full",
              mood === 'deep' || mood === 'focus' ? 'bg-white' : 'bg-mimi-primary'
            )}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceCallAvatar;
