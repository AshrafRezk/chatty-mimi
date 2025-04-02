
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import MoodSelector from "./MoodSelector";
import PersonaSelector from "./PersonaSelector";
import ThinkingAnimation from "./ThinkingAnimation";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getWelcomeMessage } from "@/utils/locationUtils";
import { generateGeminiResponse } from "@/utils/geminiUtils";
import { performWebSearch, calculateCertaintyScore } from "@/utils/searchUtils";
import { toast } from "sonner";
import { Reference } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Motion } from "@/components/ui/motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const ChatInterface = () => {
  const { state, addMessage, setTyping, clearMessages } = useChat();
  const { messages, mood, language, isTyping, userLocation, aiConfig } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);
  const welcomeMessageSentRef = useRef(false);
  
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
  
  const handleSendMessage = async (text: string) => {
    addMessage({
      text,
      sender: "user",
    });
    
    setTyping(true);
    
    try {
      const locationString = userLocation 
        ? `${userLocation.city}, ${userLocation.country} (${userLocation.countryCode})` 
        : null;
      
      let references: Reference[] = [];
      let certaintyScore = 0;
      let response = "";
      
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
          referencesContext
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
      
      setTyping(false);
      addMessage({
        text: response,
        sender: "assistant",
        references: references.length > 0 ? references : undefined,
        certaintyScore: certaintyScore > 0 ? certaintyScore : undefined,
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
        
        <div className="p-3 border-t bg-background/80 backdrop-blur-sm rounded-b-lg">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
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
        <MoodSelector />
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
    </Motion.div>
  );
};

export default ChatInterface;
