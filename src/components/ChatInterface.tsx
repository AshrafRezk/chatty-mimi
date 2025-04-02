
import { useEffect, useRef } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import MoodSelector from "./MoodSelector";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getWelcomeMessage } from "@/utils/locationUtils";

const ChatInterface = () => {
  const { state, addMessage, setTyping } = useChat();
  const { messages, mood, language, isTyping, userLocation } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  // Add welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
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
        }, 1500);
        
        return () => clearTimeout(messageTimer);
      }, 500);
      
      return () => clearTimeout(typingTimer);
    }
  }, [messages.length, userLocation, language, addMessage, setTyping]);
  
  const handleSendMessage = (text: string) => {
    // Add user message
    addMessage({
      text,
      sender: "user",
    });
    
    // Simulate assistant typing
    setTyping(true);
    
    // Mock response based on mood
    let response = '';
    
    setTimeout(() => {
      switch (mood) {
        case 'calm':
          response = language === 'ar' 
            ? "أنا هنا لمساعدتك بكل هدوء. كيف يمكنني أن أكون عونًا لك اليوم؟" 
            : "I'm here to help you calmly. How can I assist you today?";
          break;
        case 'friendly':
          response = language === 'ar' 
            ? "يا صديقي! أنا سعيد جدًا بالتحدث معك! كيف حالك اليوم؟" 
            : "Hey friend! I'm so happy to chat with you! How are you doing today?";
          break;
        case 'deep':
          response = language === 'ar' 
            ? "هذا سؤال مثير للتفكير. دعنا نتعمق في استكشاف الأفكار والمعاني الكامنة وراء ذلك." 
            : "That's a thought-provoking question. Let's explore the deeper ideas and meanings behind it.";
          break;
        case 'focus':
          response = language === 'ar' 
            ? "دعنا نركز على حل هذه المشكلة بشكل منهجي. ما هي النتيجة المحددة التي تريد تحقيقها؟" 
            : "Let's focus on solving this issue systematically. What specific outcome are you looking to achieve?";
          break;
        default:
          response = language === 'ar' 
            ? "شكراً لرسالتك! كيف يمكنني مساعدتك اليوم؟" 
            : "Thank you for your message! How can I assist you today?";
      }
      
      // Add assistant response
      setTyping(false);
      addMessage({
        text: response,
        sender: "assistant",
      });
    }, 2000);
  };
  
  return (
    <div className={cn(
      "flex flex-col h-[calc(100vh-12rem)] rounded-lg shadow-lg transition-colors",
      mood === 'calm' && "bg-calm-gradient",
      mood === 'friendly' && "bg-friendly-gradient",
      mood === 'deep' && "bg-deep-gradient text-white",
      mood === 'focus' && "bg-focus-gradient text-white",
    )}>
      <div className="p-4">
        <MoodSelector />
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex mb-4 animate-fade-in">
            <div className="chat-bubble-assistant">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-mimi-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-mimi-primary animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-mimi-primary animate-pulse delay-300"></div>
              </div>
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
