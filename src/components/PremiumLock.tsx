
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

const PremiumLock = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: language === 'ar' ? 'لقد وصلت إلى الحد الأقصى المجاني' : 'You\'ve reached the free limit',
    description: language === 'ar' 
      ? 'للاستمرار في المحادثة مع ميمي، يرجى الترقية إلى النسخة المميزة' 
      : 'To continue chatting with Mimi, please upgrade to premium',
    payEgypt: language === 'ar' ? 'الدفع عبر حوالة محلية (مصر)' : 'Pay via local transfer (Egypt)',
    payGlobal: language === 'ar' ? 'الدفع عبر بوابة دفع عالمية' : 'Pay via global payment',
    payPaypal: language === 'ar' ? 'الدفع عبر باي بال' : 'Pay with PayPal',
    contactUs: language === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp',
  };

  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50",
      language === 'ar' ? 'rtl' : ''
    )}>
      <div className="bg-white dark:bg-mimi-dark p-8 rounded-xl max-w-md w-full shadow-xl animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-mimi-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-10 h-10 text-mimi-primary"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 gradient-text">{texts.title}</h2>
          <p className="text-muted-foreground mb-6">{texts.description}</p>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full bg-mimi-primary hover:bg-mimi-secondary">
            {texts.payEgypt}
          </Button>
          <Button variant="outline" className="w-full border-mimi-primary text-mimi-primary hover:bg-mimi-soft">
            {texts.payGlobal}
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {texts.payPaypal}
          </Button>
          <Button variant="link" className="w-full text-mimi-secondary">
            {texts.contactUs}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumLock;
