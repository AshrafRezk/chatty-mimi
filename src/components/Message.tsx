
import { Message as MessageType } from "@/types";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import MessageReferences from "./MessageReferences";
import { Motion } from "@/components/ui/motion";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { state } = useChat();
  const { language, mood } = state;
  const isUser = message.sender === "user";
  const timestamp = new Date(message.timestamp);
  const formattedTime = timestamp.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Direction based on language
  const rtl = language === 'ar';
  
  // Apply different styling for deep/focus modes to ensure text visibility
  const isDarkMode = mood === 'deep' || mood === 'focus';
  
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "mb-3 md:mb-4 flex", 
        isUser ? "justify-end" : "justify-start"
      )}
      dir={rtl ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          isUser ? "chat-bubble-user" : cn(
            "chat-bubble-assistant",
            isDarkMode ? "bg-white/20 text-white" : ""
          ),
          "backdrop-blur-sm"
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
            "text-xs mt-1",
            isUser ? "text-right text-white/90" : cn(
              "text-left",
              isDarkMode ? "text-white/90" : "text-gray-500"
            )
          )}
        >
          {formattedTime}
        </div>
      </div>
    </Motion.div>
  );
};

export default Message;
