
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Motion } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface ConversationHistoryItemProps {
  conversation: {
    id: string;
    title: string;
    updated_at: string;
  };
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const ConversationHistoryItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete
}: ConversationHistoryItemProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Motion.div
      key={conversation.id}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg mb-2 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 cursor-pointer transition-colors",
        isActive ? "bg-slate-100/80 dark:bg-slate-800/80 border border-mimi-primary/20" : "border border-transparent"
      )}
    >
      <div className="flex items-center gap-3 flex-1 truncate">
        <div className="bg-mimi-soft dark:bg-mimi-primary/20 p-2 rounded-full">
          <MessageSquare size={16} className="text-mimi-primary" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-medium truncate">{conversation.title}</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(conversation.updated_at)}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
          onClick={(e) => onDelete(conversation.id, e)}
        >
          <Trash2 size={15} />
          <span className="sr-only">Delete</span>
        </Button>
        <ChevronRight size={16} className="text-muted-foreground ml-1" />
      </div>
    </Motion.div>
  );
};

export default ConversationHistoryItem;
