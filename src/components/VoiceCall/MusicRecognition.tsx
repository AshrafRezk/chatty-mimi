
import { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { RecognizedTrack } from '@/utils/musicRecognition';
import { Button } from '../ui/button';
import { Music2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Motion } from '../ui/motion';

interface MusicRecognitionProps {
  onRecognizeMusic: () => void;
  isRecognizing: boolean;
  recognizedTrack: RecognizedTrack | null;
  disabled?: boolean;
}

const MusicRecognition = ({
  onRecognizeMusic,
  isRecognizing,
  recognizedTrack,
  disabled = false
}: MusicRecognitionProps) => {
  const { state } = useChat();
  const { language, mood } = state;

  const handleRecognize = () => {
    if (isRecognizing) return;
    onRecognizeMusic();
  };

  return (
    <div className="mt-4 w-full">
      <Button
        onClick={handleRecognize}
        disabled={disabled || isRecognizing}
        variant="outline"
        className={cn(
          "w-full flex gap-2 items-center justify-center",
          mood === 'deep' || mood === 'focus' ? "bg-gray-700 text-white border-gray-600" : "bg-white/80 text-gray-700"
        )}
      >
        {isRecognizing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{language === 'ar' ? 'يتم التعرف على الموسيقى...' : 'Listening for music...'}</span>
          </>
        ) : (
          <>
            <Music2 className="h-4 w-4" />
            <span>{language === 'ar' ? 'التعرف على الموسيقى' : 'Identify music'}</span>
          </>
        )}
      </Button>

      {recognizedTrack && (
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-3 p-3 rounded-lg flex items-center gap-3",
            mood === 'deep' || mood === 'focus' ? "bg-gray-800" : "bg-white/90"
          )}
        >
          {recognizedTrack.coverArt && (
            <img 
              src={recognizedTrack.coverArt} 
              alt={`${recognizedTrack.title} cover`}
              className="w-16 h-16 rounded object-cover"
            />
          )}
          <div className="flex flex-col">
            <h4 className={cn("font-semibold", mood === 'deep' || mood === 'focus' ? "text-white" : "text-gray-900")}>
              {recognizedTrack.title}
            </h4>
            <p className={cn(mood === 'deep' || mood === 'focus' ? "text-gray-300" : "text-gray-600")}>
              {recognizedTrack.artist}
            </p>
            {recognizedTrack.album && (
              <p className={cn("text-sm", mood === 'deep' || mood === 'focus' ? "text-gray-400" : "text-gray-500")}>
                {recognizedTrack.album} {recognizedTrack.releaseYear ? `(${recognizedTrack.releaseYear})` : ''}
              </p>
            )}
          </div>
        </Motion.div>
      )}
    </div>
  );
};

export default MusicRecognition;
