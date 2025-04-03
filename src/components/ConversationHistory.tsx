
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Trash2, MessageSquare, History, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Motion } from "@/components/ui/motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const ConversationHistory = () => {
  const { state, loadConversation, createNewConversation, fetchConversationHistory } = useChat();
  const { language, conversationHistory, currentConversationId } = state;
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const handleSelectConversation = async (conversationId: string) => {
    await loadConversation(conversationId);
    setIsOpen(false);
    toast.success(
      language === 'ar' 
        ? "تم تحميل المحادثة" 
        : "Conversation loaded"
    );
  };

  const handleNewConversation = async () => {
    await createNewConversation();
    setIsOpen(false);
    toast.success(
      language === 'ar' 
        ? "تم إنشاء محادثة جديدة" 
        : "New conversation created"
    );
  };

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConversation(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation || !user) return;
    
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', selectedConversation)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (selectedConversation === currentConversationId) {
        // Create a new conversation if the current one was deleted
        await createNewConversation();
      }
      
      await fetchConversationHistory();
      toast.success(
        language === 'ar' 
          ? "تم حذف المحادثة" 
          : "Conversation deleted"
      );
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error(
        language === 'ar' 
          ? "فشل حذف المحادثة" 
          : "Failed to delete conversation"
      );
    }
    
    setDeleteDialogOpen(false);
    setSelectedConversation(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/90 border border-gray-200 shadow-sm"
            title={language === 'ar' ? "سجل المحادثات" : "Conversation History"}
          >
            <History className="h-4 w-4" />
            <span className="sr-only">
              {language === 'ar' ? "سجل المحادثات" : "Conversation History"}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? "سجل المحادثات" : "Conversation History"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleNewConversation} 
              className="w-full flex items-center gap-2 justify-start"
              variant="outline"
            >
              <Plus size={16} />
              <span>{language === 'ar' ? "محادثة جديدة" : "New Conversation"}</span>
            </Button>
            
            <ScrollArea className="h-[300px] rounded-md border p-2">
              {conversationHistory.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                  {language === 'ar' ? "لا توجد محادثات" : "No conversations found"}
                </div>
              ) : (
                conversationHistory.map((convo) => (
                  <Motion.div
                    key={convo.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleSelectConversation(convo.id)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md mb-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
                      currentConversationId === convo.id ? "bg-slate-100 dark:bg-slate-800" : ""
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 truncate">
                      <MessageSquare size={16} className="text-mimi-primary" />
                      <div className="flex flex-col truncate">
                        <span className="font-medium truncate">{convo.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(convo.updated_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => handleDeleteClick(convo.id, e)}
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </Motion.div>
                ))
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? "هل أنت متأكد؟" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar' 
                ? "سيتم حذف هذه المحادثة ورسائلها بشكل دائم." 
                : "This conversation and its messages will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'ar' ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConversation}
              className="bg-red-500 hover:bg-red-600"
            >
              {language === 'ar' ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConversationHistory;
