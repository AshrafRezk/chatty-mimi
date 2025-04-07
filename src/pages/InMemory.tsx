
import React from 'react';
import { useChat } from "@/context/ChatContext";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SEOHead from '@/components/SEOHead';

const InMemory = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "In Memory of Michael Elia",
      ar: "في ذكرى مايكل إيليا"
    },
    subtitle: {
      en: "A tribute to an extraordinary person",
      ar: "تكريم لشخص استثنائي"
    },
    description: {
      en: "Michael Elia was a visionary leader, mentor, and innovator whose contributions have left an indelible mark on our organization and the technology community. His passion for excellence and commitment to pushing the boundaries of what's possible have inspired us to create Mimi AI as a testament to his forward-thinking approach.",
      ar: "كان مايكل إيليا قائدًا ذو رؤية، ومرشدًا، ومبتكرًا تركت مساهماته علامة لا تمحى على منظمتنا ومجتمع التكنولوجيا. ألهمنا شغفه بالتميز والتزامه بدفع حدود ما هو ممكن لإنشاء ميمي الذكاء الاصطناعي كشهادة على نهجه المستقبلي."
    },
    legacy: {
      en: "Michael's legacy lives on through our work and the countless lives he touched. We strive every day to honor his memory by embodying the values he championed: innovation, integrity, and the relentless pursuit of creating technology that enhances human connection.",
      ar: "يستمر إرث مايكل من خلال عملنا والعديد من الأرواح التي لمسها. نسعى كل يوم لتكريم ذكراه من خلال تجسيد القيم التي دافع عنها: الابتكار والنزاهة والسعي الدؤوب لإنشاء تكنولوجيا تعزز الاتصال البشري."
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background overflow-auto",
      language === 'ar' ? 'rtl' : ''
    )}>
      <SEOHead 
        title={`${texts.title[language]} | Mimi AI`}
        description={texts.description[language]}
      />
      <Navbar />
      <main className="overflow-auto">
        <motion.section 
          className="py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              {texts.title[language]}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              {texts.subtitle[language]}
            </p>
            
            <div className="mb-12 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-mimi-primary/10 flex items-center justify-center">
                <span className="text-5xl">🕊️</span>
              </div>
            </div>
            
            <div className="space-y-8 text-left">
              <p className="text-lg leading-relaxed">
                {texts.description[language]}
              </p>
              <p className="text-lg leading-relaxed">
                {texts.legacy[language]}
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default InMemory;
