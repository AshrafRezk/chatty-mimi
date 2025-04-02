
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

// Mock web search function (in real app, would connect to a search API)
const performWebSearch = async (query: string): Promise<Reference[]> => {
  // In a real implementation, this would call a search API
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock references based on query keywords
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
  
  // Track if welcome message has been added
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  // Add welcome message if no messages and it hasn't been sent yet
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageSent) {
      const welcomeMessage = getWelcomeMessage(userLocation, language);
      
      // Add a short delay to make it seem like the assistant is typing
      const typingTimer = setTimeout(() => {
        setTyping(true);
        
        // Then send the welcome message after a delay
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
    // Add user message
    addMessage({
      text,
      sender: "user",
    });
    
    // Set typing indicator
    setTyping(true);
    
    try {
      // Format location string for the API
      const locationString = userLocation 
        ? `${userLocation.city}, ${userLocation.country} (${userLocation.countryCode})` 
        : null;
      
      // Fetch web search results if enabled
      let references: Reference[] = [];
      let certaintyScore = 0;
      let response = "";
      
      // Always try to get web search results first
      if (aiConfig.webSearch) {
        try {
          references = await performWebSearch(text);
          // Calculate a mock certainty score
          certaintyScore = Math.floor(70 + Math.random() * 25); // Random between 70-95%
        } catch (error) {
          console.error("Web search error:", error);
          // Continue with AI response even if search fails
        }
      }
      
      try {
        // Get AI response from Gemini API (not mentioned to user)
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
        
        // If Gemini fails, create a fallback response from web search results
        if (references.length > 0) {
          response = `Based on available information${language === 'ar' ? '، ' : ': '}`;
          
          // Add snippets from references to form an answer
          references.forEach((ref, index) => {
            response += `\n\n${ref.snippet}`;
            if (index < references.length - 1) {
              response += language === 'ar' ? '، ' : '; ';
            }
          });
        } else {
          // If no web search results either, use a standard fallback
          response = language === 'ar' 
            ? "عذراً، لا يمكنني الوصول إلى معلومات كافية للإجابة على سؤالك حالياً. يرجى المحاولة مرة أخرى لاحقاً."
            : "I apologize, but I don't have enough information to answer your question at the moment. Please try again later.";
        }
      }
      
      // Add assistant response with references and certainty if available
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
      
      // Fallback response
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
  
  return (
    <div className={cn(
      "flex flex-col h-[calc(100vh-12rem)] rounded-lg shadow-lg transition-colors",
      mood === 'calm' && "bg-calm-gradient",
      mood === 'friendly' && "bg-friendly-gradient",
      mood === 'deep' && "bg-deep-gradient text-white",
      mood === 'focus' && "bg-focus-gradient text-white",
    )}>
      <div className="p-4 flex justify-between items-center">
        <MoodSelector />
        <PersonaSelector />
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {/* Thinking animation */}
        {isTyping && (
          <div className="flex mb-4 animate-fade-in">
            <div className="chat-bubble-assistant">
              <ThinkingAnimation />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
