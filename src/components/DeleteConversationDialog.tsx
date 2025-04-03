
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  language: string;
}

const DeleteConversationDialog = ({
  open,
  onOpenChange,
  onDelete,
  language
}: DeleteConversationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 rounded-full"
          >
            {language === 'ar' ? "حذف" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConversationDialog;
