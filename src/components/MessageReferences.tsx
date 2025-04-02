
import { Reference } from "@/types";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface MessageReferencesProps {
  references: Reference[];
  certaintyScore?: number;
}

const MessageReferences = ({ references, certaintyScore = 0 }: MessageReferencesProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { state } = useChat();
  const { mood, language } = state;
  const { theme } = useTheme();
  const isDark = theme === 'dark' || mood === 'deep' || mood === 'focus';
  
  // Force references to show if they exist
  useEffect(() => {
    if (references && references.length > 0) {
      setIsExpanded(true);
    }
  }, [references]);
  
  // Get favicon for a URL
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
      return null;
    }
  };
  
  // Get domain name for display
  const getDomainName = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (error) {
      return url;
    }
  };
  
  if (!references || references.length === 0) {
    // Always show a placeholder if no references
    const noReferencesMessage = language === 'ar' 
      ? "لا توجد مراجع متاحة لهذا المحتوى"
      : "No references available for this content";
      
    return (
      <div className={cn(
        "mt-3 rounded-lg p-3 text-xs",
        isDark ? "bg-white/10" : "bg-white/90 dark:bg-mimi-dark/10 border border-gray-100 dark:border-gray-800"
      )}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold">{language === 'ar' ? "المراجع" : "Sources"}</span>
        </div>
        <div className="text-muted-foreground italic">
          {noReferencesMessage}
        </div>
      </div>
    );
  }
  
  const isArabic = language === 'ar';
  
  // Get labels based on language
  const sourcesLabel = isArabic ? "المصادر" : "Sources";
  const certaintyLabel = isArabic ? "درجة الثقة" : "Reliability";
  
  return (
    <div className={cn(
      "mt-3 rounded-lg overflow-hidden",
      isDark ? "bg-white/10" : "bg-white/90 dark:bg-mimi-dark/10 border border-gray-100 dark:border-gray-800"
    )}>
      <Accordion type="single" collapsible defaultValue="references">
        <AccordionItem value="references" className="border-0">
          <AccordionTrigger className="px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{sourcesLabel}</span>
              {certaintyScore > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  isDark ? "bg-mimi-primary/30 text-white" : "bg-mimi-primary/20 text-mimi-primary"
                )}>
                  {certaintyScore}% {certaintyLabel}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3 text-xs">
              {references.map((ref, index) => (
                <div key={index} className="border-t pt-2">
                  <a 
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      isDark ? "text-mimi-light hover:text-white" : "text-mimi-primary hover:text-mimi-secondary"
                    )}
                  >
                    {getFavicon(ref.url) && (
                      <img 
                        src={getFavicon(ref.url) || ''} 
                        alt="" 
                        className="w-4 h-4 rounded-sm"
                      />
                    )}
                    <span className="font-medium">{getDomainName(ref.url)}</span>
                    <ExternalLink className="w-3 h-3 ml-1 inline-block" />
                  </a>
                  <p className="line-clamp-2 mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {ref.title}
                  </p>
                  <p className={cn(
                    "line-clamp-2 mt-1 text-xs",
                    isDark ? "text-white/80" : "text-gray-600 dark:text-gray-300"
                  )}>
                    {ref.snippet}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MessageReferences;
