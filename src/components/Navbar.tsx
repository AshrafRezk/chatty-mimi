
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { Moon, Sun, Globe } from "lucide-react";
import { Language as LanguageType } from "@/types";
import LanguageSelector from "@/components/LanguageSelector";
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const { state, setTheme } = useChat();
  const location = useLocation();
  const { language } = state;
  const { theme } = useTheme();

  // Language texts
  const navTexts = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    chat: language === 'ar' ? 'محادثة' : 'Chat',
    pricing: language === 'ar' ? 'الأسعار' : 'Pricing',
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className={`py-4 border-b ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text">
          Mimi
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm ${
              location.pathname === "/" ? "text-mimi-primary font-medium" : "text-foreground hover:text-mimi-primary"
            } transition-colors`}
          >
            {navTexts.home}
          </Link>
          <Link
            to="/chat"
            className={`text-sm ${
              location.pathname === "/chat" ? "text-mimi-primary font-medium" : "text-foreground hover:text-mimi-primary"
            } transition-colors`}
          >
            {navTexts.chat}
          </Link>
          <Link
            to="/pricing"
            className={`text-sm ${
              location.pathname === "/pricing" ? "text-mimi-primary font-medium" : "text-foreground hover:text-mimi-primary"
            } transition-colors`}
          >
            {navTexts.pricing}
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <LanguageSelector />

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
