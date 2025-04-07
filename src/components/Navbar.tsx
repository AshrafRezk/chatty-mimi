
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { Moon, Sun, Globe, User, LogIn, LogOut } from "lucide-react";
import { Language as LanguageType } from "@/types";
import LanguageSelector from "@/components/LanguageSelector";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { state, setTheme } = useChat();
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const { language } = state;
  const { theme } = useTheme();

  // Language texts
  const navTexts = {
    home: language === 'ar' ? 'الرئيسية' : 'Home',
    chat: language === 'ar' ? 'محادثة' : 'Chat',
    pricing: language === 'ar' ? 'الأسعار' : 'Pricing',
    login: language === 'ar' ? 'تسجيل الدخول' : 'Log In',
    logout: language === 'ar' ? 'تسجيل الخروج' : 'Log Out',
    profile: language === 'ar' ? 'الملف الشخصي' : 'Profile',
    account: language === 'ar' ? 'الحساب' : 'Account',
    settings: language === 'ar' ? 'الإعدادات' : 'Settings',
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "?";
    
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user.email 
      ? user.email.substring(0, 2).toUpperCase() 
      : "M";
  };

  return (
    <header className={`py-4 border-b ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-mimi-primary to-mimi-secondary mr-1">M.I.M.I</span>
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-md flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{userProfile?.full_name || user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{navTexts.account}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{navTexts.profile}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{navTexts.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="rounded-md">
                <LogIn className="mr-2 h-4 w-4" />
                <span>{navTexts.login}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
