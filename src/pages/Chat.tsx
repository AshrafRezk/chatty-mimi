
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import PremiumLock from "@/components/PremiumLock";
import ComplianceBanner from "@/components/ComplianceBanner";
import ChatSEOHead from "@/components/ChatSEOHead";
import PWAInstallButton from "@/components/PWAInstallButton";
import GoogleApiSetupDialog from "@/components/GoogleApiSetupDialog";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const { state } = useChat();
  const { language, mood, isFreeLimit, isVoiceMode } = state;
  const isMobile = useIsMobile();
  const [showApiSetup, setShowApiSetup] = useState(false);
  
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
      }
    };
    
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);
    handleDisplayModeChange(); // Check initial state
    
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  return (
    <>
      <ChatSEOHead />
      <Motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={cn(
          "min-h-screen transition-colors duration-300 flex flex-col max-h-screen overflow-hidden",
          getMoodBackgroundClass(),
          language === 'ar' ? 'rtl' : '',
          mood === 'deep' || mood === 'focus' ? 'text-white' : ''
        )}
      >
        <Navbar />
        <div className={cn(
          "flex-1 flex flex-col overflow-auto",
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
        
        {/* Google API Setup Dialog - hidden by default but kept for advanced users */}
        <GoogleApiSetupDialog
          open={showApiSetup}
          onOpenChange={setShowApiSetup}
        />
      </Motion.div>
    </>
  );
};

export default Chat;
