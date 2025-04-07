
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { FaGoogle, FaMicrosoft, FaGithub } from "react-icons/fa";

interface SSOButtonsProps {
  isSignUp?: boolean;
}

const SSOButtons: React.FC<SSOButtonsProps> = ({ isSignUp = false }) => {
  const { signInWithSSO } = useAuth();
  const { state } = useChat();
  const { language } = state;

  const texts = {
    google: {
      en: `${isSignUp ? 'Sign up' : 'Sign in'} with Google`,
      ar: `${isSignUp ? 'التسجيل' : 'تسجيل الدخول'} باستخدام جوجل`
    },
    microsoft: {
      en: `${isSignUp ? 'Sign up' : 'Sign in'} with Microsoft`,
      ar: `${isSignUp ? 'التسجيل' : 'تسجيل الدخول'} باستخدام مايكروسوفت`
    },
    github: {
      en: `${isSignUp ? 'Sign up' : 'Sign in'} with GitHub`,
      ar: `${isSignUp ? 'التسجيل' : 'تسجيل الدخول'} باستخدام جيثب`
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 w-full">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => signInWithSSO('google')}
        className="flex items-center justify-center gap-2"
      >
        <FaGoogle className="h-4 w-4" />
        <span>{texts.google[language]}</span>
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => signInWithSSO('azure')}
        className="flex items-center justify-center gap-2"
      >
        <FaMicrosoft className="h-4 w-4" />
        <span>{texts.microsoft[language]}</span>
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => signInWithSSO('github')}
        className="flex items-center justify-center gap-2"
      >
        <FaGithub className="h-4 w-4" />
        <span>{texts.github[language]}</span>
      </Button>
    </div>
  );
};

export default SSOButtons;
