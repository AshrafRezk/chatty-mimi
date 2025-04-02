
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Mood } from "@/types";
import { cn } from "@/lib/utils";

const MoodSelector = () => {
  const { state, setMood } = useChat();
  const { mood, language } = state;
  
  const moods: { type: Mood; label: { en: string; ar: string } }[] = [
    { type: 'calm', label: { en: 'Calm', ar: 'هادئ' } },
    { type: 'friendly', label: { en: 'Friendly', ar: 'ودي' } },
    { type: 'deep', label: { en: 'Deep', ar: 'عميق' } },
    { type: 'focus', label: { en: 'Focus', ar: 'تركيز' } },
  ];

  return (
    <div className={`flex flex-wrap gap-2 mb-4 ${language === 'ar' ? 'justify-end rtl' : 'justify-start'}`}>
      {moods.map((m) => (
        <Button
          key={m.type}
          variant="ghost"
          size="sm"
          onClick={() => setMood(m.type)}
          className={cn(
            "rounded-full border text-sm transition-all", 
            mood === m.type 
              ? "bg-mimi-primary text-white border-mimi-primary" 
              : "bg-transparent hover:bg-mimi-soft hover:text-mimi-primary"
          )}
        >
          {language === 'ar' ? m.label.ar : m.label.en}
        </Button>
      ))}
    </div>
  );
};

export default MoodSelector;
