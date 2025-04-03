
import React from 'react';
import { cn } from '@/lib/utils';
import { Mood } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface TranscriptDisplayProps {
  isListening: boolean;
  isMusicMode: boolean;
  transcript: string;
  mood: Mood;
  language: string;
  isProcessing?: boolean;
  error?: string | null;
}

const TranscriptDisplay = ({ 
  isListening, 
  isMusicMode, 
  transcript, 
  mood, 
  language, 
  isProcessing = false,
  error = null
}: TranscriptDisplayProps) => {
  // Helper function to get appropriate placeholder text
  const getPlaceholderText = () => {
    if (error) {
      return language === 'ar' ? 
        'يرجى السماح بإذن الميكروفون أو تجربة متصفح آخر' : 
        'Please allow microphone permission or try another browser';
    }

    if (isMusicMode) {
      return language === 'ar' ? 
        'وضع التعرف على الموسيقى نشط' : 
        'Music recognition mode active';
    }

    if (transcript) {
      return transcript;
    }

    if (isListening) {
      return language === 'ar' ? 
        'أنا أستمع... انطق الآن' : 
        'I\'m listening... speak now';
    }

    return language === 'ar' ? 
      'اضغط على الميكروفون وابدأ الحديث' : 
      'Tap mic to speak';
  };

  return (
    <div className={cn(
      "w-full p-4 mb-4 rounded-xl min-h-20 transition-all",
      mood === 'deep' || mood === 'focus' ? "bg-gray-800/50 text-white" : "bg-gray-100 text-gray-800",
      isListening && transcript ? "border-2 border-mimi-primary" : "",
      "flex flex-col items-center justify-center text-center"
    )}>
      {/* Show explicit transcript label when user is speaking */}
      {isListening && !isMusicMode && !error && (
        <div className={cn(
          "text-xs font-medium mb-1",
          mood === 'deep' || mood === 'focus' ? "text-gray-400" : "text-gray-500"
        )}>
          {language === 'ar' ? 'أنت تتحدث:' : 'You are saying:'}
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center text-red-500 mb-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">
            {language === 'ar' ? 'خطأ في التعرف على الصوت' : 'Speech recognition error'}
          </span>
        </div>
      )}
      
      {/* The actual transcript content */}
      <div className={cn("w-full", isListening && transcript ? "font-medium" : "")}>
        {getPlaceholderText()}
      </div>
      
      {/* Processing indicator */}
      {isProcessing && !isMusicMode && !error && (
        <div className="mt-2 text-xs text-mimi-primary font-medium">
          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
        </div>
      )}
      
      {/* Visual indicator for listening state */}
      {isListening && !isMusicMode && !error && (
        <div className="flex space-x-1 mt-2">
          <div className={cn(
            "w-2 h-2 bg-mimi-primary rounded-full animate-pulse",
            transcript ? "opacity-50" : "opacity-100"
          )}></div>
          <div className={cn(
            "w-2 h-2 bg-mimi-primary rounded-full animate-pulse delay-100",
            transcript ? "opacity-50" : "opacity-100"
          )}></div>
          <div className={cn(
            "w-2 h-2 bg-mimi-primary rounded-full animate-pulse delay-200",
            transcript ? "opacity-50" : "opacity-100"
          )}></div>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
