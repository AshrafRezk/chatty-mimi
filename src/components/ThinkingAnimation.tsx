
import { useTheme } from "@/hooks/use-theme";

const ThinkingAnimation = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-mimi-dark'}`}>
          Analyzing information...
        </p>
        <p className="text-xs text-mimi-neutral mt-1">
          Searching web and creating personalized response
        </p>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
