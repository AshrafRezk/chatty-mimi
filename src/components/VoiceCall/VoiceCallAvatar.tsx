
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
        // Default to mood-based colors with a more masculine palette
        return mood === 'calm' ? 'border-mimi-primary' :
               mood === 'friendly' ? 'border-green-600' :
               mood === 'deep' ? 'border-mimi-dark' :
               mood === 'focus' ? 'border-mimi-aggro' : 'border-gray-600';
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
        // Default to mood-based colors with a more masculine palette
        return mood === 'calm' ? 'bg-mimi-softblue' :
               mood === 'friendly' ? 'bg-green-100' :
               mood === 'deep' ? 'bg-mimi-dark' :
               mood === 'focus' ? 'bg-mimi-aggro/10' : 'bg-gray-100';
    }
  };

  // Get persona display name
  const getPersonaName = () => {
    switch(persona) {
      case 'general': return 'M.I.M.I';
      case 'medicine': return 'Health AI';
      case 'architecture': return 'Architect AI';
      case 'software': return 'Code AI';
      case 'education': return 'Tutor AI';
      case 'finance': return 'Finance AI';
      case 'legal': return 'Legal AI';
      case 'diet_coach': return 'Nutrition AI';
      case 'real_estate': return 'Property AI';
      default: return 'M.I.M.I';
    }
  };

  return (
    <div className="relative mb-8 flex items-center space-x-4">
      {/* Main Avatar with Animated Face */}
      <Motion.div
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 1.5 }
        } : {}}
        className={cn(
          "h-32 w-32 rounded-md flex items-center justify-center shadow-lg border-2 relative",
          getBorderColor(),
          getBackgroundColor()
        )}
      >
        {/* Face Features */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex justify-between w-16 mt-4">
            <Motion.div 
              animate={isSpeaking ? {
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 2, repeatType: "reverse" }
              } : {}}
              className="w-6 h-3 bg-gray-800 rounded-full"
            />
            <Motion.div 
              animate={isSpeaking ? {
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 2, repeatType: "reverse", delay: 0.3 }
              } : {}}
              className="w-6 h-3 bg-gray-800 rounded-full"
            />
          </div>
          
          {/* Mouth */}
          <Motion.div 
            animate={isSpeaking ? {
              height: ["4px", "8px", "4px"],
              width: ["14px", "16px", "14px"],
              transition: { repeat: Infinity, duration: 0.5 }
            } : {}}
            className="w-14 h-1 bg-gray-800 rounded-full mt-8"
          />
        </div>

        {/* Persona Logo on Shirt */}
        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 shadow-sm">
          {getPersonaIcon()}
        </div>
      </Motion.div>
      
      {/* Persona Logo Badge */}
      <Motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={cn(
          "py-2 px-4 rounded-md shadow-md border",
          getBorderColor(),
          getBackgroundColor(),
          "flex flex-col items-center justify-center"
        )}
      >
        <div className="text-sm font-bold mb-1 text-gray-700">Powered by</div>
        <div className="text-xl font-bold tracking-wider text-mimi-primary">{getPersonaName()}</div>
        <div className="text-xs text-gray-500 mt-1">
          Modular Interactive<br/>Machine Intelligence
        </div>
      </Motion.div>
      
      {/* Speech indicator dots */}
      {isSpeaking && (
        <div className="absolute -bottom-3 left-16 transform -translate-x-1/2 flex space-x-1">
          <Motion.div
            animate={{ 
              y: [0, -10, 0], 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className={cn(
              "h-3 w-3 rounded-sm",
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
              "h-3 w-3 rounded-sm",
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
              "h-3 w-3 rounded-sm",
              mood === 'deep' || mood === 'focus' ? 'bg-white' : 'bg-mimi-primary'
            )}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceCallAvatar;
