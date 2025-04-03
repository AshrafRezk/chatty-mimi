
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { extractTextFromImage, analyzeImage } from "@/utils/ocrUtils";
import { toast } from "sonner";
import { useChat } from "@/context/ChatContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Camera, FileText } from "lucide-react";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  onImageSelected: (file: File) => void;
}

const FileUploader = ({ onTextExtracted, onImageSelected }: FileUploaderProps) => {
  const { state } = useChat();
  const { language } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState<"extractText" | "analyzeImage">("extractText");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error(language === 'ar' 
        ? "يرجى تحديد ملف صورة فقط" 
        : "Please select an image file only");
      return;
    }
    
    // Pass the file to the parent for preview
    onImageSelected(file);
    
    // If we only want to attach the image without analysis, we're done
    if (!analysisType) return;
    
    setIsLoading(true);
    setProgress(10);
    
    try {
      let result = "";
      
      if (analysisType === "extractText") {
        // Extract text using OCR
        setProgress(30);
        result = await extractTextFromImage(file);
        setProgress(100);
        
        if (result.trim()) {
          onTextExtracted(result);
          toast.success(language === 'ar' 
            ? "تم استخراج النص بنجاح" 
            : "Text extracted successfully");
        } else {
          toast.info(language === 'ar' 
            ? "لم يتم العثور على نص في الصورة" 
            : "No text found in the image");
        }
      } else if (analysisType === "analyzeImage") {
        // Analyze the image content
        setProgress(30);
        result = await analyzeImage(file);
        setProgress(100);
        
        if (result) {
          onTextExtracted(`Image analysis: ${result}`);
          toast.success(language === 'ar' 
            ? "تم تحليل الصورة بنجاح" 
            : "Image analyzed successfully");
        } else {
          toast.info(language === 'ar' 
            ? "لم نتمكن من تحليل الصورة" 
            : "Could not analyze the image");
        }
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(language === 'ar' 
        ? "حدث خطأ أثناء معالجة الملف" 
        : "Error processing the file");
    } finally {
      setIsLoading(false);
      setProgress(0);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <RadioGroup 
        value={analysisType} 
        onValueChange={(value) => setAnalysisType(value as "extractText" | "analyzeImage")}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="extractText" id="extractText" />
          <Label htmlFor="extractText" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {language === 'ar' ? "استخراج النص" : "Extract Text"}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="analyzeImage" id="analyzeImage" />
          <Label htmlFor="analyzeImage" className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            {language === 'ar' ? "تحليل الصورة" : "Analyze Image"}
          </Label>
        </div>
      </RadioGroup>
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={triggerFileInput}
        disabled={isLoading}
      >
        {isLoading 
          ? (language === 'ar' ? "جاري المعالجة..." : "Processing...")
          : (language === 'ar' ? "حدد ملفًا" : "Select File")}
      </Button>
      
      {isLoading && (
        <Progress value={progress} className="h-2 w-full" />
      )}
    </div>
  );
};

export default FileUploader;
