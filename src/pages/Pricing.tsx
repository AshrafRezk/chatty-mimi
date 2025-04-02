
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import SEOHead from '@/components/SEOHead';

const Pricing = () => {
  const { theme } = useTheme();
  const { state } = useChat();
  const { language } = state;

  const pricingData = [
    {
      title: language === 'ar' ? 'الباقة المجانية' : 'Free Plan',
      price: language === 'ar' ? 'مجاناً' : 'Free',
      features: [
        language === 'ar' ? '5 رسائل يومياً' : '5 messages per day',
        language === 'ar' ? 'محادثة أساسية' : 'Basic chat capabilities',
        language === 'ar' ? 'دعم اللغة العربية والإنجليزية' : 'Arabic and English support',
      ],
      cta: language === 'ar' ? 'البدء مجاناً' : 'Start for Free',
      variant: 'outline' as const,
    },
    {
      title: language === 'ar' ? 'الباقة المميزة' : 'Premium Plan',
      price: language === 'ar' ? '10 جنيه مصري/شهر' : '10 EGP/month',
      features: [
        language === 'ar' ? 'محادثات غير محدودة' : 'Unlimited messages',
        language === 'ar' ? 'دعم جميع التخصصات' : 'All expert personas',
        language === 'ar' ? 'البحث المتقدم على الويب' : 'Advanced web searching',
        language === 'ar' ? 'تحليل الصور' : 'Image analysis',
        language === 'ar' ? 'المحادثات الصوتية' : 'Voice conversations',
        language === 'ar' ? 'تحويل النص إلى كلام' : 'Text-to-speech capabilities',
      ],
      cta: language === 'ar' ? 'ترقية الآن' : 'Upgrade Now',
      variant: 'default' as const,
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <SEOHead title={language === 'ar' ? "ميمي - الأسعار" : "Mimi - Pricing"} />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center mb-8">
          {language === 'ar' ? 'اختر خطتك' : 'Choose Your Plan'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingData.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-lg shadow-md",
                plan.highlight
                  ? "bg-gradient-to-br from-primary to-secondary text-white"
                  : "bg-card text-card-foreground dark:bg-card dark:text-card-foreground",
                plan.highlight ? "border-4 border-accent" : "border border-input",
                "flex flex-col justify-between"
              )}
            >
              <div>
                <h2 className="text-2xl font-semibold mb-4">{plan.title}</h2>
                <p className="text-xl mb-4">
                  {plan.price}
                </p>
                <ul className="list-disc pl-5 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/chat">
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
