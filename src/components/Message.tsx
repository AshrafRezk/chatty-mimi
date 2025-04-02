import { useEffect, useState } from "react";
import { Message as MessageType } from "@/types";
import MessageReferences from "./MessageReferences";
import NutritionChart from "./NutritionChart";
import CodeViewer from "./CodeViewer";
import TextToSpeech from "./TextToSpeech";
import PropertyDetails from "./PropertyDetails";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { state } = useChat();
  const { mood, language } = state;
  const isMobile = useIsMobile();
  const [baseUrl, setBaseUrl] = useState("");
  
  useEffect(() => {
    // Get the base URL from the browser
    setBaseUrl(window.location.origin);
  }, []);
  
  // Helper to handle copying message content with attribution
  const handleCopy = async () => {
    try {
      const attributionText = language === 'ar' 
        ? `\n\nتم إنشاء هذا المحتوى بواسطة ميمي، مساعدك الذكي الاصطناعي المخصص | ${baseUrl}`
        : `\n\nThis content was generated using Mimi, your intelligent AI assistant | ${baseUrl}`;
        
      await navigator.clipboard.writeText(message.text + attributionText);
      
      toast.success(
        language === 'ar' ? "تم نسخ المحتوى إلى الحافظة" : "Content copied to clipboard"
      );
    } catch (err) {
      toast.error(
        language === 'ar' ? "فشل نسخ المحتوى" : "Failed to copy content"
      );
      console.error("Failed to copy:", err);
    }
  };
  
  // Function to detect and highlight code blocks
  const renderContent = () => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({node, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={cn(className, "bg-muted px-1 py-0.5 rounded")} {...props}>
                {children}
              </code>
            );
          },
          pre({children}) {
            return (
              <pre className="overflow-auto p-0 rounded-lg my-2">
                {children}
              </pre>
            );
          },
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };

  const bubbleStyle = message.sender === "user"
    ? cn(
        "chat-bubble-user",
        mood === "deep" ? "bg-slate-700 text-white" : "",
        mood === "focus" ? "bg-zinc-700 text-white" : ""
      )
    : cn(
        "chat-bubble-assistant",
        mood === "deep" || mood === "focus" ? "bg-white/20" : ""
      );
  
  return (
    <div className={cn(
      "flex items-start gap-2",
      message.sender === "user" ? "justify-end" : "justify-start",
      "animate-fade-in"
    )}>
      <div className={cn(
        "relative max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-3",
        bubbleStyle
      )}>
        {message.imageSrc && (
          <div className="mb-2">
            <img 
              src={message.imageSrc} 
              alt="Uploaded content" 
              className="max-w-full h-auto rounded"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}
        
        <div className="relative">
          {renderContent()}
          
          {message.sender === "assistant" && (
            <div className="absolute top-0 right-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                onClick={handleCopy}
              >
                <Copy size={14} />
                <span className="sr-only">{language === 'ar' ? "نسخ" : "Copy"}</span>
              </Button>
            </div>
          )}
        </div>
        
        {message.sender === "assistant" && message.references && message.references.length > 0 && (
          <div className="mt-2">
            <MessageReferences 
              references={message.references} 
              certaintyScore={message.certaintyScore}
            />
          </div>
        )}
        
        {message.sender === "assistant" && message.nutritionData && (
          <div className="mt-4 w-full">
            <NutritionChart data={message.nutritionData} />
          </div>
        )}
        
        {message.sender === "assistant" && message.propertyData && (
          <div className="mt-4 w-full">
            <PropertyDetails propertyData={message.propertyData} />
          </div>
        )}
        
        {message.sender === "assistant" && !isMobile && (
          <div className="mt-2 text-right">
            <TextToSpeech text={message.text} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
