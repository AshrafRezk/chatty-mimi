
import { Reference } from "@/types";
import { ExternalLink, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  // Get favicon for a URL with error handling and defaults
  const getFavicon = useCallback((url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
      // Default icon for invalid URLs
      return null;
    }
  }, []);
  
  // Get domain name for display with improved formatting
  const getDomainName = useCallback((url: string) => {
    try {
      const hostname = new URL(url).hostname;
      // Remove www. prefix for cleaner display
      return hostname.replace(/^www\./, '');
    } catch (error) {
      return url;
    }
  }, []);

  // Handle copying reference to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(language === 'ar' ? "تم نسخ المرجع" : "Reference copied");
    } catch (err) {
      toast.error(language === 'ar' ? "فشل نسخ المرجع" : "Failed to copy reference");
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
  const copyLabel = isArabic ? "نسخ" : "Copy";
  const visitLabel = isArabic ? "زيارة الموقع" : "Visit Website";
  
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
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex items-center gap-2 transition-colors max-w-[85%]",
                              isDark ? "text-mimi-light hover:text-white" : "text-mimi-primary hover:text-mimi-secondary"
                            )}
                          >
                            {getFavicon(ref.url) ? (
                              <img 
                                src={getFavicon(ref.url) || ''} 
                                alt="" 
                                className="w-4 h-4 rounded-sm flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-sm bg-gray-200 flex-shrink-0" />
                            )}
                            <span className="font-medium truncate">{getDomainName(ref.url)}</span>
                            <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {visitLabel}: {ref.title || getDomainName(ref.url)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={() => handleCopy(`${ref.title}\n${ref.snippet}\nSource: ${ref.url}`)}
                      title={copyLabel}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">{copyLabel}</span>
                    </Button>
                  </div>
                  
                  <p className="line-clamp-2 mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {ref.title || getDomainName(ref.url)}
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
