
import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Language } from "@/types";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

const LanguageSelector: React.FC = () => {
  const { state, setLanguage } = useChat();
  const { language } = state;
  const [open, setOpen] = useState(false);
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'ru', label: 'Русский' },
    { code: 'zh', label: 'Chinese (中文)' },
    { code: 'ja', label: 'Japanese (日本語)' },
    { code: 'ko', label: 'Korean (한국어)' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'no', label: 'Norsk' },
  ];

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  // Group languages by region for better dropdown organization
  const languageGroups = {
    popular: ['en', 'ar', 'fr', 'es'],
    european: ['de', 'it', 'pt', 'ru', 'no'],
    asian: ['zh', 'ja', 'ko'],
    other: ['tr']
  };

  const getLanguagesByGroup = (group: string[]) => {
    return languages.filter(lang => group.includes(lang.code));
  };

  const currentLanguage = languages.find(lang => lang.code === language)?.label || 'English';

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 opacity-70" />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs py-1 px-3">
            {currentLanguage}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Select language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            {getLanguagesByGroup(languageGroups.popular).map(lang => (
              <DropdownMenuItem 
                key={lang.code}
                className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
                onClick={() => handleLanguageChange(lang.code as Language)}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>European</DropdownMenuLabel>
          
          <DropdownMenuGroup>
            {getLanguagesByGroup(languageGroups.european).map(lang => (
              <DropdownMenuItem 
                key={lang.code}
                className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
                onClick={() => handleLanguageChange(lang.code as Language)}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Asian</DropdownMenuLabel>
          
          <DropdownMenuGroup>
            {getLanguagesByGroup(languageGroups.asian).map(lang => (
              <DropdownMenuItem 
                key={lang.code}
                className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
                onClick={() => handleLanguageChange(lang.code as Language)}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Other</DropdownMenuLabel>
          
          <DropdownMenuGroup>
            {getLanguagesByGroup(languageGroups.other).map(lang => (
              <DropdownMenuItem 
                key={lang.code}
                className={language === lang.code ? "bg-mimi-soft dark:bg-mimi-dark/40" : ""}
                onClick={() => handleLanguageChange(lang.code as Language)}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
