
import { createContext, useContext, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Theme } from "@/types";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme: "light" | "dark" | "system";
  storageKey: string;
};

export function useTheme() {
  const { state, setTheme } = useChat();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    if (state.theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return {
    theme: isMounted ? state.theme : 'light',
    setTheme,
    toggleTheme
  };
}

// Add the ThemeProvider component
export function ThemeProvider({ 
  children, 
  defaultTheme, 
  storageKey 
}: ThemeProviderProps) {
  // Since we're using the ChatContext for theme management,
  // we can make this a simple wrapper component
  return <>{children}</>;
}
