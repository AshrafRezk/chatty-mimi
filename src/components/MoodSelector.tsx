
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Mood } from "@/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Motion } from "@/components/ui/motion";

const MoodSelector = () => {
  const { state, setMood } = useChat();
  const { mood, language } = state;
  const isMobile = useIsMobile();
  
  const moods: { type: Mood; label: { en: string; ar: string } }[] = [
    { type: 'calm', label: { en: 'Calm', ar: 'هادئ' } },
    { type: 'friendly', label: { en: 'Friendly', ar: 'ودي' } },
    { type: 'deep', label: { en: 'Deep', ar: 'عميق' } },
    { type: 'focus', label: { en: 'Focus', ar: 'تركيز' } },
  ];

  return (
    <Motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-wrap gap-2",
        isMobile ? "justify-center mb-2" : language === 'ar' ? 'justify-end rtl mb-4' : 'justify-start mb-4'
      )}
    >
      {moods.map((m) => (
        <Motion.div
          key={m.type}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMood(m.type)}
            className={cn(
              "rounded-full border transition-all",
              isMobile ? "text-xs px-3 py-1 h-auto" : "text-sm px-5",
              mood === m.type 
                ? "bg-mimi-primary text-white border-mimi-primary shadow-md" 
                : cn(
                    "bg-white/80 backdrop-blur-sm hover:bg-mimi-soft hover:text-mimi-primary dark:bg-white/20",
                    (m.type === 'deep' || m.type === 'focus') ? "text-white" : "text-mimi-dark"
                  )
            )}
          >
            {language === 'ar' ? m.label.ar : m.label.en}
          </Button>
        </Motion.div>
      ))}
    </Motion.div>
  );
};

export default MoodSelector;
