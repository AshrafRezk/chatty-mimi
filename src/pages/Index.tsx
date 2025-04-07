
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
    },
    inMemory: {
      en: "In Memory of Michael Elia",
      ar: "في ذكرى مايكل إيليا"
    },
    visitMemorial: {
      en: "Visit our memorial page",
      ar: "زيارة صفحة الذكرى"
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background overflow-auto",
      language === 'ar' ? 'rtl' : ''
    )}>
      <Navbar />
      <main className="overflow-auto">
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
            <Link to="/chat">
              <Button 
                size="lg"
                className="bg-mimi-primary hover:bg-mimi-secondary"
              >
                {texts.getStarted[language]}
              </Button>
            </Link>
          </div>
        </section>
        
        {/* In Memory section */}
        <section className="py-12 px-4 bg-mimi-soft/30 dark:bg-mimi-dark/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-medium mb-4">
              {texts.inMemory[language]}
            </h3>
            <Link to="/in-memory">
              <Button 
                variant="outline" 
                className="border-mimi-primary text-mimi-primary hover:bg-mimi-soft"
              >
                {texts.visitMemorial[language]}
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
