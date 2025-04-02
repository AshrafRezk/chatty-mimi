
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
        }, 100);
      }
    };
    
    resetIOSView();
    
    // Cleanup function
    return () => {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style["webkitOverflowScrolling" as any] = '';
      }
    };
  }, []);

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn(
        "min-h-screen transition-colors duration-300",
        getMoodBackgroundClass(),
        language === 'ar' ? 'rtl' : '',
        mood === 'deep' || mood === 'focus' ? 'text-white' : '',
        // Fixed: Remove overflow-hidden for iOS to prevent content getting cut off
        isVoiceMode ? 'overflow-y-auto' : 'overflow-y-auto'
      )}
      style={{ 
        height: '100vh', 
        width: '100vw', 
        margin: 0, 
        padding: 0,
        // Ensure content is within safe area for iOS devices
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)'
      }}
    >
      <ChatSEOHead />
      <Navbar />
      <div className={cn(
        "flex flex-col",
        isMobile ? "max-w-full p-0 pt-1" : "container mx-auto py-2 px-2 md:py-4 md:px-4"
      )}
      style={{ height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)', position: 'relative', zIndex: 1 }}
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
