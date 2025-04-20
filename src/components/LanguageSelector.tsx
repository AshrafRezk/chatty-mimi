
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

// Define LanguageGroup as a separate component
const LanguageGroup: React.FC<{ 
  title: string;
  languages: typeof LANGUAGES;
  currentLanguage: Language; 
  onSelectLanguage: (code: Language) => void;
}> = ({ title, languages, currentLanguage, onSelectLanguage }) => {
  return (
    <>
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      {languages.map(lang => (
        <DropdownMenuItem 
          key={lang.code}
          className={currentLanguage === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
          onClick={() => onSelectLanguage(lang.code as Language)}
        >
          {lang.label}
          {currentLanguage === lang.code && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
      ))}
    </>
  );
};

// Main LanguageSelector component
const LanguageSelector: React.FC = () => {
  const { state, setLanguage } = useChat();
  const { language } = state;

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
  };

  // Group languages
  const popularLanguages = LANGUAGES.filter(lang => lang.group === 'popular');
  const europeanLanguages = LANGUAGES.filter(lang => lang.group === 'european');
  const asianLanguages = LANGUAGES.filter(lang => lang.group === 'asian');
  const otherLanguages = LANGUAGES.filter(lang => lang.group === 'other');

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
          <LanguageGroup 
            title="Select language"
            languages={popularLanguages} 
            currentLanguage={language} 
            onSelectLanguage={handleLanguageChange} 
          />
          
          <DropdownMenuSeparator />
          <LanguageGroup 
            title="European"
            languages={europeanLanguages} 
            currentLanguage={language} 
            onSelectLanguage={handleLanguageChange} 
          />
          
          <DropdownMenuSeparator />
          <LanguageGroup 
            title="Asian"
            languages={asianLanguages} 
            currentLanguage={language} 
            onSelectLanguage={handleLanguageChange} 
          />
          
          {otherLanguages.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <LanguageGroup 
                title="Other"
                languages={otherLanguages} 
                currentLanguage={language} 
                onSelectLanguage={handleLanguageChange} 
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
