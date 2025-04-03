
import { MessageSquare } from "lucide-react";

interface EmptyConversationListProps {
  language: string;
}

const EmptyConversationList = ({ language }: EmptyConversationListProps) => {
  return (
    <div className="py-8 text-center text-gray-500">
      <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-30" />
      <p>{language === 'ar' ? "لا توجد محادثات" : "No conversations found"}</p>
    </div>
  );
};

export default EmptyConversationList;
