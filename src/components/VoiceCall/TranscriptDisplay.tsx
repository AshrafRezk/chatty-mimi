
import React from 'react';
import { cn } from '@/lib/utils';
import { Mood } from '@/types';

interface TranscriptDisplayProps {
  isListening: boolean;
  isMusicMode: boolean;
  transcript: string;
  mood: Mood;
  language: string;
  isProcessing?: boolean;
}

const TranscriptDisplay = ({ 
  isListening, 
  isMusicMode, 
  transcript, 
  mood, 
  language, 
  isProcessing = false 
}: TranscriptDisplayProps) => {
  return (
    <div className={cn(
      "w-full p-4 mb-4 rounded-xl min-h-20 transition-all",
      mood === 'deep' || mood === 'focus' ? "bg-gray-800/50 text-white" : "bg-gray-100 text-gray-800",
      isListening && transcript ? "border-2 border-mimi-primary" : "",
      "flex flex-col items-center justify-center text-center"
    )}>
      {/* Show explicit transcript label when user is speaking */}
      {isListening && !isMusicMode && (
        <div className={cn(
          "text-xs font-medium mb-1",
          mood === 'deep' || mood === 'focus' ? "text-gray-400" : "text-gray-500"
        )}>
          {language === 'ar' ? 'أنت تتحدث:' : 'You are saying:'}
        </div>
      )}
      
      {/* The actual transcript content */}
      <div className={cn("w-full", isListening && transcript ? "font-medium" : "")}>
        {isMusicMode ? 
          (language === 'ar' ? 'وضع التعرف على الموسيقى نشط' : 'Music recognition mode active') :
          transcript || (
            isListening ? 
              (language === 'ar' ? 'أنا أستمع... انطق الآن' : 'I\'m listening... speak now') : 
              (language === 'ar' ? 'اضغط على الميكروفون وابدأ الحديث' : 'Tap mic to speak')
          )
        }
      </div>
      
      {/* Processing indicator */}
      {isProcessing && !isMusicMode && (
        <div className="mt-2 text-xs text-mimi-primary font-medium">
          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
        </div>
      )}
      
      {/* Visual indicator for listening state */}
      {isListening && !isMusicMode && !transcript && (
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-mimi-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-mimi-primary rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-mimi-primary rounded-full animate-pulse delay-200"></div>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
