
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import PremiumLock from "@/components/PremiumLock";
import ComplianceBanner from "@/components/ComplianceBanner";
import ChatSEOHead from "@/components/ChatSEOHead";
import PWAInstallButton from "@/components/PWAInstallButton";
import GoogleApiSetupDialog from "@/components/GoogleApiSetupDialog";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import ConversationHistory from "@/components/ConversationHistory";
import { Plus, History } from "lucide-react";

const Chat = () => {
  const { state, createNewConversation } = useChat();
  const { language, mood, isFreeLimit, isVoiceMode } = state;
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [showApiSetup, setShowApiSetup] = useState(false);
  
  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

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

  const handleNewChat = async () => {
    await createNewConversation();
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mimi-primary"></div>
      </div>
    );
  }

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
          
          <div className="my-3 flex justify-center space-x-3">
            <Button
              variant="default"
              size="sm"
              className="rounded-full bg-mimi-primary text-white shadow-md hover:bg-mimi-secondary flex items-center transition-all gap-2 ios-button active:scale-95 px-6 py-4"
              onClick={handleNewChat}
              title={language === 'ar' ? "محادثة جديدة" : "New Chat"}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">
                {language === 'ar' ? "محادثة جديدة" : "New Chat"}
              </span>
            </Button>
            
            <ConversationHistory />
          </div>
          
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
