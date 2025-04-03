
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Paperclip, Camera, LoaderCircle, X } from "lucide-react";
import FileUploader from "./FileUploader";
import { Motion } from "@/components/ui/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { processImageFile } from "@/utils/ocrUtils";

interface ChatInputProps {
  onSendMessage: (message: string, imageFile?: File | null) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [analysisType, setAnalysisType] = useState<"extractText" | "analyzeImage" | null>(null);
  const { state } = useChat();
  const { language, mood } = state;
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const messageSentSound = useRef<HTMLAudioElement | null>(null);
  const messageReceivedSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    messageSentSound.current = new Audio('/sounds/message-sent.mp3');
    messageReceivedSound.current = new Audio('/sounds/message-received.mp3');
    
    if (messageSentSound.current) messageSentSound.current.volume = 0.3;
    if (messageReceivedSound.current) messageReceivedSound.current.volume = 0.3;
    
    return () => {
      messageSentSound.current = null;
      messageReceivedSound.current = null;
    };
  }, []);

  useEffect(() => {
    // Create a URL for the selected image
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageSrc(url);
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageSrc(null);
    }
  }, [imageFile]);
  
  const playMessageSentSound = () => {
    if (messageSentSound.current) {
      messageSentSound.current.currentTime = 0;
      messageSentSound.current.play().catch(err => console.error("Error playing sound:", err));
    }
  };
  
  const placeholderText = language === 'ar' 
    ? "اكتب رسالتك هنا..." 
    : "Type your message here...";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessingImage) return;
    
    const trimmedMessage = message.trim();
    
    if (trimmedMessage || imageFile) {
      if (imageFile && analysisType) {
        setIsProcessingImage(true);
        
        try {
          const processingMessage = language === 'ar' 
            ? `جاري ${analysisType === 'extractText' ? 'استخراج النص' : 'تحليل الصورة'}...` 
            : `${analysisType === 'extractText' ? 'Extracting text' : 'Analyzing image'}...`;
          
          toast.info(processingMessage);
          
          // Process the image in the background
          const result = await processImageFile(imageFile, analysisType);
          
          // Don't add the raw OCR text to the message
          let finalMessage = trimmedMessage;
          
          if (result) {
            // Just use the user's original message, don't append raw OCR text
            // The AI will handle the extracted text in the background
            toast.success(
              language === 'ar'
                ? `تم ${analysisType === 'extractText' ? 'استخراج النص' : 'تحليل الصورة'} بنجاح`
                : `${analysisType === 'extractText' ? 'Text extraction' : 'Image analysis'} completed successfully`
            );
          } else {
            toast.warning(
              language === 'ar'
                ? `لم يتم العثور على ${analysisType === 'extractText' ? 'نص' : 'محتوى قابل للتحليل'}`
                : `No ${analysisType === 'extractText' ? 'text' : 'analyzable content'} found`
            );
          }
          
          playMessageSentSound();
          onSendMessage(finalMessage, imageFile);
          setMessage("");
          setImageFile(null);
          setAnalysisType(null);
          
        } catch (error) {
          console.error("Error processing image:", error);
          toast.error(
            language === 'ar'
              ? `حدث خطأ أثناء ${analysisType === 'extractText' ? 'استخراج النص' : 'تحليل الصورة'}`
              : `Error ${analysisType === 'extractText' ? 'extracting text' : 'analyzing image'}`
          );
          
          // Still send the message with the image if processing fails
          playMessageSentSound();
          onSendMessage(trimmedMessage, imageFile);
          setMessage("");
          setImageFile(null);
          setAnalysisType(null);
        } finally {
          setIsProcessingImage(false);
        }
      } else {
        // Just send the message with the image without processing
        playMessageSentSound();
        onSendMessage(trimmedMessage, imageFile);
        setMessage("");
        setImageFile(null);
        setAnalysisType(null);
      }
    }
  };

  const handleImageSelected = (file: File, type: "extractText" | "analyzeImage" | null) => {
    setImageFile(file);
    setAnalysisType(type);
    setShowFileUploader(false);
    
    const successMessage = language === 'ar' 
      ? "تم تحديد الصورة بنجاح" 
      : "Image selected successfully";
    
    toast.success(successMessage);
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
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageSrc(null);
    setAnalysisType(null);
  };
  
  const getInputBackground = () => {
    return "bg-white dark:bg-zinc-800 shadow-inner";
  };
  
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
                {language === 'ar' ? "تحليل مستند أو صورة" : "Analyze Document or Image"}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowFileUploader(false)}
              >
                <span className="sr-only">Close</span>
                <X size={14} />
              </Button>
            </div>
            <FileUploader 
              onImageSelected={handleImageSelected}
            />
          </div>
        )}
        
        {imageFile && imageSrc && (
          <div className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-2 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 truncate">
                <Camera className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm truncate">{imageFile.name}</span>
                  {analysisType && (
                    <span className="text-xs bg-mimi-primary/10 text-mimi-primary px-2 py-0.5 rounded-full inline-block mt-1">
                      {analysisType === 'extractText' 
                        ? (language === 'ar' ? 'استخراج النص' : 'Extract Text') 
                        : (language === 'ar' ? 'تحليل الصورة' : 'Analyze Image')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleRemoveImage}
                >
                  <Trash2 size={14} />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
            
            <div className="mt-2 relative rounded-md overflow-hidden max-h-32">
              <img 
                src={imageSrc} 
                alt="Selected file preview" 
                className="w-full h-full object-cover"
              />
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
                  handleSubmit(e);
                }
              }
            }}
            disabled={isProcessingImage}
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
              disabled={isProcessingImage}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
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
              disabled={isProcessingImage}
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
                getButtonStyle(),
                isProcessingImage && "opacity-70 cursor-not-allowed"
              )}
              disabled={(!message.trim() && !imageFile) || isProcessingImage}
              title={language === 'ar' ? "إرسال" : "Send"}
            >
              {isProcessingImage ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </form>
    </Motion.div>
  );
};

export default ChatInput;
