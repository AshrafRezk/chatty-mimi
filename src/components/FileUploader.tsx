
import React, { useState, useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onImageSelected: (file: File, analysisType: "extractText" | "analyzeImage" | null) => void;
}

const FileUploader = ({ onImageSelected }: FileUploaderProps) => {
  const { state } = useChat();
  const { language } = state;
  const [analysisType, setAnalysisType] = useState<"extractText" | "analyzeImage">("extractText");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      return;
    }
    
    setFileName(file.name);
    
    // Pass the file and analysis type to the parent component
    onImageSelected(file, analysisType);
  };
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <Button 
          onClick={openFileSelector}
          className={cn(
            "bg-purple-500 hover:bg-purple-600 text-white rounded-full",
            "flex items-center justify-center gap-2 px-6 py-2"
          )}
        >
          <Upload className="h-4 w-4" />
          {language === 'ar' ? "اختيار ملف" : "Choose file"}
        </Button>
        
        <Button 
          onClick={openCamera}
          className={cn(
            "bg-purple-500 hover:bg-purple-600 text-white rounded-full",
            "flex items-center justify-center gap-2 px-6 py-2"
          )}
        >
          <Camera className="h-4 w-4" />
          {language === 'ar' ? "التقاط صورة" : "Take photo"}
        </Button>
        
        {fileName && (
          <span className="text-sm text-gray-500 self-center">
            {fileName}
          </span>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
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
    </div>
  );
};

export default FileUploader;
