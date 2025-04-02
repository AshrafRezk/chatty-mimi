
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CodeViewerProps {
  code: string;
  language?: string;
}

const CodeViewer = ({ code, language = "javascript" }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
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
    <div className="rounded-md overflow-hidden my-2 border border-border">
      <div className="bg-muted flex items-center justify-between px-4 py-2">
        <div className="text-xs font-mono text-muted-foreground">
          {language}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="h-8 px-2 text-muted-foreground"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto bg-black/10 dark:bg-white/5">
        <code className="text-sm font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
};

export default CodeViewer;
