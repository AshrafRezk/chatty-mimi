
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";
import { extractTextFromImage } from "@/utils/ocrUtils";
import { toast } from "sonner";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
}

const FileUploader = ({ onTextExtracted }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state } = useChat();
  const { language } = state;
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp'];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(language === 'ar' 
        ? "نوع الملف غير مدعوم. يرجى تحميل PDF أو صورة."
        : "Unsupported file type. Please upload a PDF or image.");
      return;
    }
    
    // Limit file size to 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error(language === 'ar' 
        ? "حجم الملف كبير جدًا. الحد الأقصى هو 5 ميغابايت."
        : "File too large. Maximum size is 5MB.");
      return;
    }
    
    setFile(selectedFile);
  };
  
  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const extractedText = await extractTextFromImage(file);
      
      if (extractedText && extractedText.trim()) {
        onTextExtracted(extractedText);
        toast.success(language === 'ar' 
          ? "تم استخراج النص بنجاح"
          : "Text successfully extracted");
        
        // Reset file after successful processing
        setFile(null);
      } else {
        toast.error(language === 'ar' 
          ? "لم يتم العثور على نص في هذا الملف"
          : "No text found in this file");
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast.error(language === 'ar' 
        ? "حدث خطأ أثناء معالجة الملف"
        : "Error processing the file");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const clearFile = () => {
    setFile(null);
  };
  
  return (
    <div className="flex flex-col">
      {file ? (
        <div className="flex items-center gap-2 p-2 rounded-md bg-mimi-soft/20 mb-2">
          <FileText className="h-4 w-4 text-mimi-primary" />
          <span className="text-sm truncate flex-1">{file.name}</span>
          
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={processFile}
                className="h-6 px-2 text-xs"
              >
                {language === 'ar' ? 'استخراج' : 'Extract'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFile}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={cn(
          "relative overflow-hidden",
          language === 'ar' ? "rtl" : ""
        )}>
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.tiff,.webp"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
