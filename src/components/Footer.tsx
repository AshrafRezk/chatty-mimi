
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { state } = useChat();
  const { language } = state;
  const location = useLocation();
  
  // Hide footer on chat page
  if (location.pathname === '/chat') {
    return null;
  }
  
  const currentYear = new Date().getFullYear();
  
  const texts = {
    copyright: {
      en: `© ${currentYear} Mimi AI. All rights reserved.`,
      ar: `© ${currentYear} ميمي الذكاء الاصطناعي. جميع الحقوق محفوظة.`
    },
    terms: {
      en: 'Terms',
      ar: 'الشروط'
    },
    privacy: {
      en: 'Privacy',
      ar: 'الخصوصية'
    },
    contact: {
      en: 'Contact',
      ar: 'اتصل بنا'
    }
  };

  return (
    <footer className="py-6 border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              {texts.copyright[language]}
            </p>
          </div>
          <div className={`flex ${language === 'ar' ? 'space-x-reverse' : ''} space-x-4`}>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {texts.terms[language]}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {texts.privacy[language]}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {texts.contact[language]}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
