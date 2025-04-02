
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Hero = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "Meet Mimi",
      ar: "تعرّف على ميمي",
      fr: "Rencontrez Mimi",
      es: "Conoce a Mimi",
      de: "Treffen Sie Mimi",
      it: "Incontra Mimi",
      pt: "Conheça Mimi",
      ru: "Познакомьтесь с Mimi",
      zh: "认识 Mimi",
      ja: "Mimiに会う",
      ko: "Mimi를 만나보세요",
      tr: "Mimi ile tanışın",
      no: "Møt Mimi"
    },
    subtitle: {
      en: "Your emotionally intelligent AI chat companion",
      ar: "رفيقك الذكي عاطفياً في المحادثات",
      fr: "Votre compagnon de chat IA émotionnellement intelligent",
      es: "Tu compañero de chat con IA emocionalmente inteligente",
      de: "Ihr emotional intelligenter KI-Chat-Begleiter",
      it: "Il tuo compagno di chat AI emotivamente intelligente",
      pt: "Seu companheiro de chat com IA emocionalmente inteligente",
      ru: "Ваш эмоционально интеллектуальный ИИ-собеседник",
      zh: "您的情感智能AI聊天伙伴",
      ja: "感情的知性を持つAIチャット相手",
      ko: "감정 지능을 갖춘 AI 채팅 동반자",
      tr: "Duygusal zekaya sahip yapay zeka sohbet arkadaşınız",
      no: "Din emosjonelt intelligente AI-chattepartner"
    },
    description: {
      en: "Mimi adapts to your location, language, and mood. Experience a chat that understands not just what you say, but how you feel.",
      ar: "ميمي تتكيف مع موقعك ولغتك ومزاجك. استمتع بتجربة محادثة تفهم ليس فقط ما تقوله، بل كيف تشعر.",
      fr: "Mimi s'adapte à votre localisation, langue et humeur. Découvrez une conversation qui comprend non seulement ce que vous dites, mais aussi ce que vous ressentez.",
      es: "Mimi se adapta a tu ubicación, idioma y estado de ánimo. Experimenta un chat que entiende no solo lo que dices, sino cómo te sientes.",
      de: "Mimi passt sich Ihrem Standort, Ihrer Sprache und Ihrer Stimmung an. Erleben Sie einen Chat, der nicht nur versteht, was Sie sagen, sondern auch, wie Sie sich fühlen.",
      it: "Mimi si adatta alla tua posizione, lingua e umore. Prova una chat che capisce non solo ciò che dici, ma anche come ti senti.",
      pt: "Mimi se adapta à sua localização, idioma e humor. Experimente um chat que entende não apenas o que você diz, mas como se sente.",
      ru: "Mimi адаптируется к вашему местоположению, языку и настроению. Испытайте общение, которое понимает не только то, что вы говорите, но и как вы себя чувствуете.",
      zh: "Mimi会根据您的位置、语言和心情进行调整。体验一种不仅理解您所说的内容，还能理解您的感受的聊天方式。",
      ja: "Mimiはあなたの場所、言語、気分に適応します。あなたが言うことだけでなく、どう感じているかも理解するチャットを体験してください。",
      ko: "Mimi는 당신의 위치, 언어, 기분에 맞게 조정됩니다. 당신이 말하는 것뿐만 아니라 당신이 어떻게 느끼는지 이해하는 채팅을 경험하세요.",
      tr: "Mimi konumunuza, dilinize ve ruh halinize uyum sağlar. Sadece ne söylediğinizi değil, nasıl hissettiğinizi de anlayan bir sohbet deneyimi yaşayın.",
      no: "Mimi tilpasser seg din plassering, språk og humør. Opplev en chat som forstår ikke bare hva du sier, men hvordan du føler."
    },
    startChat: {
      en: "Start chatting",
      ar: "ابدأ المحادثة",
      fr: "Commencer à discuter",
      es: "Empezar a chatear",
      de: "Chat starten",
      it: "Inizia a chattare",
      pt: "Começar a conversar",
      ru: "Начать чат",
      zh: "开始聊天",
      ja: "チャットを始める",
      ko: "채팅 시작하기",
      tr: "Sohbete başla",
      no: "Start å chatte"
    },
    learnMore: {
      en: "Learn more",
      ar: "اعرف المزيد",
      fr: "En savoir plus",
      es: "Saber más",
      de: "Mehr erfahren",
      it: "Scopri di più",
      pt: "Saiba mais",
      ru: "Узнать больше",
      zh: "了解更多",
      ja: "もっと詳しく",
      ko: "더 알아보기",
      tr: "Daha fazla bilgi",
      no: "Lær mer"
    }
  };

  const getLangText = (textObj: any) => {
    return textObj[language] || textObj['en'];
  };

  return (
    <section className={cn(
      "py-20 px-4 flex flex-col items-center justify-center text-center",
      language === 'ar' ? 'rtl' : ''
    )}>
      <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text animate-fade-in">
        {getLangText(texts.title)}
      </h1>
      <p className="text-xl md:text-2xl mb-6 text-muted-foreground animate-fade-in delay-100">
        {getLangText(texts.subtitle)}
      </p>
      <p className="max-w-2xl mb-8 animate-fade-in delay-200">
        {getLangText(texts.description)}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
        <Button 
          size="lg"
          className="bg-mimi-primary hover:bg-mimi-secondary"
          asChild
        >
          <Link to="/chat">{getLangText(texts.startChat)}</Link>
        </Button>
        <Button 
          variant="outline"
          size="lg"
          className="border-mimi-primary text-mimi-primary hover:bg-mimi-soft"
          asChild
        >
          <Link to="/pricing">{getLangText(texts.learnMore)}</Link>
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="mt-16 relative w-full max-w-4xl animate-fade-in delay-400">
        <div className="rounded-xl overflow-hidden shadow-xl border">
          <div className="bg-mimi-dark/5 dark:bg-mimi-dark/40 h-12 flex items-center px-4 border-b">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-mimi-soft dark:from-mimi-dark dark:to-mimi-dark/80 h-80 flex items-center justify-center relative">
            <div className="chat-bubble-assistant absolute top-10 left-10">
              <p>{getLangText({
                en: "Hello! How can I help you today?",
                ar: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
                fr: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
                es: "¡Hola! ¿Cómo puedo ayudarte hoy?",
                de: "Hallo! Wie kann ich Ihnen heute helfen?",
                it: "Ciao! Come posso aiutarti oggi?",
                pt: "Olá! Como posso ajudá-lo hoje?",
                ru: "Привет! Чем я могу помочь вам сегодня?",
                zh: "你好！今天我能帮到你什么？",
                ja: "こんにちは！今日はどのようにお手伝いできますか？",
                ko: "안녕하세요! 오늘 어떻게 도와드릴까요?",
                tr: "Merhaba! Bugün size nasıl yardımcı olabilirim?",
                no: "Hei! Hvordan kan jeg hjelpe deg i dag?"
              })}</p>
            </div>
            <div className="chat-bubble-user absolute bottom-10 right-10">
              <p>{getLangText({
                en: "I'm happy to chat with you!",
                ar: "أنا سعيد بالتحدث معك!",
                fr: "Je suis ravi de discuter avec vous !",
                es: "¡Estoy feliz de hablar contigo!",
                de: "Ich freue mich, mit Ihnen zu chatten!",
                it: "Sono felice di chattare con te!",
                pt: "Estou feliz em conversar com você!",
                ru: "Я рад общаться с вами!",
                zh: "很高兴与您聊天！",
                ja: "あなたとチャットできて嬉しいです！",
                ko: "당신과 대화하게 되어 기쁩니다!",
                tr: "Seninle sohbet etmekten mutluyum!",
                no: "Jeg er glad for å chatte med deg!"
              })}</p>
            </div>
            <div className="w-24 h-24 rounded-full bg-mimi-primary/20 flex items-center justify-center animate-bounce-soft">
              <div className="text-4xl">👋</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
