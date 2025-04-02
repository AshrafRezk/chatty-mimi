import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Paperclip, Camera } from "lucide-react";
import FileUploader from "./FileUploader";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

interface ChatInputProps {
  onSendMessage: (message: string, imageFile?: File | null) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { state } = useChat();
  const { language, mood } = state;
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Sound effects
  const messageSentSound = useRef<HTMLAudioElement | null>(null);
  const messageReceivedSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio on component mount
  useEffect(() => {
    messageSentSound.current = new Audio('/sounds/message-sent.mp3');
    messageReceivedSound.current = new Audio('/sounds/message-received.mp3');
    
    // Set volumes to be gentle
    if (messageSentSound.current) messageSentSound.current.volume = 0.3;
    if (messageReceivedSound.current) messageSentSound.current.volume = 0.3;
    
    return () => {
      // Cleanup
      messageSentSound.current = null;
      messageReceivedSound.current = null;
    };
  }, []);
  
  // Play sent sound when user sends a message
  const playMessageSentSound = () => {
    if (messageSentSound.current) {
      messageSentSound.current.currentTime = 0;
      messageSentSound.current.play().catch(err => console.error("Error playing sound:", err));
    }
  };
  
  const placeholderText = language === 'ar' 
    ? "اكتب رسالتك هنا..." 
    : "Type your message here...";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() || imageFile) {
      playMessageSentSound();
      onSendMessage(message.trim(), imageFile);
      setMessage("");
      setImageFile(null);
    }
  };

  const handleTextExtracted = (extractedText: string) => {
    // Append the extracted text to the current message
    const updatedMessage = message.trim() 
      ? `${message}\n\n${extractedText}`
      : extractedText;
    
    setMessage(updatedMessage);
    setShowFileUploader(false);
    toast.success(language === 'ar' ? "تم استخراج النص بنجاح" : "Text extracted successfully");
  };
  
  const handleImageSelected = (file: File) => {
    setImageFile(file);
    setShowFileUploader(false);
    toast.success(language === 'ar' ? "تم تحديد الصورة بنجاح" : "Image selected successfully");
  };
  
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast.info(
        language === 'ar' 
          ? "التسجيل الصوتي قيد التطوير" 
          : "Voice recording feature is coming soon"
      );
    }
  };
  
  // Get input background color based on mood
  const getInputBackground = () => {
    // Make input always visible regardless of mood
    return "bg-white dark:bg-zinc-800 shadow-inner";
  };
  
  // Get button colors based on mood
  const getButtonStyle = () => {
    let baseClasses = "rounded-full shadow-sm transition-all";
    
    switch (mood) {
      case 'deep':
      case 'focus':
        return cn(baseClasses, "bg-white/90 text-mimi-dark hover:bg-white");
      default:
        return cn(baseClasses, "bg-mimi-primary text-white hover:bg-mimi-secondary"); 
    }
  };

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSubmit} className={cn(
        "flex flex-col gap-2", 
        language === 'ar' ? 'rtl' : ''
      )}>
        {showFileUploader && (
          <div className="bg-white dark:bg-zinc-800 backdrop-blur-sm p-3 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">
                {language === 'ar' ? "رفع مستند أو صورة" : "Upload Document or Image"}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowFileUploader(false)}
              >
                <span className="sr-only">Close</span>
                ✕
              </Button>
            </div>
            <FileUploader 
              onTextExtracted={handleTextExtracted} 
              onImageSelected={handleImageSelected}
            />
          </div>
        )}
        
        {imageFile && (
          <div className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-2 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm truncate">{imageFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setImageFile(null)}
              >
                <span className="sr-only">Remove</span>
                ✕
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholderText}
            className={cn(
              "resize-none pr-28 border-2 transition-all",
              getInputBackground(),
              isMobile ? "min-h-[50px] max-h-32 rounded-2xl text-sm" : "min-h-28 rounded-xl", 
              language === 'ar' ? 'text-right pl-28 pr-4' : '',
              "focus:border-mimi-primary focus:ring-1 focus:ring-mimi-primary"
            )}
            style={{
              boxShadow: "0 1px 2px rgba(0,0,0,0.05) inset"
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (message.trim() || imageFile) {
                  playMessageSentSound();
                  onSendMessage(message.trim(), imageFile);
                  setMessage("");
                  setImageFile(null);
                }
              }
            }}
          />
          <div className={cn(
            "absolute bottom-2.5", 
            language === 'ar' ? 'left-2' : 'right-2',
            "flex gap-1.5 items-center"
          )}>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setShowFileUploader(prev => !prev)}
              title={language === 'ar' ? "إرفاق ملف" : "Attach file"}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setShowFileUploader(prev => !prev)}
              title={language === 'ar' ? "التقاط صورة" : "Take photo"}
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Take photo</span>
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 rounded-full",
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={handleMicClick}
              title={language === 'ar' ? "إدخال صوتي" : "Voice input"}
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              size="icon" 
              className={cn(
                "h-9 w-9",
                getButtonStyle()
              )}
              disabled={!message.trim() && !imageFile}
              title={language === 'ar' ? "إرسال" : "Send"}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </form>
    </Motion.div>
  );
};

export default ChatInput;
