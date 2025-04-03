
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
  
  useEffect(() => {
    let id: number;
    
    if (isSpeaking) {
      // Create a more natural speaking pattern with variable mouth shapes
      id = window.setInterval(() => {
        setMouthOpen(prev => !prev);
        // Randomize mouth shape for more natural animation
        setMouthWidth(8 + Math.random() * 4);
        setMouthHeight(1 + Math.random() * 4);
      }, 120);
    } else {
      setMouthOpen(false);
      setMouthWidth(10);
      setMouthHeight(1);
    }
    
    return () => window.clearInterval(id);
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
  
  return (
    <div className={cn(
      "relative rounded-full overflow-hidden w-32 h-32 mb-4",
      getBorderColor(),
      "border-2",
      status === 'ended' ? "opacity-60" : "opacity-100"
    )}>
      <Avatar className="w-full h-full">
        <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
        <AvatarFallback>
          <User className="w-12 h-12" />
        </AvatarFallback>
      </Avatar>
      
      {/* Face features */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes */}
        <div className="flex justify-between w-16 mt-2">
          <div className={cn(
            "w-4 h-2 rounded-full",
            mood === 'deep' || mood === 'focus' ? "bg-white" : "bg-gray-800",
            isSpeaking && "animate-blink"
          )}/>
          <div className={cn(
            "w-4 h-2 rounded-full",
            mood === 'deep' || mood === 'focus' ? "bg-white" : "bg-gray-800",
            isSpeaking && "animate-blink"
          )}/>
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
