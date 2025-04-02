import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import MoodSelector from "./MoodSelector";
import PersonaSelector from "./PersonaSelector";
import ThinkingAnimation from "./ThinkingAnimation";
import VoiceChat from "./VoiceChat";
import SuggestedQuestions from "./SuggestedQuestions";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getWelcomeMessage, getPersonaWelcomeMessage } from "@/utils/locationUtils";
import { generateGeminiResponse } from "@/utils/geminiUtils";
import { performWebSearch, calculateCertaintyScore } from "@/utils/searchUtils";
import { toast } from "sonner";
import { NutritionData, PropertyData, PropertyImage, Reference } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Motion } from "@/components/ui/motion";
import { ChevronDown, ChevronUp, Mic } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { scheduleWeatherNotification, scheduleTipNotification } from "@/utils/pushNotificationUtils";

const ChatInterface = () => {
  const { state, addMessage, setTyping, clearMessages, setVoiceMode } = useChat();
  const { messages, mood, language, isTyping, userLocation, aiConfig, isVoiceMode } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const welcomeMessageSentRef = useRef(false);
  
  const messageReceivedSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    messageReceivedSound.current = new Audio('/sounds/message-received.mp3');
    if (messageReceivedSound.current) messageReceivedSound.current.volume = 0.3;
    
    return () => {
      messageReceivedSound.current = null;
    };
  }, []);

  // Schedule daily notifications if user has granted permission
  useEffect(() => {
    if (userLocation && Notification.permission === 'granted') {
      // Schedule a weather notification once per day
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0); // 8 AM
      
      const timeUntilTomorrow = tomorrow.getTime() - now.getTime();
      
      // Show weather notification now if it's morning
      if (now.getHours() >= 8 && now.getHours() <= 10) {
        scheduleWeatherNotification(userLocation);
      }
      
      // Schedule next weather notification
      setTimeout(() => {
        scheduleWeatherNotification(userLocation);
        // Then schedule it daily
        setInterval(() => scheduleWeatherNotification(userLocation), 24 * 60 * 60 * 1000);
      }, timeUntilTomorrow);
      
      // Schedule tips every 2 days
      setTimeout(() => {
        scheduleTipNotification();
        setInterval(() => scheduleTipNotification(), 2 * 24 * 60 * 60 * 1000);
      }, 4 * 60 * 60 * 1000); // First tip after 4 hours of using the app
    }
  }, [userLocation]);
  
  const playMessageReceivedSound = () => {
    if (messageReceivedSound.current) {
      messageReceivedSound.current.currentTime = 0;
      messageReceivedSound.current.play().catch(err => console.error("Error playing sound:", err));
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageSentRef.current) {
      welcomeMessageSentRef.current = true;
      const welcomeMessage = getWelcomeMessage(userLocation, language);
      const personaInfo = getPersonaWelcomeMessage(aiConfig.persona, language);
      
      const fullWelcomeMessage = `${welcomeMessage}${personaInfo ? `\n\n${personaInfo}` : ''}`;
      
      const typingTimer = setTimeout(() => {
        setTyping(true);
        
        const messageTimer = setTimeout(() => {
          setTyping(false);
          playMessageReceivedSound();
          addMessage({
            text: fullWelcomeMessage,
            sender: "assistant",
          });
        }, 1500);
        
        return () => clearTimeout(messageTimer);
      }, 500);
      
      return () => clearTimeout(typingTimer);
    }
  }, [messages.length, userLocation, language, addMessage, setTyping, aiConfig.persona]);
  
  useEffect(() => {
    return () => {
      if (messages.length === 0) {
        welcomeMessageSentRef.current = false;
      }
    };
  }, [messages]);
  
  const extractNutritionData = (text: string): NutritionData | undefined => {
    if (aiConfig.persona !== 'diet_coach') return undefined;
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*"calories"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData && 
            typeof jsonData.calories === 'number' && 
            typeof jsonData.protein === 'number' && 
            typeof jsonData.fats === 'number' && 
            typeof jsonData.carbohydrates === 'number') {
          return {
            calories: jsonData.calories,
            protein: jsonData.protein,
            fats: jsonData.fats,
            carbohydrates: jsonData.carbohydrates
          };
        }
      }
    } catch (error) {
      console.error("Error parsing nutrition data:", error);
    }
    
    return undefined;
  };

  const extractPropertyData = (text: string): PropertyData | undefined => {
    if (aiConfig.persona !== 'real_estate') return undefined;
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*"price"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData && 
            typeof jsonData.price === 'number' && 
            typeof jsonData.location === 'string' && 
            typeof jsonData.area === 'number' && 
            typeof jsonData.bedrooms === 'number' && 
            typeof jsonData.bathrooms === 'number') {
          
          return {
            price: jsonData.price,
            location: jsonData.location,
            area: jsonData.area,
            bedrooms: jsonData.bedrooms,
            bathrooms: jsonData.bathrooms,
            paymentPlan: jsonData.paymentPlan ? {
              downPayment: jsonData.paymentPlan.downPayment,
              monthlyInstallment: jsonData.paymentPlan.monthlyInstallment,
              years: jsonData.paymentPlan.years
            } : undefined
          };
        }
      }
    } catch (error) {
      console.error("Error parsing property data:", error);
    }
    
    return undefined;
  };

  const createImageUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };
  
  const handleSendMessage = async (text: string, imageFile: File | null = null) => {
    const imageSrc = imageFile ? createImageUrl(imageFile) : undefined;
    
    addMessage({
      text,
      sender: "user",
      imageSrc
    });
    
    setTyping(true);
    
    try {
      const locationString = userLocation 
        ? `${userLocation.city}, ${userLocation.country} (${userLocation.countryCode})` 
        : null;
      
      let references: Reference[] = [];
      let certaintyScore = 0;
      let response = "";
      let propertyImages: PropertyImage[] | undefined;
      let imageBase64: string | null = null;
      
      if (imageFile && imageFile.type.startsWith('image/')) {
        try {
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      }
      
      // Always try to do web search for more accurate and referenced responses
      try {
        references = await performWebSearch(text);
        certaintyScore = calculateCertaintyScore(references);
      } catch (error) {
        console.error("Web search error:", error);
      }
      
      try {
        const referencesContext = references.length > 0 
          ? `Relevant information from web search:
            ${references.map(ref => `- ${ref.title}: ${ref.snippet}`).join('\n')}`
          : '';
          
        const responseData = await generateGeminiResponse(
          text, 
          messages,
          language, 
          mood,
          locationString,
          aiConfig.persona,
          referencesContext,
          imageBase64
        );
        
        response = responseData.text;
        propertyImages = responseData.propertyImages;
        
      } catch (error) {
        console.error("Gemini API error:", error);
        
        if (references.length > 0) {
          response = `Based on available information${language === 'ar' ? '، ' : ': '}`;
          references.forEach((ref, index) => {
            response += `\n\n${ref.snippet}`;
            if (index < references.length - 1) {
              response += language === 'ar' ? '، ' : '; ';
            }
          });
        } else {
          response = language === 'ar' 
            ? "عذراً، لا يمكنني الوصول إلى معلومات كافية للإجابة على سؤالك حالياً. يرجى المحاولة مرة أخرى لاحقاً."
            : "I apologize, but I don't have enough information to answer your question at the moment. Please try again later.";
        }
      }
      
      const nutritionData = extractNutritionData(response);
      
      const propertyData = extractPropertyData(response);
      
      if (nutritionData) {
        response = response.replace(/\{[\s\S]*"calories"[\s\S]*\}/, '');
      }
      
      if (propertyData) {
        response = response.replace(/\{[\s\S]*"price"[\s\S]*\}/, '');
      }
      
      setTyping(false);
      playMessageReceivedSound();
      
      // Fast response for feature questions
      const isFeatureQuestion = text.toLowerCase().includes("what can you do") || 
                               text.toLowerCase().includes("your features") ||
                               text.toLowerCase().includes("what are your capabilities") ||
                               text.toLowerCase().includes("tell me about your features");
      
      const featuresResponse = language === 'ar' ? 
        "أنا ميمي، مساعدك الذكي الاصطناعي مع العديد من الميزات المتقدمة:\n\n" +
        "• دعم متعدد اللغات (العربية والإنجليزية)\n" +
        "• وعي بالموقع الجغرافي لتقديم إجابات مخصصة\n" +
        "• خبير في مجالات متعددة (برمجة، طب، عقارات، إلخ)\n" +
        "• إمكانية معالجة الصور وتحليلها\n" +
        "• محادثة بأنماط مزاجية مختلفة (هادئ، ودي، عميق، مركّز)\n" +
        "• إنشاء مخططات ورسومات بيانية تفاعلية\n" +
        "• تحويل النص إلى كلام\n" +
        "• دعم المحادثات الصوتية\n" +
        "• تلخيص المحتوى وتحليله\n" +
        "• توفير مراجع موثوقة للمعلومات\n" +
        "• خبرة في تحليل القيم الغذائية للأطعمة\n" +
        "• استشارات عقارية مع رؤى استثمارية\n\n" +
        "كيف يمكنني مساعدتك اليوم؟" :
        
        "I'm Mimi, your intelligent AI assistant with multiple advanced features:\n\n" +
        "• Multilingual support (English and Arabic)\n" +
        "• Location awareness for personalized answers\n" +
        "• Expert in multiple domains (programming, medicine, real estate, etc.)\n" +
        "• Image processing and analysis capabilities\n" +
        "• Conversation in different moods (calm, friendly, deep, focused)\n" +
        "• Interactive chart and visualization creation\n" +
        "• Text-to-speech functionality\n" +
        "• Voice chat support\n" +
        "• Content summarization and analysis\n" +
        "• Reliable reference sourcing\n" +
        "• Nutrition analysis for foods\n" +
        "• Real estate consultation with investment insights\n\n" +
        "How can I assist you today?";
                               
      if (isFeatureQuestion) {
        response = featuresResponse;
      }
      
      addMessage({
        text: response,
        sender: "assistant",
        references: references.length > 0 ? references : undefined,
        certaintyScore: certaintyScore > 0 ? certaintyScore : undefined,
        nutritionData,
        propertyData,
        propertyImages
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      setTyping(false);
      
      addMessage({
        text: language === 'ar' 
          ? "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى."
          : "Sorry, there was an error processing your request. Please try again.",
        sender: "assistant",
      });
      
      toast.error(language === 'ar' 
        ? "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي"
        : "Error connecting to the AI service");
    }
    
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
  };
  
  const handleVoiceChatClose = () => {
    setShowVoiceChat(false);
    setVoiceMode(false);
  };
  
  const toggleVoiceChat = () => {
    setShowVoiceChat(!showVoiceChat);
    setVoiceMode(!showVoiceChat);
  };
  
  const getTextColor = () => {
    switch (mood) {
      case 'deep':
      case 'focus':
        return 'text-white';
      default:
        return '';
    }
  };

  const getMoodStyle = () => {
    const baseClasses = "flex flex-col rounded-lg shadow-lg transition-colors";
    
    const heightClass = isMobile 
      ? "h-[calc(100vh-6rem)]" 
      : "h-[calc(100vh-12rem)]";
    
    const mobileClasses = isMobile ? "mx-0 rounded-none" : "";
    
    switch (mood) {
      case 'calm':
        return cn(baseClasses, heightClass, "bg-calm-gradient", mobileClasses);
      case 'friendly':
        return cn(baseClasses, heightClass, "bg-friendly-gradient", mobileClasses);
      case 'deep':
        return cn(baseClasses, heightClass, "bg-deep-gradient text-white", mobileClasses);
      case 'focus':
        return cn(baseClasses, heightClass, "bg-focus-gradient text-white", mobileClasses);
      default:
        return cn(baseClasses, heightClass, "bg-background", mobileClasses);
    }
  };

  if (isMobile) {
    return (
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={getMoodStyle()}
      >
        <Collapsible 
          className="px-2 bg-background/50 backdrop-blur-sm"
          open={moodSelectorOpen}
          onOpenChange={setMoodSelectorOpen}
        >
          <div className="flex justify-center py-1">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-full flex items-center justify-center rounded-full opacity-70 hover:opacity-100"
              >
                {moodSelectorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="ml-1 text-xs">
                  {moodSelectorOpen ? 
                    (language === 'ar' ? "إخفاء الإعدادات" : "Hide Settings") : 
                    (language === 'ar' ? "الإعدادات" : "Settings")}
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pb-2">
            <div className="space-y-2">
              <MoodSelector />
              <PersonaSelector />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className={cn(
          "flex-1 px-3 pb-3 pt-0 overflow-y-auto space-y-3",
          getTextColor()
        )}>
          {messages.length > 0 && <SuggestedQuestions />}
          
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex mb-4 animate-fade-in">
              <div className={cn(
                "chat-bubble-assistant",
                mood === 'deep' || mood === 'focus' ? "bg-white/20" : ""
              )}>
                <ThinkingAnimation />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef}></div>
        </div>
        
        <div className="p-3 border-t bg-background/80 backdrop-blur-sm rounded-b-lg flex flex-col">
          <ChatInput onSendMessage={handleSendMessage} />
          
          <Button
            variant="outline"
            size="sm"
            className="mt-2 self-center rounded-full bg-white/90 border border-gray-200 shadow-sm"
            onClick={toggleVoiceChat}
          >
            <Mic className="h-4 w-4 mr-2" />
            {language === 'ar' ? "وضع الصوت" : "Voice Mode"}
          </Button>
        </div>
        
        {showVoiceChat && (
          <VoiceChat onSendMessage={handleSendMessage} onClose={handleVoiceChatClose} />
        )}
      </Motion.div>
    );
  }
  
  return (
    <Motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={getMoodStyle()}
    >
      <div className="p-2 md:p-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <MoodSelector />
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVoiceChat}
            className="rounded-full bg-white/90 border border-gray-200 shadow-sm"
          >
            <Mic className="h-4 w-4 mr-2" />
            {language === 'ar' ? "وضع الصوت" : "Voice Mode"}
          </Button>
        </div>
        <PersonaSelector />
      </div>
      
      <div className={cn(
        "flex-1 p-3 md:p-4 overflow-y-auto space-y-3 md:space-y-4",
        getTextColor()
      )}>
        {messages.length > 0 && <SuggestedQuestions />}
        
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex mb-4 animate-fade-in">
            <div className={cn(
              "chat-bubble-assistant",
              mood === 'deep' || mood === 'focus' ? "bg-white/20" : ""
            )}>
              <ThinkingAnimation />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      <div className="p-3 md:p-4 border-t bg-background/80 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      
      {showVoiceChat && (
        <VoiceChat onSendMessage={handleSendMessage} onClose={handleVoiceChatClose} />
      )}
    </Motion.div>
  );
};

export default ChatInterface;
