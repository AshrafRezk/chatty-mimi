
import SEOHead from "./SEOHead";
import { useChat } from "@/context/ChatContext";

const ChatSEOHead = () => {
  const { state } = useChat();
  const { language } = state;
  
  return (
    <SEOHead 
      title={language === 'ar' ? "إم.آي.إم.آي - محادثة ذكية" : "M.I.M.I - Modular Interactive Machine Intelligence"}
      description={language === 'ar' 
        ? "تحدث مع إم.آي.إم.آي، المساعد الذكي الاصطناعي متعدد اللغات. احصل على إجابات لأسئلتك، واستشارات، ومعلومات، وأكثر من ذلك."
        : "Interact with M.I.M.I, the powerful modular AI system. Get answers to your questions, expert advice, precise information, and more."}
      canonicalUrl="https://mimi-ai.app/chat"
    />
  );
};

export default ChatSEOHead;
