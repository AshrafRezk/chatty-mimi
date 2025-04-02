
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Language } from "@/types";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { state, setLanguage } = useChat();
  const { language } = state;
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 opacity-70" />
      <div className="flex border rounded-md overflow-hidden">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant="ghost"
            size="sm"
            onClick={() => handleLanguageChange(lang.code as Language)}
            className={`text-xs py-1 px-3 rounded-none ${
              language === lang.code
                ? "bg-mimi-primary text-white"
                : "bg-transparent hover:bg-mimi-soft"
            }`}
          >
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
