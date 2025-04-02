
import { Reference } from "@/types";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface MessageReferencesProps {
  references: Reference[];
  certaintyScore?: number;
}

const MessageReferences = ({ references, certaintyScore = 0 }: MessageReferencesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!references || references.length === 0) return null;
  
  return (
    <div className="mt-3 bg-white/50 dark:bg-mimi-dark/30 rounded-lg p-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Sources</span>
          {certaintyScore > 0 && (
            <span className="bg-mimi-primary/20 text-mimi-primary px-2 py-0.5 rounded-full">
              {certaintyScore}% certainty
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-mimi-primary hover:text-mimi-secondary transition-colors"
        >
          {isExpanded ? 'Hide' : 'View'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-2 mt-2">
          {references.map((ref, index) => (
            <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <a 
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-mimi-primary hover:text-mimi-secondary transition-colors"
              >
                <span className="line-clamp-1">{ref.title}</span>
                <ExternalLink className="w-3 h-3 ml-1 inline-block" />
              </a>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
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
