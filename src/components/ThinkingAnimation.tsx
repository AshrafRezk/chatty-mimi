
import { useTheme } from "@/hooks/use-theme";
import { useChat } from "@/context/ChatContext";
import { useState, useEffect } from "react";
import { Activity, BarChart, PieChart, LineChart } from "lucide-react";

const ThinkingAnimation = () => {
  const { theme } = useTheme();
  const { state } = useChat();
  const { language } = state;
  const isDark = theme === 'dark';
  
  const [reasoningStage, setReasoningStage] = useState(0);
  const [showIcon, setShowIcon] = useState(false);
  
  // Array of reasoning steps to show the user how Mimi is processing their request
  const reasoningSteps = language === 'ar' ? [
    "تحليل السؤال...",
    "البحث عن المعلومات ذات الصلة...",
    "تقييم مصادر المعلومات...",
    "تنظيم الإجابة...",
    "تحسين وتدقيق الإجابة..."
  ] : [
    "Analyzing question...",
    "Retrieving relevant information...",
    "Evaluating sources...",
    "Structuring response...",
    "Refining and optimizing answer..."
  ];
  
  const thinkingText = language === 'ar' ? "جاري التحليل..." : "Processing...";
  const searchingText = language === 'ar' ? "استخدام محركات متعددة وإنشاء إجابة مخصصة" : "Using multiple engines and creating personalized response";
  
  // Progress through reasoning steps to demonstrate thought process
  useEffect(() => {
    const interval = setInterval(() => {
      setReasoningStage(prevStage => (prevStage + 1) % reasoningSteps.length);
      setShowIcon(true);
      const iconTimeout = setTimeout(() => setShowIcon(false), 800);
      return () => clearTimeout(iconTimeout);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [reasoningSteps.length]);
  
  const renderStageIcon = () => {
    switch (reasoningStage) {
      case 0:
        return <Activity className={`w-5 h-5 ${isDark ? 'text-mimi-primary' : 'text-mimi-primary/80'} animate-pulse`} />;
      case 1:
        return <BarChart className={`w-5 h-5 ${isDark ? 'text-mimi-primary' : 'text-mimi-primary/80'} animate-pulse`} />;
      case 2:
        return <PieChart className={`w-5 h-5 ${isDark ? 'text-mimi-primary' : 'text-mimi-primary/80'} animate-pulse`} />;
      case 3:
        return <LineChart className={`w-5 h-5 ${isDark ? 'text-mimi-primary' : 'text-mimi-primary/80'} animate-pulse`} />;
      default:
        return <Activity className={`w-5 h-5 ${isDark ? 'text-mimi-primary' : 'text-mimi-primary/80'} animate-pulse`} />;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-mimi-primary/20' : 'bg-mimi-primary/10'}`}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-mimi-primary rounded-full animate-pulse"></div>
        </div>
        <div className="absolute inset-0">
          <div className="w-full h-full rounded-full animate-spin border-t-2 border-mimi-primary"></div>
        </div>
        <div className="absolute inset-0">
          <div className="w-full h-full rounded-full animate-ping opacity-30 bg-mimi-primary"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-mimi-primary animate-bounce-soft" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-mimi-dark'}`}>
          {thinkingText}
        </p>
        
        <div className="flex items-center justify-center gap-2 transition-opacity">
          <div className={`transition-opacity duration-300 ${showIcon ? 'opacity-100' : 'opacity-0'}`}>
            {renderStageIcon()}
          </div>
          <p className="text-xs text-mimi-neutral">
            {reasoningSteps[reasoningStage]}
          </p>
        </div>
        
        <p className="text-xs text-mimi-neutral mt-1">
          {searchingText}
        </p>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
