
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CallTimerProps {
  status: 'connecting' | 'active' | 'ended';
  language: string;
  mood: string;
}

const CallTimer = ({ status, language, mood }: CallTimerProps) => {
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Start timer if call is active
    if (status === 'active') {
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      // Clear timer if call is not active
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [status]);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="flex items-center">
      <span className={cn(
        "animate-pulse h-2 w-2 rounded-full mr-2",
        status === 'connecting' ? "bg-yellow-500" : 
        status === 'active' ? "bg-green-500" : "bg-red-500"
      )}></span>
      <span className={cn(
        "text-sm font-medium",
        mood === 'deep' || mood === 'focus' ? "text-white" : "text-gray-700"
      )}>
        {status === 'connecting' ? 
          (language === 'ar' ? 'جارٍ الاتصال...' : 'Connecting...') : 
          status === 'active' ? 
            formatDuration(duration) : 
            (language === 'ar' ? 'انتهى الاتصال' : 'Call ended')
        }
      </span>
    </div>
  );
};

export default CallTimer;
