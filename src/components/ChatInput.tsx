
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import FileUploader from "./FileUploader";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { state } = useChat();
  const { language } = state;
  const isMobile = useIsMobile();
  
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

  const handleTextExtracted = (extractedText: string) => {
    // Append the extracted text to the current message
    const updatedMessage = message.trim() 
      ? `${message}\n\n${extractedText}`
      : extractedText;
    
    setMessage(updatedMessage);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="relative">
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholderText}
            className={cn(
              "resize-none pr-16",
              isMobile ? "min-h-[50px] max-h-32 rounded-2xl bg-white shadow-inner" : "min-h-28", 
              language === 'ar' ? 'text-right pl-16 pr-4' : ''
            )}
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
            <FileUploader onTextExtracted={handleTextExtracted} />
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
              variant={isMobile ? "default" : "default"} 
              size="icon" 
              className={cn(
                "h-8 w-8",
                isMobile ? "bg-mimi-primary text-white rounded-full hover:bg-mimi-secondary" : "bg-mimi-primary hover:bg-mimi-secondary"
              )}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Motion.div>
      </div>
    </form>
  );
};

export default ChatInput;

// Import the necessary cn utility at the top
import { cn } from "@/lib/utils";
