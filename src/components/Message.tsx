
import { useEffect, useState } from "react";
import { Message as MessageType } from "@/types";
import MessageReferences from "./MessageReferences";
import NutritionChart from "./NutritionChart";
import CodeViewer from "./CodeViewer";
import TextToSpeech from "./TextToSpeech";
import PropertyDetails from "./PropertyDetails";
import InteractiveChart, { ChartData } from "./InteractiveChart";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useIsMobile } from "@/hooks/use-mobile";
import RealEstateGallery from "./RealEstateGallery";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { state } = useChat();
  const { mood, language } = state;
  const isMobile = useIsMobile();
  const [baseUrl, setBaseUrl] = useState("");
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [chartTitle, setChartTitle] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Get the base URL from the browser
    setBaseUrl(window.location.origin);
    
    // Check if the message contains comparison data that could be visualized
    if (message.sender === "assistant") {
      extractChartData(message.text);
    }
  }, [message]);
  
  // Helper to extract potential chart data from message content
  const extractChartData = (text: string) => {
    // Check for table patterns (markdown tables or other tabular data)
    const hasTable = /\|\s*[^|]+\s*\|/.test(text) || 
                     /comparison|compare|versus|vs\.?|statistics/i.test(text);
                     
    // Check if there's a comparison section with numbers
    const comparisonPattern = /([A-Za-z\s]+):\s*(\d+(?:\.\d+)?)/g;
    const matches = [...text.matchAll(comparisonPattern)];
    
    if (matches.length >= 2) {
      // Extract name-value pairs for charting
      const data: ChartData[] = matches.map(match => ({
        name: match[1].trim(), 
        value: parseFloat(match[2])
      }));
      
      // Try to extract a title from the context
      const titleMatch = text.match(/(?:comparing|comparison of|between)\s+([^.]+)/i);
      if (titleMatch) {
        setChartTitle(titleMatch[1].trim());
      }
      
      setChartData(data);
    } else if (hasTable) {
      // This is a placeholder for more advanced table parsing logic
      // For now, we'll just check if there are numeric values that could be charted
      const numericPattern = /\|\s*([^|]+)\s*\|\s*(\d+(?:\.\d+)?)\s*\|/g;
      const tableMatches = [...text.matchAll(numericPattern)];
      
      if (tableMatches.length >= 2) {
        const data: ChartData[] = tableMatches.map(match => ({
          name: match[1].trim(),
          value: parseFloat(match[2])
        }));
        
        setChartData(data);
      }
    } else {
      setChartData(null);
    }
  };
  
  // Helper to handle copying message content with attribution
  const handleCopy = async () => {
    try {
      const attributionText = language === 'ar' 
        ? `\n\nتم إنشاء هذا المحتوى بواسطة ميمي، مساعدك الذكي الاصطناعي المخصص | ${baseUrl}`
        : `\n\nThis content was generated using Mimi, your intelligent AI assistant | ${baseUrl}`;
        
      await navigator.clipboard.writeText(message.text + attributionText);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
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
  
  const handleDownload = () => {
    try {
      // Create a blob with the message content
      const blob = new Blob([message.text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to download the file
      const a = document.createElement("a");
      a.href = url;
      a.download = `mimi-response-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(
        language === 'ar' ? "تم تنزيل المحتوى" : "Content downloaded"
      );
    } catch (err) {
      toast.error(
        language === 'ar' ? "فشل تنزيل المحتوى" : "Failed to download content"
      );
      console.error("Failed to download:", err);
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
        "chat-bubble-user ios-glass shadow-lg",
        mood === "deep" ? "bg-slate-700 text-white" : "",
        mood === "focus" ? "bg-zinc-700 text-white" : ""
      )
    : cn(
        "chat-bubble-assistant ios-glass shadow-lg",
        mood === "deep" || mood === "focus" ? "bg-white/20" : ""
      );
  
  return (
    <div className={cn(
      "flex items-start gap-2",
      message.sender === "user" ? "justify-end" : "justify-start",
      "animate-ios-fade-in"
    )}>
      <div className={cn(
        "relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3",
        bubbleStyle
      )}>
        {message.imageSrc && (
          <div className="mb-2">
            <img 
              src={message.imageSrc} 
              alt="Uploaded content" 
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}
        
        <div className="relative">
          {renderContent()}
          
          {message.sender === "assistant" && (
            <div className="absolute top-0 right-0 flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100 rounded-full"
                onClick={handleCopy}
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                <span className="sr-only">{language === 'ar' ? "نسخ" : "Copy"}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100 rounded-full"
                onClick={handleDownload}
              >
                <Download size={14} />
                <span className="sr-only">{language === 'ar' ? "تنزيل" : "Download"}</span>
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
        
        {message.sender === "assistant" && chartData && chartData.length >= 2 && (
          <div className="mt-4 w-full">
            <InteractiveChart data={chartData} title={chartTitle} />
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

        {message.sender === "assistant" && message.propertyData && message.propertyImages && message.propertyImages.length > 0 && (
          <div className="mt-4 w-full">
            <RealEstateGallery images={message.propertyImages} />
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
