
import { Reference } from "@/types";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface MessageReferencesProps {
  references: Reference[];
  certaintyScore?: number;
}

const MessageReferences = ({ references, certaintyScore = 0 }: MessageReferencesProps) => {
  // Default to expanded for better visibility of references
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
  const certaintyLabel = isArabic ? "درجة الثقة" : "certainty";
  const hideLabel = isArabic ? "إخفاء" : "Hide";
  const viewLabel = isArabic ? "عرض" : "View";
  
  return (
    <div className={cn(
      "mt-3 rounded-lg p-3 text-xs",
      isDark ? "bg-white/10" : "bg-white/90 dark:bg-mimi-dark/10 border border-gray-100 dark:border-gray-800"
    )}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2" dir="ltr">
          <span className="font-semibold">{sourcesLabel}</span>
          {certaintyScore > 0 && (
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              isDark ? "bg-mimi-primary/30 text-white" : "bg-mimi-primary/20 text-mimi-primary"
            )}>
              {certaintyScore}% {certaintyLabel}
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "transition-colors px-2 py-1 rounded-md text-xs",
            isDark 
              ? "text-white hover:bg-white/10" 
              : "text-mimi-primary hover:bg-mimi-soft"
          )}
        >
          {isExpanded ? hideLabel : viewLabel}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-2 mt-2">
          {references.map((ref, index) => (
            <div key={index} className={cn(
              "border-t pt-2",
              isDark ? "border-white/10" : "border-gray-200 dark:border-gray-700"
            )}>
              <a 
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center transition-colors",
                  isDark ? "text-mimi-light hover:text-white" : "text-mimi-primary hover:text-mimi-secondary"
                )}
              >
                <span className="line-clamp-1">{ref.title}</span>
                <ExternalLink className="w-3 h-3 ml-1 inline-block" />
              </a>
              <p className={cn(
                "line-clamp-2 mt-1",
                isDark ? "text-white/80" : "text-gray-600 dark:text-gray-300"
              )}>
                {ref.snippet}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReferences;
