
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Hero = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "Meet Mimi",
      ar: "تعرّف على ميمي"
    },
    subtitle: {
      en: "Your emotionally intelligent AI chat companion",
      ar: "رفيقك الذكي عاطفياً في المحادثات"
    },
    description: {
      en: "Mimi adapts to your location, language, and mood. Experience a chat that understands not just what you say, but how you feel.",
      ar: "ميمي تتكيف مع موقعك ولغتك ومزاجك. استمتع بتجربة محادثة تفهم ليس فقط ما تقوله، بل كيف تشعر."
    },
    startChat: {
      en: "Start chatting",
      ar: "ابدأ المحادثة"
    },
    learnMore: {
      en: "Learn more",
      ar: "اعرف المزيد"
    }
  };

  return (
    <section className={cn(
      "py-20 px-4 flex flex-col items-center justify-center text-center",
      language === 'ar' ? 'rtl' : ''
    )}>
      <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text animate-fade-in">
        {texts.title[language]}
      </h1>
      <p className="text-xl md:text-2xl mb-6 text-muted-foreground animate-fade-in delay-100">
        {texts.subtitle[language]}
      </p>
      <p className="max-w-2xl mb-8 animate-fade-in delay-200">
        {texts.description[language]}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
        <Button 
          as={Link} 
          to="/chat" 
          size="lg"
          className="bg-mimi-primary hover:bg-mimi-secondary"
        >
          {texts.startChat[language]}
        </Button>
        <Button 
          as={Link} 
          to="/pricing" 
          variant="outline"
          size="lg"
          className="border-mimi-primary text-mimi-primary hover:bg-mimi-soft"
        >
          {texts.learnMore[language]}
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="mt-16 relative w-full max-w-4xl animate-fade-in delay-400">
        <div className="rounded-xl overflow-hidden shadow-xl border">
          <div className="bg-mimi-dark/5 dark:bg-mimi-dark/40 h-12 flex items-center px-4 border-b">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-mimi-soft dark:from-mimi-dark dark:to-mimi-dark/80 h-80 flex items-center justify-center relative">
            <div className="chat-bubble-assistant absolute top-10 left-10">
              <p>{language === 'ar' ? "مرحباً! كيف يمكنني مساعدتك اليوم؟" : "Hello! How can I help you today?"}</p>
            </div>
            <div className="chat-bubble-user absolute bottom-10 right-10">
              <p>{language === 'ar' ? "أنا سعيد بالتحدث معك!" : "I'm happy to chat with you!"}</p>
            </div>
            <div className="w-24 h-24 rounded-full bg-mimi-primary/20 flex items-center justify-center animate-bounce-soft">
              <div className="text-4xl">👋</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
