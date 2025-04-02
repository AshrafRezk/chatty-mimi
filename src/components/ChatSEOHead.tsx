
import SEOHead from "./SEOHead";
import { useChat } from "@/context/ChatContext";

const ChatSEOHead = () => {
  const { state } = useChat();
  const { language } = state;
  
  return (
    <SEOHead 
      title={language === 'ar' ? "ميمي - محادثة ذكية" : "Mimi - Smart Conversation"}
      description={language === 'ar' 
        ? "تحدث مع ميمي، المساعد الذكي الاصطناعي متعدد اللغات. احصل على إجابات لأسئلتك، واستشارات عقارية، ومعلومات غذائية، وأكثر من ذلك."
        : "Chat with Mimi, the multilingual AI assistant. Get answers to your questions, real estate advice, nutrition information, and more."}
      canonicalUrl="https://mimi-ai.app/chat"
    />
  );
};

export default ChatSEOHead;
