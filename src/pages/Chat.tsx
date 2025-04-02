
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import PremiumLock from "@/components/PremiumLock";
import ComplianceBanner from "@/components/ComplianceBanner";
import ChatSEOHead from "@/components/ChatSEOHead";
import PWAInstallButton from "@/components/PWAInstallButton";
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

  // Add listener for PWA display mode changes
  useEffect(() => {
    const handleDisplayModeChange = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is running in standalone mode (PWA)');
        // You could update state here if needed
      }
    };
    
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);
    handleDisplayModeChange(); // Check initial state
    
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // iOS Safari fix - prevent any potential overlays from persisting
  useEffect(() => {
    // This helps reset any potential stuck overlays on iOS Safari
    const resetIOSView = () => {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // Use string indexing for vendor prefixed properties to avoid TypeScript errors
        document.body.style["webkitOverflowScrolling" as any] = 'touch';
        // Force layout recalculation
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.height = '100%';
          document.body.style.overflow = 'hidden';
        }, 100);
      }
    };
    
    resetIOSView();
    
    // Cleanup function
    return () => {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style["webkitOverflowScrolling" as any] = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
      }
    };
  }, []);

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn(
        "min-h-screen transition-colors duration-300 flex flex-col",
        getMoodBackgroundClass(),
        language === 'ar' ? 'rtl' : '',
        mood === 'deep' || mood === 'focus' ? 'text-white' : '',
        "fixed inset-0"
      )}
    >
      <ChatSEOHead />
      <Navbar />
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        isMobile ? "max-w-full p-0" : "container mx-auto py-2 px-2 md:py-4 md:px-4"
      )}
      style={{ position: 'relative', zIndex: 1 }}
      >
        <ComplianceBanner />
        <ChatInterface />
      </div>
      
      {/* Show premium lock if free limit reached */}
      {isFreeLimit && <PremiumLock />}
      
      {/* PWA Install Button */}
      <PWAInstallButton />
    </Motion.div>
  );
};

export default Chat;
