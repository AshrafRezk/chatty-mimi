
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/context/ChatContext";
import { useTheme } from "@/hooks/use-theme";

interface CodeViewerProps {
  code: string;
  language?: string;
}

const CodeViewer = ({ code, language = "javascript" }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { state } = useChat();
  const { mood } = state;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isDarkMood = mood === 'deep' || mood === 'focus';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "rounded-md overflow-hidden my-3 border",
      isDarkMood || isDark ? "border-white/20" : "border-border"
    )}>
      <div className={cn(
        "flex items-center justify-between px-4 py-2",
        isDarkMood || isDark ? "bg-white/10" : "bg-muted"
      )}>
        <div className={cn(
          "text-xs font-mono",
          isDarkMood ? "text-white/70" : "text-muted-foreground"
        )}>
          {language}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className={cn(
            "h-8 px-2",
            isDarkMood ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground"
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className={cn(
        "p-4 overflow-x-auto",
        isDarkMood || isDark ? "bg-black/30" : "bg-black/5 dark:bg-white/5"
      )}>
        <code className={cn(
          "text-sm font-mono",
          isDarkMood ? "text-white" : "text-foreground"
        )}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeViewer;
