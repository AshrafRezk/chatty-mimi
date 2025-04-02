
import { useChat } from "@/context/ChatContext";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    dailyThought: {
      en: "Mimi's Thought of the Day",
      ar: "فكرة ميمي لليوم"
    },
    quote: {
      en: "The best way to predict the future is to create it.",
      ar: "أفضل طريقة للتنبؤ بالمستقبل هي أن تصنعه."
    },
    getStarted: {
      en: "Get started now",
      ar: "ابدأ الآن"
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background",
      language === 'ar' ? 'rtl' : ''
    )}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        
        {/* Daily thought section */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h3 className="text-xl text-muted-foreground mb-2">
              {texts.dailyThought[language]}
            </h3>
            <p className="text-2xl md:text-3xl font-medium italic mb-8">
              "{texts.quote[language]}"
            </p>
            <Button 
              as={Link} 
              to="/chat" 
              size="lg"
              className="bg-mimi-primary hover:bg-mimi-secondary"
            >
              {texts.getStarted[language]}
            </Button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 px-4 border-t">
          <div className="container mx-auto text-center text-muted-foreground">
            &copy; 2023 Mimi Chat. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
