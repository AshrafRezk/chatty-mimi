
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
  
  useEffect(() => {
    const id = setInterval(() => {
      if (isSpeaking) {
        setMouthOpen(prev => !prev);
      } else {
        setMouthOpen(false);
      }
    }, 150);
    
    return () => clearInterval(id);
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
      
      {/* Simple mouth animation */}
      <div className={cn(
        "absolute bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-2 rounded-full transition-all duration-150",
        mood === 'deep' || mood === 'focus' ? "bg-white/70" : "bg-gray-800/70",
        mouthOpen ? "h-4 rounded-full" : "h-1"
      )}/>
    </div>
  );
};

export default AssistantAvatar;
