
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, FileText, X, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";
import { extractTextFromImage, analyzeImage } from "@/utils/ocrUtils";
import { toast } from "sonner";
import { Motion } from "@/components/ui/motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  onImageSelected?: (file: File) => void;
}

const FileUploader = ({ onTextExtracted, onImageSelected }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState<"text" | "image">("text");
  const { state } = useChat();
  const { language, aiConfig } = state;
  
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
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error(language === 'ar' 
        ? "حجم الملف كبير جدًا. الحد الأقصى هو 5 ميغابايت."
        : "File too large. Maximum size is 5MB.");
      return;
    }
    
    setFile(selectedFile);
    
    // Set appropriate default analysis type based on file type
    if (selectedFile.type.startsWith('image/')) {
      // For diet coach, directly select the image
      if (aiConfig.persona === 'diet_coach' && onImageSelected) {
        onImageSelected(selectedFile);
        setFile(null);
      }
    } else {
      // For PDFs, default to text extraction
      setAnalysisType("text");
    }
  };
  
  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      if (file.type.startsWith('image/') && aiConfig.persona === 'diet_coach' && onImageSelected) {
        onImageSelected(file);
        setFile(null);
        setIsProcessing(false);
        return;
      }
      
      // Process according to the selected analysis type
      if (analysisType === "text") {
        // Text extraction only
        toast.loading(language === 'ar' 
          ? "جاري استخراج النص..."
          : "Extracting text...");
          
        const extractedText = await extractTextFromImage(file);
        toast.dismiss();
        
        if (extractedText && extractedText.trim()) {
          const textResult = language === 'ar'
            ? `النص المكتشف: "${extractedText}"`
            : `Detected text: "${extractedText}"`;
            
          onTextExtracted(textResult);
          toast.success(language === 'ar' 
            ? "تم استخراج النص بنجاح"
            : "Text successfully extracted");
          
          setFile(null);
        } else {
          toast.error(language === 'ar' 
            ? "لم يتم العثور على نص في هذا الملف"
            : "No text found in this file");
        }
      } else {
        // Image analysis only
        toast.loading(language === 'ar' 
          ? "جاري تحليل الصورة..."
          : "Analyzing image...");
          
        const imageCaption = await analyzeImage(file);
        toast.dismiss();
        
        if (imageCaption && imageCaption.trim()) {
          const visualResult = language === 'ar'
            ? `يبدو أن الصورة تظهر: ${imageCaption}`
            : `It looks like: ${imageCaption}`;
            
          onTextExtracted(visualResult);
          toast.success(language === 'ar' 
            ? "تم تحليل الصورة بنجاح"
            : "Image successfully analyzed");
          
          setFile(null);
        } else {
          toast.error(language === 'ar' 
            ? "لم أتمكن من تحليل هذه الصورة"
            : "Couldn't analyze this image");
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
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
    <Motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col"
    >
      {file ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/30 border border-border">
            <FileText className="h-5 w-5 text-mimi-primary" />
            <span className="text-sm truncate flex-1">{file.name}</span>
            
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-mimi-primary" />
            ) : (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={clearFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {file.type.startsWith('image/') && (
            <div className="p-2 bg-muted/10 rounded-md">
              <div className="text-sm font-medium mb-2">
                {language === 'ar' ? 'اختر نوع التحليل:' : 'Choose analysis type:'}
              </div>
              <RadioGroup
                value={analysisType}
                onValueChange={(value) => setAnalysisType(value as "text" | "image")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text-option" />
                  <label htmlFor="text-option" className="text-sm cursor-pointer">
                    {language === 'ar' ? 'استخراج النص' : 'Extract text'}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image-option" />
                  <label htmlFor="image-option" className="text-sm cursor-pointer">
                    {language === 'ar' ? 'تحليل الصورة' : 'Analyze image'}
                  </label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={clearFile}
              disabled={isProcessing}
              className="px-3"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              size="sm" 
              onClick={processFile}
              disabled={isProcessing}
              className="px-3 bg-mimi-primary text-white hover:bg-mimi-secondary"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === 'ar' ? 'جارٍ المعالجة...' : 'Processing...'}
                </span>
              ) : (
                <span>
                  {analysisType === "text" 
                    ? (language === 'ar' ? 'استخراج النص' : 'Extract Text')
                    : (language === 'ar' ? 'تحليل الصورة' : 'Analyze Image')}
                </span>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.tiff,.webp"
              />
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 border-dashed"
              >
                <Paperclip className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'اختر ملفًا' : 'Upload File'}
                </span>
              </Button>
            </div>
            
            <div className="relative">
              <input
                type="file"
                id="camera-capture"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
              />
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 border-dashed"
              >
                <Camera className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'التقط صورة' : 'Take Photo'}
                </span>
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            {language === 'ar' 
              ? aiConfig.persona === 'diet_coach'
                ? 'التقط صورة للطعام لتحليل المحتوى الغذائي'
                : 'تحليل الصور والنصوص'
              : aiConfig.persona === 'diet_coach' 
                ? 'Take a photo of food to analyze nutritional content'
                : 'Analyze images and text'}
          </p>
        </div>
      )}
    </Motion.div>
  );
};

export default FileUploader;
