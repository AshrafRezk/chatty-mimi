
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import MoodSelector from "./MoodSelector";
import PersonaSelector from "./PersonaSelector";
import ThinkingAnimation from "./ThinkingAnimation";
import VoiceChat from "./VoiceChat";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getWelcomeMessage } from "@/utils/locationUtils";
import { generateGeminiResponse } from "@/utils/geminiUtils";
import { performWebSearch, calculateCertaintyScore } from "@/utils/searchUtils";
import { toast } from "sonner";
import { NutritionData, PropertyData, Reference } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Motion } from "@/components/ui/motion";
import { ChevronDown, ChevronUp, Mic } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const ChatInterface = () => {
  const { state, addMessage, setTyping, clearMessages, setVoiceMode } = useChat();
  const { messages, mood, language, isTyping, userLocation, aiConfig, isVoiceMode } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const welcomeMessageSentRef = useRef(false);
  
  // Sound effects
  const messageReceivedSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sound on component mount
  useEffect(() => {
    messageReceivedSound.current = new Audio('/sounds/message-received.mp3');
    if (messageReceivedSound.current) messageReceivedSound.current.volume = 0.3;
    
    return () => {
      messageReceivedSound.current = null;
    };
  }, []);
  
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
  
  // Fix the welcome message duplication issue by using a ref instead of state
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageSentRef.current) {
      welcomeMessageSentRef.current = true;
      const welcomeMessage = getWelcomeMessage(userLocation, language);
      
      const typingTimer = setTimeout(() => {
        setTyping(true);
        
        const messageTimer = setTimeout(() => {
          setTyping(false);
          playMessageReceivedSound();
          addMessage({
            text: welcomeMessage,
            sender: "assistant",
          });
        }, 1500);
        
        return () => clearTimeout(messageTimer);
      }, 500);
      
      return () => clearTimeout(typingTimer);
    }
  }, [messages.length, userLocation, language, addMessage, setTyping]);
  
  // Reset welcome message flag when messages are cleared
  useEffect(() => {
    return () => {
      if (messages.length === 0) {
        welcomeMessageSentRef.current = false;
      }
    };
  }, [messages]);
  
  // Extract nutrition data from response if diet_coach persona
  const extractNutritionData = (text: string): NutritionData | undefined => {
    if (aiConfig.persona !== 'diet_coach') return undefined;
    
    try {
      // Look for JSON data at the end of the text
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

  // Extract property data from response if real_estate persona
  const extractPropertyData = (text: string): PropertyData | undefined => {
    if (aiConfig.persona !== 'real_estate') return undefined;
    
    try {
      // Look for JSON data with property information
      const jsonMatch = text.match(/\{[\s\S]*"price"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData && 
            typeof jsonData.price === 'number' && 
            typeof jsonData.location === 'string' && 
            typeof jsonData.area === 'number' && 
            typeof jsonData.bedrooms === 'number' && 
            typeof jsonData.bathrooms === 'number') {
          
          // The paymentPlan is optional
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

  // Function to create image URL from File
  const createImageUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };
  
  const handleSendMessage = async (text: string, imageFile: File | null = null) => {
    // Create image URL if file is provided
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
      let imageBase64: string | null = null;
      
      // Convert image to base64 if provided
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
      
      // Check if it's a query that likely needs web search
      const needsSearch = text.toLowerCase().startsWith("who is") || 
                          text.toLowerCase().includes("what is") || 
                          text.toLowerCase().includes("how to") ||
                          text.toLowerCase().includes("where is") ||
                          text.toLowerCase().includes("when was");
      
      if (aiConfig.webSearch && needsSearch) {
        try {
          // Perform real web search
          references = await performWebSearch(text);
          certaintyScore = calculateCertaintyScore(references);
        } catch (error) {
          console.error("Web search error:", error);
        }
      }
      
      try {
        // Include references in the context for better responses
        const referencesContext = references.length > 0 
          ? `Relevant information from web search:
            ${references.map(ref => `- ${ref.title}: ${ref.snippet}`).join('\n')}`
          : '';
          
        response = await generateGeminiResponse(
          text, 
          messages,
          language, 
          mood,
          locationString,
          aiConfig.persona,
          referencesContext,
          imageBase64
        );
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
      
      // Extract nutrition data if diet_coach persona
      const nutritionData = extractNutritionData(response);
      
      // Extract property data if real_estate persona
      const propertyData = extractPropertyData(response);
      
      // Clean up response by removing JSON data at the end if data was found
      if (nutritionData) {
        response = response.replace(/\{[\s\S]*"calories"[\s\S]*\}/, '');
      }
      
      if (propertyData) {
        response = response.replace(/\{[\s\S]*"price"[\s\S]*\}/, '');
      }
      
      setTyping(false);
      playMessageReceivedSound();
      
      addMessage({
        text: response,
        sender: "assistant",
        references: references.length > 0 ? references : undefined,
        certaintyScore: certaintyScore > 0 ? certaintyScore : undefined,
        nutritionData,
        propertyData
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
    
    // Clean up image URL if it was created
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
          "flex-1 p-3 overflow-y-auto space-y-3",
          getTextColor()
        )}>
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
