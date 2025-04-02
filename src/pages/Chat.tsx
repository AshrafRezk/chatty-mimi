
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
  const { language, mood, isFreeLimit, isVoiceMode } = state;
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
        "min-h-screen transition-colors duration-300 overflow-hidden",
        getMoodBackgroundClass(),
        language === 'ar' ? 'rtl' : '',
        mood === 'deep' || mood === 'focus' ? 'text-white' : '',
        isVoiceMode ? 'overflow-hidden' : ''
      )}
      style={{ height: '100vh' }}
    >
      <Navbar />
      <div className={cn(
        "container mx-auto py-2 px-2 md:py-6 md:px-4 flex flex-col",
        isMobile && "max-w-full p-0 pt-1"
      )}
      style={{ height: 'calc(100vh - 64px)' }}
      >
        <ComplianceBanner />
        <ChatInterface />
      </div>
      
      {/* Show premium lock if free limit reached */}
      {isFreeLimit && <PremiumLock />}
    </Motion.div>
  );
};

export default Chat;
