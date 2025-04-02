
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

const Features = () => {
  const { state } = useChat();
  const { language } = state;
  
  const featuresData = {
    title: {
      en: "Features that make Mimi special",
      ar: "ميزات تجعل ميمي مميزة"
    },
    features: [
      {
        icon: "🌍",
        title: {
          en: "Location Aware",
          ar: "على دراية بموقعك"
        },
        description: {
          en: "Mimi knows where you are and adapts her conversations accordingly.",
          ar: "ميمي تعرف أين أنت وتكيف محادثاتها وفقًا لذلك."
        }
      },
      {
        icon: "🗣️",
        title: {
          en: "Multilingual",
          ar: "متعددة اللغات"
        },
        description: {
          en: "Switch between languages seamlessly, with full Arabic support.",
          ar: "تنقل بين اللغات بسلاسة، مع دعم كامل للغة العربية."
        }
      },
      {
        icon: "😊",
        title: {
          en: "Emotional Intelligence",
          ar: "ذكاء عاطفي"
        },
        description: {
          en: "Chat in different moods and get responses that match your emotional state.",
          ar: "دردش بمزاج مختلف واحصل على ردود تناسب حالتك العاطفية."
        }
      },
      {
        icon: "🌙",
        title: {
          en: "Dark Mode",
          ar: "الوضع الداكن"
        },
        description: {
          en: "Easy on the eyes with a beautiful dark theme option.",
          ar: "مريح للعيون مع خيار مظهر داكن جميل."
        }
      },
      {
        icon: "⚡",
        title: {
          en: "Fast Responses",
          ar: "ردود سريعة"
        },
        description: {
          en: "Get quick and thoughtful answers to your questions.",
          ar: "احصل على إجابات سريعة ومدروسة لأسئلتك."
        }
      },
      {
        icon: "🔒",
        title: {
          en: "Premium Features",
          ar: "ميزات متميزة"
        },
        description: {
          en: "Unlock more capabilities with our affordable premium plan.",
          ar: "افتح المزيد من الإمكانيات مع خطتنا المتميزة بأسعار معقولة."
        }
      }
    ]
  };

  return (
    <section className={cn(
      "py-16 px-4 bg-mimi-soft/30 dark:bg-mimi-dark/30",
      language === 'ar' ? 'rtl' : ''
    )}>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">
          {featuresData.title[language]}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-mimi-dark/40 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-mimi-primary">
                {feature.title[language]}
              </h3>
              <p className="text-muted-foreground">
                {feature.description[language]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
