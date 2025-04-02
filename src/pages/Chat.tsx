
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import PremiumLock from "@/components/PremiumLock";
import ComplianceBanner from "@/components/ComplianceBanner";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const { state } = useChat();
  const { language, mood, isFreeLimit } = state;
  const isMobile = useIsMobile();
  
  // Set document title based on language
  useEffect(() => {
    document.title = language === 'ar' ? "ميمي - المحادثة" : "Mimi - Chat";
  }, [language]);

  // Get mood-specific background class
  const getMoodBackgroundClass = () => {
    switch (mood) {
      case 'calm':
        return 'bg-calm-gradient';
      case 'friendly':
        return 'bg-friendly-gradient';
      case 'deep':
        return 'bg-deep-gradient';
      case 'focus':
        return 'bg-focus-gradient';
      default:
        return 'bg-background';
    }
  };

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn(
        "min-h-screen transition-colors duration-300",
        getMoodBackgroundClass(),
        language === 'ar' ? 'rtl' : '',
        mood === 'deep' || mood === 'focus' ? 'text-white' : ''
      )}
    >
      <Navbar />
      <div className={cn(
        "container mx-auto py-4 px-3 md:py-8 md:px-4 flex flex-col",
        isMobile && "max-w-full p-0 pt-2"
      )}>
        <ComplianceBanner />
        <ChatInterface />
      </div>
      
      {/* Show premium lock if free limit reached */}
      {isFreeLimit && <PremiumLock />}
    </Motion.div>
  );
};

export default Chat;
