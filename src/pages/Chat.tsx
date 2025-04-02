
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
import { isGoogleSearchConfigured } from "@/utils/googleSearchUtils";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Chat = () => {
  const { state } = useChat();
  const { language, mood, isFreeLimit, isVoiceMode } = state;
  const isMobile = useIsMobile();
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [isSearchConfigured, setIsSearchConfigured] = useState(false);
  
  // Set document title based on language
  useEffect(() => {
    document.title = language === 'ar' ? "ميمي - المحادثة" : "Mimi - Chat";
  }, [language]);

  // Check Google Search API configuration
  useEffect(() => {
    const checkSearchConfig = () => {
      setIsSearchConfigured(isGoogleSearchConfigured());
    };
    
    checkSearchConfig();
    
    // Listen for storage events to update the state if API keys are changed
    const handleStorageChange = () => {
      checkSearchConfig();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
          "min-h-screen transition-colors duration-300 flex flex-col max-h-screen",
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
          
          {!isSearchConfigured && (
            <div className="mx-auto px-4 py-2 mb-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border shadow-sm">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {language === 'ar' 
                    ? "قم بإعداد Google Search API للحصول على نتائج بحث أفضل" 
                    : "Setup Google Search API for better search results"}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowApiSetup(true)}
                  className="ml-2 text-xs h-7"
                >
                  {language === 'ar' ? "إعداد" : "Setup"}
                </Button>
              </div>
            </div>
          )}
          
          <ChatInterface />
        </div>
        
        {/* Show premium lock if free limit reached */}
        {isFreeLimit && <PremiumLock />}
        
        {/* PWA Install Button */}
        <PWAInstallButton />
        
        {/* Google API Setup Dialog */}
        <GoogleApiSetupDialog
          open={showApiSetup}
          onOpenChange={setShowApiSetup}
        />
      </Motion.div>
    </>
  );
};

export default Chat;
