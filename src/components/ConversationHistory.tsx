
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
            variant="secondary" 
            size="sm" 
            className="rounded-full ios-button shadow-md bg-white/90 dark:bg-mimi-dark/80 hover:bg-gray-100 dark:hover:bg-mimi-dark/90 border border-gray-200 dark:border-gray-700 transition-all gap-2 px-4 py-4"
            title={language === 'ar' ? "سجل المحادثات" : "Conversation History"}
          >
            <History className="h-5 w-5 text-mimi-secondary" />
            <span className="font-medium">
              {language === 'ar' ? "السجل" : "History"}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md ios-glass rounded-xl border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-xl">
              {language === 'ar' ? "سجل المحادثات" : "Conversation History"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleNewConversation} 
              className="w-full flex items-center gap-2 justify-center rounded-full bg-mimi-primary text-white hover:bg-mimi-secondary transition-colors py-6"
              variant="default"
            >
              <Plus size={18} />
              <span className="font-medium">{language === 'ar' ? "محادثة جديدة" : "New Conversation"}</span>
            </Button>
            
            <ScrollArea className="h-[350px] rounded-md p-3">
              {conversationHistory.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-30" />
                  <p>{language === 'ar' ? "لا توجد محادثات" : "No conversations found"}</p>
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
                      "flex items-center justify-between p-3 rounded-lg mb-2 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 cursor-pointer transition-colors",
                      currentConversationId === convo.id ? "bg-slate-100/80 dark:bg-slate-800/80 border border-mimi-primary/20" : "border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 truncate">
                      <div className="bg-mimi-soft dark:bg-mimi-primary/20 p-2 rounded-full">
                        <MessageSquare size={16} className="text-mimi-primary" />
                      </div>
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
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        onClick={(e) => handleDeleteClick(convo.id, e)}
                      >
                        <Trash2 size={15} />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <ChevronRight size={16} className="text-muted-foreground ml-1" />
                    </div>
                  </Motion.div>
                ))
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl ios-glass">
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
            <AlertDialogCancel className="rounded-full">
              {language === 'ar' ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConversation}
              className="bg-red-500 hover:bg-red-600 rounded-full"
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
