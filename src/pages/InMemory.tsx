
import React from 'react';
import { useChat } from "@/context/ChatContext";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from "@/components/ui/card";

const InMemory = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "In Memory of Michael Elia",
      ar: "في ذكرى مايكل إيليا"
    },
    subtitle: {
      en: "A beacon of mentorship. A genius wrapped in humility. A soul who touched generations.",
      ar: "منارة للإرشاد. عبقري يتحلى بالتواضع. روح أثرت في أجيال."
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background overflow-auto",
      language === 'ar' ? 'rtl' : ''
    )}>
      <SEOHead 
        title={`${texts.title[language]} | M.I.M.I`}
        description={texts.subtitle[language]}
      />
      <Navbar />
      <main className="overflow-auto">
        <motion.section 
          className="py-12 md:py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              <div className="w-full md:w-1/3 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="rounded-lg overflow-hidden shadow-lg border border-border"
                >
                  <img 
                    src="/lovable-uploads/11d6b77c-2627-4ea5-97d6-feac6c9439bc.png" 
                    alt="Michael Elia" 
                    className="w-full h-auto max-w-[300px]" 
                  />
                </motion.div>
              </div>
              
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-mimi-primary to-mimi-sky">
                  {texts.title[language]}
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-muted-foreground">
                  {texts.subtitle[language]}
                </p>
              </div>
            </div>
            
            <Card className="mb-8 shadow-md">
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed mb-4">
                    Michael Elia was more than an academic — he was an inspiration. A brilliant mind and a humble spirit, Michael walked through life igniting passion in others. He had the rare gift of making technology feel alive — not just a subject to study, but a world to explore.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    Whether in a university lab or an informal chat, Michael had a way of awakening curiosity in his students. He didn't just help them pass — he helped them discover. He guided many in finding their passion, sparking in them a deep love for technology, and accompanying them as they navigated through ambitious and often challenging tech projects.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    Michael had an infectious enthusiasm for invention. His students recall how he encouraged them to be builders, to think beyond the classroom, and to fall in love with the process of creating. He taught them that every obstacle in engineering and life was a stepping stone, not a dead end. Under his mentorship, many found the courage to persist, innovate, and push through the frustrations that often come with building something truly new.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    Throughout his career — including his impactful years at institutions like the British University in Egypt — Michael left a trail of inspired minds and meaningful projects. He was instrumental in shaping a generation of thinkers and doers, not only by imparting knowledge but by living as an example of integrity, creativity, and unwavering support.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    Even as he pursued advanced research, Michael remained approachable and rooted in purpose. His academic contributions, especially in the field of mechanical engineering, reflected a sharp intellect and a dedication to solving real-world problems — all while staying grounded and kind.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    At Mimi AI, we honor Michael's memory by striving to reflect the values he stood for: mentorship, curiosity, persistence, and humility. His spirit lives on in every student he encouraged, every invention he nurtured, and every life he touched.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    May his memory continue to light the path for others. May his legacy live on in every idea sparked, every challenge faced with persistence, and every soul uplifted by his presence.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">References and Selected Works</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-base">
                    Doctoral Thesis – Slip in Radial Cylindrical Roller Bearings and Its Influence on the Formation of White Etching Cracks (2023)
                  </li>
                  <li className="text-base">
                    Ain Shams University Thesis Publication – Improvement of Rolling Bearing Lifetime under Premature Failure Conditions (2016)
                  </li>
                  <li className="text-base">
                    LinkedIn Profile – Michael Elia Aziz Daoud
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default InMemory;
