
import React from 'react';
import { cn } from '@/lib/utils';
import { Motion } from '../ui/motion';
import { Mood } from '@/types';

interface VoiceCallAvatarProps {
  isSpeaking: boolean;
  mood: Mood;
}

const VoiceCallAvatar = ({ isSpeaking, mood }: VoiceCallAvatarProps) => {
  return (
    <div className="relative mb-8">
      <Motion.div
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 1.5 }
        } : {}}
        className={cn(
          "h-32 w-32 rounded-full flex items-center justify-center shadow-lg border-4",
          mood === 'calm' ? 'border-blue-300 bg-blue-50' :
          mood === 'friendly' ? 'border-green-300 bg-green-50' :
          mood === 'deep' ? 'border-purple-300 bg-purple-900' :
          mood === 'focus' ? 'border-orange-300 bg-orange-900' : 'border-gray-300 bg-gray-50'
        )}
      >
        <span className="text-5xl">M</span>
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
