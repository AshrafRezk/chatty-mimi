
import { Message as MessageType } from "@/types";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import MessageReferences from "./MessageReferences";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { state } = useChat();
  const { language } = state;
  const isUser = message.sender === "user";
  const timestamp = new Date(message.timestamp);
  const formattedTime = timestamp.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Direction based on language
  const rtl = language === 'ar';
  
  return (
    <div 
      className={cn(
        "mb-4 flex", 
        isUser ? "justify-end" : "justify-start",
        "animate-fade-in"
      )}
      dir={rtl ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          isUser ? "chat-bubble-user" : "chat-bubble-assistant",
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        
        {/* Show references if available */}
        {!isUser && message.references && message.references.length > 0 && (
          <MessageReferences 
            references={message.references} 
            certaintyScore={message.certaintyScore}
          />
        )}
        
        <div 
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-right" : "text-left"
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
