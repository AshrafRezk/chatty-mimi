
import { Mic, MicOff, Send, Volume2, Music2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface CallControlsProps {
  isListening: boolean;
  hasTranscript: boolean;
  callStatus: 'connecting' | 'active' | 'ended';
  onToggleMic: () => void;
  onSendMessage: () => void;
  onToggleMusic?: () => void;
  isMusicMode?: boolean;
  onAdjustVolume?: () => void;
}

const CallControls = ({
  isListening,
  hasTranscript,
  callStatus,
  onToggleMic,
  onSendMessage,
  onToggleMusic,
  isMusicMode = false,
  onAdjustVolume
}: CallControlsProps) => {
  return (
    <div className="flex gap-4">
      {/* Send Message Button - Now First */}
      <Button
        onClick={onSendMessage}
        disabled={callStatus !== 'active' || !hasTranscript}
        className={cn(
          "rounded-full h-16 w-16 flex items-center justify-center bg-green-500 hover:bg-green-600",
          "disabled:bg-gray-300 disabled:opacity-50"
        )}
        aria-label="Send message"
        title="Send message"
      >
        <Send size={24} />
      </Button>
      
      {/* Microphone Button - Now Second */}
      <Button
        onClick={onToggleMic}
        disabled={callStatus !== 'active'}
        className={cn(
          "rounded-full h-16 w-16 flex items-center justify-center transition-all",
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600",
          callStatus !== 'active' && "opacity-50"
        )}
        aria-label={isListening ? "Stop microphone" : "Start microphone"}
        title={isListening ? "Stop microphone" : "Start microphone"}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </Button>
      
      {/* Audio settings and Music recognition buttons - kept in the same order */}
      {onToggleMusic && (
        <Button
          onClick={onToggleMusic}
          disabled={callStatus !== 'active'}
          className={cn(
            "rounded-full h-16 w-16 flex items-center justify-center",
            isMusicMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600",
            "disabled:bg-gray-300 disabled:opacity-50"
          )}
          aria-label="Identify music"
          title="Identify music"
        >
          <Music2 size={24} />
        </Button>
      )}
      
      {onAdjustVolume && (
        <Button
          onClick={onAdjustVolume}
          disabled={callStatus !== 'active'}
          className={cn(
            "rounded-full h-16 w-16 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600",
            "disabled:bg-gray-300 disabled:opacity-50"
          )}
          aria-label="Adjust volume"
          title="Adjust volume"
        >
          <Volume2 size={24} />
        </Button>
      )}
    </div>
  );
};

export default CallControls;
