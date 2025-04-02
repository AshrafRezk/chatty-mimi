
import { useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Theme } from "@/types";

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
