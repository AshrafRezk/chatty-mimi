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
import { toast } from "sonner";
import { Reference } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Motion } from "@/components/ui/motion";

const performWebSearch = async (query: string): Promise<Reference[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const references: Reference[] = [
    {
      title: `Information about "${query}"`,
      url: `https://example.com/search?q=${encodeURIComponent(query)}`,
      snippet: `This is a snippet about ${query} that provides relevant information to the user's question.`,
    },
    {
      title: `Latest research on ${query}`,
      url: `https://example.com/research/${encodeURIComponent(query)}`,
      snippet: `Recent studies and findings related to ${query} with important insights.`,
    }
  ];
  
  return references;
};

const ChatInterface = () => {
  const { state, addMessage, setTyping } = useChat();
  const { messages, mood, language, isTyping, userLocation, aiConfig } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageSent) {
      const welcomeMessage = getWelcomeMessage(userLocation, language);
      
      const typingTimer = setTimeout(() => {
        setTyping(true);
        
        const messageTimer = setTimeout(() => {
          setTyping(false);
          addMessage({
            text: welcomeMessage,
            sender: "assistant",
          });
          setWelcomeMessageSent(true);
        }, 1500);
        
        return () => clearTimeout(messageTimer);
      }, 500);
      
      return () => clearTimeout(typingTimer);
    }
  }, [messages.length, userLocation, language, addMessage, setTyping, welcomeMessageSent]);
  
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
      
      if (aiConfig.webSearch) {
        try {
          references = await performWebSearch(text);
          certaintyScore = Math.floor(70 + Math.random() * 25);
        } catch (error) {
          console.error("Web search error:", error);
        }
      }
      
      try {
        response = await generateGeminiResponse(
          text, 
          messages,
          language, 
          mood,
          locationString,
          aiConfig.persona
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
    const baseClasses = "flex flex-col h-[calc(100vh-12rem)] rounded-lg shadow-lg transition-colors";
    const mobileClasses = isMobile ? "h-[calc(100vh-8rem)] mx-0 rounded-md" : "";
    
    switch (mood) {
      case 'calm':
        return cn(baseClasses, "bg-calm-gradient", mobileClasses);
      case 'friendly':
        return cn(baseClasses, "bg-friendly-gradient", mobileClasses);
      case 'deep':
        return cn(baseClasses, "bg-deep-gradient text-white", mobileClasses);
      case 'focus':
        return cn(baseClasses, "bg-focus-gradient text-white", mobileClasses);
      default:
        return cn(baseClasses, "bg-background", mobileClasses);
    }
  };

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
