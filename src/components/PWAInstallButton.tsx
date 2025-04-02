
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { state } = useChat();
  const { language } = state;

  useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone
    ) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      
      toast.success(
        language === 'ar'
          ? 'تم تثبيت التطبيق بنجاح!'
          : 'App installed successfully!',
        { 
          className: 'pwa-toast',
          duration: 3000
        }
      );
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [language]);

  const handleInstall = async () => {
    if (!installPrompt) {
      // If on iOS Safari, show instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      if (isIOS) {
        toast(
          language === 'ar'
            ? 'لتثبيت التطبيق على iOS، اضغط على زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"'
            : 'To install on iOS, tap the share button and select "Add to Home Screen"',
          {
            className: 'pwa-toast',
            duration: 6000,
          }
        );
      } else {
        toast(
          language === 'ar'
            ? 'هذا التطبيق قابل للتثبيت من خلال إعدادات المتصفح'
            : 'This app can be installed from your browser settings',
          {
            className: 'pwa-toast',
            duration: 3000,
          }
        );
      }
      return;
    }

    try {
      // Show the install prompt
      installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      // Clear the prompt reference
      setInstallPrompt(null);
    } catch (error) {
      console.error('PWA install error:', error);
    }
  };

  // Don't show button if already in standalone mode or just installed
  if (isStandalone || isInstalled) return null;
  
  // Don't show button if install prompt is not available
  // unless we're on iOS (where we need to show manual instructions)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (!installPrompt && !isIOS) return null;

  return (
    <Button
      onClick={handleInstall}
      className={cn(
        "pwa-install-button",
        language === 'ar' ? 'left-4 right-auto' : ''
      )}
    >
      <Download className="h-4 w-4" />
      {language === 'ar' ? 'تثبيت التطبيق' : 'Install App'}
    </Button>
  );
};

export default PWAInstallButton;
