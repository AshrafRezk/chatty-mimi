
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { History, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ConversationHistoryItem from "./ConversationHistoryItem";
import DeleteConversationDialog from "./DeleteConversationDialog";
import EmptyConversationList from "./EmptyConversationList";

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
                <EmptyConversationList language={language} />
              ) : (
                conversationHistory.map((convo) => (
                  <ConversationHistoryItem 
                    key={convo.id}
                    conversation={convo}
                    isActive={currentConversationId === convo.id}
                    onSelect={handleSelectConversation}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      <DeleteConversationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteConversation}
        language={language}
      />
    </>
  );
};

export default ConversationHistory;
