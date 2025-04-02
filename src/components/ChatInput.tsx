
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Paperclip, Camera } from "lucide-react";
import FileUploader from "./FileUploader";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showFileUploader, setShowFileUploader] = useState(false);
  const { state } = useChat();
  const { language } = state;
  const isMobile = useIsMobile();
  
  const placeholderText = language === 'ar' 
    ? "اكتب رسالتك هنا..." 
    : "Type your message here...";
  
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
    setShowFileUploader(false);
  };

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${language === 'ar' ? 'rtl' : ''}`}>
        {showFileUploader && (
          <div className="bg-background/70 backdrop-blur-sm p-3 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Upload Document or Image</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowFileUploader(false)}
              >
                <span className="sr-only">Close</span>
                ✕
              </Button>
            </div>
            <FileUploader onTextExtracted={handleTextExtracted} />
          </div>
        )}
        
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholderText}
            className={cn(
              "resize-none pr-24",
              isMobile ? "min-h-[50px] max-h-32 rounded-2xl bg-white shadow-inner" : "min-h-28", 
              language === 'ar' ? 'text-right pl-24 pr-4' : ''
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
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowFileUploader(prev => !prev)}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowFileUploader(prev => !prev)}
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Take photo</span>
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={true} // Voice mode placeholder for future
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
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
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </form>
    </Motion.div>
  );
};

export default ChatInput;
