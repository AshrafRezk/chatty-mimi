
import { Mic, MicOff, Phone, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface CallControlsProps {
  isListening: boolean;
  hasTranscript: boolean;
  callStatus: 'connecting' | 'active' | 'ended';
  onToggleMic: () => void;
  onSendMessage: () => void;
  onAdjustVolume?: () => void;
}

const CallControls = ({
  isListening,
  hasTranscript,
  callStatus,
  onToggleMic,
  onSendMessage,
  onAdjustVolume
}: CallControlsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onToggleMic}
        disabled={callStatus !== 'active'}
        className={cn(
          "rounded-full h-16 w-16 flex items-center justify-center transition-all",
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600",
          callStatus !== 'active' && "opacity-50"
        )}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </Button>
      
      <Button
        onClick={onSendMessage}
        disabled={callStatus !== 'active' || !hasTranscript}
        className={cn(
          "rounded-full h-16 w-16 flex items-center justify-center bg-green-500 hover:bg-green-600",
          "disabled:bg-gray-300 disabled:opacity-50"
        )}
      >
        <Phone size={24} />
      </Button>
      
      <Button
        onClick={onAdjustVolume}
        disabled={callStatus !== 'active'}
        className={cn(
          "rounded-full h-16 w-16 flex items-center justify-center bg-purple-500 hover:bg-purple-600",
          "disabled:bg-gray-300 disabled:opacity-50"
        )}
      >
        <Volume2 size={24} />
      </Button>
    </div>
  );
};

export default CallControls;
