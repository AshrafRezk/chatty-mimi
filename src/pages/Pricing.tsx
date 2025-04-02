
import { useChat } from "@/context/ChatContext";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, PayPal } from "lucide-react";

const Pricing = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "Simple, Transparent Pricing",
      ar: "تسعير بسيط وشفاف"
    },
    subtitle: {
      en: "Choose the plan that works for you",
      ar: "اختر الخطة التي تناسبك"
    },
    free: {
      en: "Free",
      ar: "مجاني"
    },
    premium: {
      en: "Premium",
      ar: "مميز"
    },
    currency: {
      en: "$",
      ar: "دولار"
    },
    perMonth: {
      en: "per month",
      ar: "شهريًا"
    },
    current: {
      en: "Current Plan",
      ar: "الخطة الحالية"
    },
    upgrade: {
      en: "Upgrade",
      ar: "ترقية"
    },
    features: {
      free: [
        { en: "15 messages per day", ar: "15 رسالة يوميًا" },
        { en: "Basic chat functionality", ar: "وظائف الدردشة الأساسية" },
        { en: "Multiple languages", ar: "لغات متعددة" },
        { en: "Mood-based responses", ar: "ردود حسب المزاج" },
      ],
      premium: [
        { en: "Unlimited messages", ar: "رسائل غير محدودة" },
        { en: "Advanced chat features", ar: "ميزات دردشة متقدمة" },
        { en: "Priority support", ar: "دعم ذو أولوية" },
        { en: "Custom chat history", ar: "سجل محادثة مخصص" },
        { en: "Voice messages (coming soon)", ar: "رسائل صوتية (قريبًا)" },
      ]
    },
    paymentOptions: {
      title: {
        en: "Payment Options",
        ar: "خيارات الدفع"
      },
      egypt: {
        en: "Egypt",
        ar: "مصر"
      },
      global: {
        en: "Global",
        ar: "عالمي"
      },
      options: {
        egypt: [
          { en: "InstaPay", ar: "انستاباي" },
          { en: "Fawry", ar: "فوري" },
          { en: "Bank Transfer", ar: "تحويل بنكي" },
        ],
        global: [
          { en: "Credit Card", ar: "بطاقة ائتمان" },
          { en: "PayPal", ar: "باي بال" },
        ]
      }
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background",
      language === 'ar' ? 'rtl' : ''
    )}>
      <Navbar />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              {texts.title[language]}
            </h1>
            <p className="text-xl text-muted-foreground">
              {texts.subtitle[language]}
            </p>
          </div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Free plan */}
            <div className="border rounded-xl p-8 bg-white dark:bg-mimi-dark/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  {texts.free[language]}
                </h2>
                <div className="flex items-end">
                  <span className="text-4xl font-bold">0</span>
                  <span className="text-muted-foreground ml-1">{texts.currency[language]}</span>
                </div>
                <p className="text-muted-foreground">
                  {texts.perMonth[language]}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {texts.features.free.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature[language]}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full" disabled>
                {texts.current[language]}
              </Button>
            </div>
            
            {/* Premium plan */}
            <div className="border border-mimi-primary rounded-xl p-8 bg-white dark:bg-mimi-dark/20 shadow-md hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 bg-mimi-primary text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm">
                {language === 'ar' ? "موصى به" : "Recommended"}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  {texts.premium[language]}
                </h2>
                <div className="flex items-end">
                  <span className="text-4xl font-bold">4.99</span>
                  <span className="text-muted-foreground ml-1">{texts.currency[language]}</span>
                </div>
                <p className="text-muted-foreground">
                  {texts.perMonth[language]}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {texts.features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature[language]}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-mimi-primary hover:bg-mimi-secondary">
                {texts.upgrade[language]}
              </Button>
            </div>
          </div>
          
          {/* Payment options */}
          <div className="border rounded-xl p-8 bg-white dark:bg-mimi-dark/20">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {texts.paymentOptions.title[language]}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Egypt payment options */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-mimi-primary">
                  {texts.paymentOptions.egypt[language]}
                </h3>
                <ul className="space-y-2">
                  {texts.paymentOptions.options.egypt.map((option, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-mimi-primary mr-2" />
                      {option[language]}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Global payment options */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-mimi-primary">
                  {texts.paymentOptions.global[language]}
                </h3>
                <ul className="space-y-2">
                  {texts.paymentOptions.options.global.map((option, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-mimi-primary mr-2" />
                      {option[language]}
                    </li>
                  ))}
                </ul>
                
                {/* PayPal Payment Button */}
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2"
                  >
                    <PayPal className="w-5 h-5" />
                    {language === 'ar' ? "الدفع عبر باي بال" : "Pay with PayPal"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
