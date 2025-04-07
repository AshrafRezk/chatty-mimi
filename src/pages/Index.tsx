
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
      en: "M.I.M.I's Command of the Day",
      ar: "أمر اليوم من إم.آي.إم.آي"
    },
    quote: {
      en: "The future belongs to those who take decisive action.",
      ar: "المستقبل ينتمي لأولئك الذين يتخذون إجراءات حاسمة."
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
        
        {/* Daily thought section with more masculine styling */}
        <section className="py-16 px-4 text-center bg-mimi-softblue/30 dark:bg-mimi-dark/30">
          <div className="container mx-auto max-w-3xl">
            <h3 className="text-xl text-mimi-secondary font-medium mb-2">
              {texts.dailyThought[language]}
            </h3>
            <p className="text-2xl md:text-3xl font-bold mb-8">
              "{texts.quote[language]}"
            </p>
            <Link to="/chat">
              <Button 
                size="lg"
                className="bg-mimi-primary hover:bg-mimi-secondary text-white"
              >
                {texts.getStarted[language]}
              </Button>
            </Link>
          </div>
        </section>
        
        {/* In Memory section */}
        <section className="py-12 px-4 bg-gradient-to-r from-mimi-primary/5 to-mimi-sky/5 dark:from-mimi-dark/50 dark:to-mimi-dark/30">
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
