
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { state } = useChat();
  const { language } = state;
  
  const placeholderText = language === 'ar' 
    ? "اكتب رسالتك هنا..." 
    : "Type your message here...";
  
  const sendButtonText = language === 'ar' ? "إرسال" : "Send";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholderText}
          className={`min-h-28 resize-none pr-16 ${language === 'ar' ? 'text-right pl-16 pr-4' : ''}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (message.trim()) {
                onSendMessage(message.trim());
                setMessage("");
              }
            }
          }}
        />
        <div className={`absolute bottom-2 ${language === 'ar' ? 'left-2' : 'right-2'} flex gap-1`}>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            disabled={true} // Voice mode placeholder for future
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            variant="default" 
            size="icon" 
            className="bg-mimi-primary hover:bg-mimi-secondary h-8 w-8"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
