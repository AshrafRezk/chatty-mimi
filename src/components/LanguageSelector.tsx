
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

// Function to group languages by category - defined outside components
const getLanguageGroups = () => {
  const popular = LANGUAGES.filter(lang => lang.group === 'popular');
  const european = LANGUAGES.filter(lang => lang.group === 'european');
  const asian = LANGUAGES.filter(lang => lang.group === 'asian');
  const other = LANGUAGES.filter(lang => lang.group === 'other');
  
  return { popular, european, asian, other };
};

// Simplify the language group rendering to a plain function
function renderLanguageGroup(
  title: string,
  languages: typeof LANGUAGES,
  currentLanguage: Language,
  onSelectLanguage: (code: Language) => void
) {
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
}

// Main LanguageSelector component
function LanguageSelector() {
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
          {renderLanguageGroup("Select language", popular, language, handleLanguageChange)}
          
          <DropdownMenuSeparator />
          {renderLanguageGroup("European", european, language, handleLanguageChange)}
          
          <DropdownMenuSeparator />
          {renderLanguageGroup("Asian", asian, language, handleLanguageChange)}
          
          {other.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {renderLanguageGroup("Other", other, language, handleLanguageChange)}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default LanguageSelector;
