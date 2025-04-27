
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

// Language data moved outside component to avoid recreation on each render
const LANGUAGES = [
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

// Get grouped languages
const getLanguageGroups = () => {
  const popular = LANGUAGES.filter(lang => lang.group === 'popular');
  const european = LANGUAGES.filter(lang => lang.group === 'european');
  const asian = LANGUAGES.filter(lang => lang.group === 'asian');
  const other = LANGUAGES.filter(lang => lang.group === 'other');
  
  return { popular, european, asian, other };
};

const LanguageSelector: React.FC = () => {
  const { state, setLanguage } = useChat();
  const { language } = state;

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
  };

  // Get grouped languages
  const { popular, european, asian, other } = getLanguageGroups();

  // Find current language label
  const currentLanguage = LANGUAGES.find(lang => lang.code === language)?.label || 'English';

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 opacity-70" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs py-1 px-3">
            {currentLanguage}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover">
          <DropdownMenuLabel>Select language</DropdownMenuLabel>
          {popular.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
              onClick={() => handleLanguageChange(lang.code as Language)}
            >
              {lang.label}
              {language === lang.code && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>European</DropdownMenuLabel>
          {european.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
              onClick={() => handleLanguageChange(lang.code as Language)}
            >
              {lang.label}
              {language === lang.code && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Asian</DropdownMenuLabel>
          {asian.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
              onClick={() => handleLanguageChange(lang.code as Language)}
            >
              {lang.label}
              {language === lang.code && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          
          {other.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Other</DropdownMenuLabel>
              {other.map(lang => (
                <DropdownMenuItem 
                  key={lang.code}
                  className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
                  onClick={() => handleLanguageChange(lang.code as Language)}
                >
                  {lang.label}
                  {language === lang.code && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
