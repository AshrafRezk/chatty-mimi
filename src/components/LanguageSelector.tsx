
import React from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Language } from "@/types";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Separate component for the dropdown to ensure proper hook execution
const LanguageDropdown: React.FC<{
  language: Language;
  onLanguageChange: (code: Language) => void;
  currentLanguage: string;
}> = ({ language, onLanguageChange, currentLanguage }) => {
  const languages = [
    { code: 'en', label: 'English', group: 'popular' },
    { code: 'ar', label: 'العربية', group: 'popular' },
    { code: 'fr', label: 'Français', group: 'popular' },
    { code: 'es', label: 'Español', group: 'popular' },
    { code: 'de', label: 'Deutsch', group: 'european' },
    { code: 'it', label: 'Italiano', group: 'european' },
    { code: 'pt', label: 'Português', group: 'european' },
    { code: 'ru', label: 'Русский', group: 'european' },
    { code: 'zh', label: 'Chinese (中文)', group: 'asian' },
    { code: 'ja', label: 'Japanese (日本語)', group: 'asian' },
    { code: 'ko', label: 'Korean (한국어)', group: 'asian' },
    { code: 'tr', label: 'Türkçe', group: 'other' },
    { code: 'no', label: 'Norsk', group: 'european' },
  ];

  // Group languages for the dropdown
  const popularLanguages = languages.filter(lang => lang.group === 'popular');
  const europeanLanguages = languages.filter(lang => lang.group === 'european');
  const asianLanguages = languages.filter(lang => lang.group === 'asian');
  const otherLanguages = languages.filter(lang => lang.group === 'other');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs py-1 px-3">
          {currentLanguage}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuLabel>Select language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {popularLanguages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
            onClick={() => onLanguageChange(lang.code as Language)}
          >
            {lang.label}
            {language === lang.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>European</DropdownMenuLabel>
        
        {europeanLanguages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
            onClick={() => onLanguageChange(lang.code as Language)}
          >
            {lang.label}
            {language === lang.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Asian</DropdownMenuLabel>
        
        {asianLanguages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
            onClick={() => onLanguageChange(lang.code as Language)}
          >
            {lang.label}
            {language === lang.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other</DropdownMenuLabel>
        
        {otherLanguages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
            onClick={() => onLanguageChange(lang.code as Language)}
          >
            {lang.label}
            {language === lang.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LanguageSelector: React.FC = () => {
  const { state, setLanguage } = useChat();
  const { language } = state;

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
  };

  const languages = [
    { code: 'en', label: 'English', group: 'popular' },
    { code: 'ar', label: 'العربية', group: 'popular' },
    { code: 'fr', label: 'Français', group: 'popular' },
    { code: 'es', label: 'Español', group: 'popular' },
    { code: 'de', label: 'Deutsch', group: 'european' },
    { code: 'it', label: 'Italiano', group: 'european' },
    { code: 'pt', label: 'Português', group: 'european' },
    { code: 'ru', label: 'Русский', group: 'european' },
    { code: 'zh', label: 'Chinese (中文)', group: 'asian' },
    { code: 'ja', label: 'Japanese (日本語)', group: 'asian' },
    { code: 'ko', label: 'Korean (한국어)', group: 'asian' },
    { code: 'tr', label: 'Türkçe', group: 'other' },
    { code: 'no', label: 'Norsk', group: 'european' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language)?.label || 'English';

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 opacity-70" />
      <LanguageDropdown 
        language={language}
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default LanguageSelector;
