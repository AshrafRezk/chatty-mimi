
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import PremiumLock from "@/components/PremiumLock";
import ComplianceBanner from "@/components/ComplianceBanner";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

const Chat = () => {
  const { state } = useChat();
  const { language, mood, isFreeLimit } = state;
  
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
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      getMoodBackgroundClass(),
      language === 'ar' ? 'rtl' : ''
    )}>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <ComplianceBanner />
        <ChatInterface />
      </div>
      
      {/* Show premium lock if free limit reached */}
      {isFreeLimit && <PremiumLock />}
    </div>
  );
};

export default Chat;
