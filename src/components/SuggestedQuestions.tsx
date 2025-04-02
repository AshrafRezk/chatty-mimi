
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SuggestedQuestions = () => {
  const { state, addMessage, setTyping } = useChat();
  const { messages, language, aiConfig } = state;

  // Default suggested questions for new users
  const getInitialSuggestions = () => {
    if (aiConfig.persona === 'real_estate') {
      return [
        {
          en: "Help me find a property in Downtown with a budget of $500,000",
          ar: "ساعدني في العثور على عقار في وسط المدينة بميزانية 500,000 دولار"
        },
        {
          en: "What's the best mortgage plan for a $300,000 property with 20% down payment?",
          ar: "ما هي أفضل خطة رهن عقاري لعقار بقيمة 300,000 دولار مع دفعة أولى 20٪؟"
        },
        {
          en: "Compare investment properties in urban vs. suburban areas",
          ar: "قارن بين العقارات الاستثمارية في المناطق الحضرية والضواحي"
        }
      ];
    }

    if (aiConfig.persona === 'diet_coach') {
      return [
        {
          en: "Analyze the nutrition of a grilled chicken salad",
          ar: "حلل القيمة الغذائية لسلطة الدجاج المشوي"
        },
        {
          en: "Help me create a low-carb meal plan for the week",
          ar: "ساعدني في إنشاء خطة وجبات منخفضة الكربوهيدرات للأسبوع"
        },
        {
          en: "What are the healthiest snack options for weight loss?",
          ar: "ما هي خيارات الوجبات الخفيفة الأكثر صحة لفقدان الوزن؟"
        }
      ];
    }

    return [
      {
        en: "What can Mimi help me with?",
        ar: "كيف يمكن لميمي مساعدتي؟"
      },
      {
        en: "Tell me about the different personas you offer",
        ar: "أخبرني عن الشخصيات المختلفة التي تقدمها"
      },
      {
        en: "What makes Mimi different from other AI assistants?",
        ar: "ما الذي يميز ميمي عن مساعدي الذكاء الاصطناعي الآخرين؟"
      }
    ];
  };

  // Dynamic suggestions based on the conversation
  const getDynamicSuggestions = () => {
    // If there's a conversation going, provide context-aware suggestions
    if (messages.length > 2) {
      // For real estate persona
      if (aiConfig.persona === 'real_estate') {
        const lastMessage = messages[messages.length - 1];
        
        // If discussing property
        if (lastMessage.text.toLowerCase().includes("property") || 
            lastMessage.text.toLowerCase().includes("house") || 
            lastMessage.text.toLowerCase().includes("apartment") ||
            lastMessage.propertyData) {
          return [
            {
              en: "Can you show me payment plans for this property?",
              ar: "هل يمكنك إظهار خطط الدفع لهذا العقار؟"
            },
            {
              en: "Are there similar properties in other neighborhoods?",
              ar: "هل هناك عقارات مماثلة في أحياء أخرى؟"
            },
            {
              en: "What are the market trends for this area?",
              ar: "ما هي اتجاهات السوق لهذه المنطقة؟"
            }
          ];
        }
        
        return [
          {
            en: "What's my ideal budget based on my income?",
            ar: "ما هي ميزانيتي المثالية بناءً على دخلي؟"
          },
          {
            en: "Recommend investment properties with good ROI",
            ar: "اقترح عقارات استثمارية ذات عائد استثمار جيد"
          },
          {
            en: "What documents do I need for a mortgage?",
            ar: "ما هي المستندات التي أحتاجها للحصول على رهن عقاري؟"
          }
        ];
      }
      
      // For diet coach persona
      if (aiConfig.persona === 'diet_coach') {
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage.nutritionData) {
          return [
            {
              en: "How can I make this meal healthier?",
              ar: "كيف يمكنني جعل هذه الوجبة أكثر صحة؟"
            },
            {
              en: "What's a good substitute for the high-fat ingredients?",
              ar: "ما هو البديل الجيد للمكونات عالية الدهون؟"
            },
            {
              en: "Add this to my daily nutrition plan",
              ar: "أضف هذا إلى خطتي الغذائية اليومية"
            }
          ];
        }
      }
    }

    // Default return for other personas or situations
    return getInitialSuggestions();
  };
  
  const questions = messages.length < 2 ? getInitialSuggestions() : getDynamicSuggestions();
  
  const handleQuestionClick = (question: string) => {
    addMessage({
      text: question,
      sender: 'user'
    });
    setTyping(true);
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className={cn(
      "mt-2 mb-3 px-2",
      language === 'ar' ? 'rtl' : ''
    )}>
      <p className="text-xs text-muted-foreground mb-1.5">
        {language === 'ar' ? 'اقتراحات:' : 'Suggestions:'}
      </p>
      <motion.div 
        className="flex flex-wrap gap-2"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {questions.map((question, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-xs bg-background/80 hover:bg-background border border-muted",
                language === 'ar' ? 'rtl' : ''
              )}
              onClick={() => handleQuestionClick(language === 'ar' ? question.ar : question.en)}
            >
              {language === 'ar' ? question.ar : question.en}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SuggestedQuestions;
