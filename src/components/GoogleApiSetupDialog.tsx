
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChat } from "@/context/ChatContext";
import { toast } from "sonner";

interface GoogleApiSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoogleApiSetupDialog = ({ open, onOpenChange }: GoogleApiSetupDialogProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [cseId, setCseId] = useState<string>("");
  const { state, setLanguage } = useChat();
  const { language } = state;

  const handleSave = () => {
    if (!apiKey || !cseId) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال مفتاح API ومعرف CSE"
          : "Please enter both API key and CSE ID"
      );
      return;
    }

    // Store in localStorage for persistence
    localStorage.setItem("google_api_key", apiKey);
    localStorage.setItem("google_cse_id", cseId);

    toast.success(
      language === "ar" 
        ? "تم حفظ إعدادات API بنجاح" 
        : "API settings saved successfully"
    );
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === "ar" 
              ? "إعداد Google Search API" 
              : "Setup Google Search API"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? "أدخل بيانات اعتماد Google API الخاصة بك للبحث على الويب"
              : "Enter your Google API credentials for web search"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="AIzaSyBE..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cse-id" className="text-right">
              CSE ID
            </Label>
            <Input
              id="cse-id"
              value={cseId}
              onChange={(e) => setCseId(e.target.value)}
              className="col-span-3"
              placeholder="12345:abcdef..."
            />
          </div>
          <div className="col-span-4 text-xs text-muted-foreground">
            {language === "ar"
              ? "تعرف على كيفية الحصول على مفتاح API و CSE ID من خلال زيارة المستندات الرسمية"
              : "Learn how to get your API key and CSE ID by visiting the official documentation"}
            <a
              href="https://developers.google.com/custom-search/v1/overview"
              target="_blank"
              rel="noreferrer"
              className="ml-1 underline"
            >
              {language === "ar" ? "هنا" : "here"}
            </a>
            .
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            {language === "ar" ? "حفظ" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleApiSetupDialog;
