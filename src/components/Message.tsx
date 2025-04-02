
import { Message as MessageType } from "@/types";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import MessageReferences from "./MessageReferences";
import { Motion } from "@/components/ui/motion";
import CodeViewer from "./CodeViewer";
import TextToSpeech from "./TextToSpeech";

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
  
  // Function to detect code blocks in message text
  const renderMessageContent = (text: string) => {
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {text.slice(lastIndex, match.index)}
          </p>
        );
      }
      
      // Add code block
      const language = match[1] || 'javascript';
      const code = match[2].trim();
      parts.push(
        <CodeViewer key={`code-${match.index}`} code={code} language={language} />
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last code block
    if (lastIndex < text.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </p>
      );
    }
    
    return parts.length > 0 ? parts : <p className="whitespace-pre-wrap">{text}</p>;
  };

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
        {renderMessageContent(message.text)}
        
        {/* Show references if available */}
        {!isUser && message.references && message.references.length > 0 && (
          <MessageReferences 
            references={message.references} 
            certaintyScore={message.certaintyScore}
          />
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div 
            className={cn(
              "text-xs",
              isUser ? "text-white/90" : cn(
                isDarkMode ? "text-white/90" : "text-gray-500"
              )
            )}
          >
            {formattedTime}
          </div>
          
          {/* Add text-to-speech button for assistant messages */}
          {!isUser && (
            <TextToSpeech text={message.text} />
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default Message;
