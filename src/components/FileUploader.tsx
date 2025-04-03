
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Camera } from "lucide-react";
import { useChat } from "@/context/ChatContext";

interface FileUploaderProps {
  onTextExtracted?: (text: string) => void;
  onImageSelected: (file: File, analysisType: "extractText" | "analyzeImage" | null) => void;
}

const FileUploader = ({ onImageSelected }: FileUploaderProps) => {
  const { state } = useChat();
  const { language } = state;
  const [analysisType, setAnalysisType] = useState<"extractText" | "analyzeImage">("extractText");
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      return;
    }
    
    // Pass the file and analysis type to the parent component
    onImageSelected(file, analysisType);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-mimi-primary file:text-white hover:file:bg-mimi-secondary"
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
