
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Hero = () => {
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "Meet M.I.M.I",
      ar: "تعرّف على إم.آي.إم.آي",
      fr: "Rencontrez M.I.M.I",
      es: "Conoce a M.I.M.I",
      de: "Treffen Sie M.I.M.I",
      it: "Incontra M.I.M.I",
      pt: "Conheça M.I.M.I",
      ru: "Познакомьтесь с M.I.M.I",
      zh: "认识 M.I.M.I",
      ja: "M.I.M.Iに会う",
      ko: "M.I.M.I를 만나보세요",
      tr: "M.I.M.I ile tanışın",
      no: "Møt M.I.M.I"
    },
    subtitle: {
      en: "Modular Interactive Machine Intelligence",
      ar: "الذكاء الآلي التفاعلي المعياري",
      fr: "Intelligence Machine Interactive Modulaire",
      es: "Inteligencia de Máquina Interactiva Modular",
      de: "Modulare Interaktive Maschinenintelligenz",
      it: "Intelligenza Macchina Interattiva Modulare",
      pt: "Inteligência de Máquina Interativa Modular",
      ru: "Модульный Интерактивный Машинный Интеллект",
      zh: "模块化交互式机器智能",
      ja: "モジュール式インタラクティブマシンインテリジェンス",
      ko: "모듈형 인터랙티브 머신 인텔리전스",
      tr: "Modüler Etkileşimli Makine Zekası",
      no: "Modulær Interaktiv Maskinell Intelligens"
    },
    description: {
      en: "M.I.M.I adapts to your location, language, and needs. Experience powerful AI that understands your commands and delivers results.",
      ar: "إم.آي.إم.آي يتكيف مع موقعك ولغتك واحتياجاتك. جرب ذكاءً اصطناعيًا قويًا يفهم أوامرك ويقدم النتائج.",
      fr: "M.I.M.I s'adapte à votre localisation, langue et besoins. Découvrez une IA puissante qui comprend vos commandes et livre des résultats.",
      es: "M.I.M.I se adapta a tu ubicación, idioma y necesidades. Experimenta una IA potente que entiende tus comandos y entrega resultados.",
      de: "M.I.M.I passt sich Ihrem Standort, Ihrer Sprache und Ihren Bedürfnissen an. Erleben Sie leistungsstarke KI, die Ihre Befehle versteht und Ergebnisse liefert.",
      it: "M.I.M.I si adatta alla tua posizione, lingua e necessità. Sperimenta un'IA potente che comprende i tuoi comandi e fornisce risultati.",
      pt: "M.I.M.I se adapta à sua localização, idioma e necessidades. Experimente uma IA poderosa que entende seus comandos e entrega resultados.",
      ru: "M.I.M.I адаптируется к вашему местоположению, языку и потребностям. Испытайте мощный ИИ, который понимает ваши команды и выдает результаты.",
      zh: "M.I.M.I会根据您的位置、语言和需求进行调整。体验强大的人工智能，它能理解您的命令并提供结果。",
      ja: "M.I.M.Iはあなたの場所、言語、ニーズに適応します。あなたのコマンドを理解し結果を提供する強力なAIを体験してください。",
      ko: "M.I.M.I는 당신의 위치, 언어, 필요에 맞게 조정됩니다. 당신의 명령을 이해하고 결과를 제공하는 강력한 AI를 경험하세요.",
      tr: "M.I.M.I konumunuza, dilinize ve ihtiyaçlarınıza uyum sağlar. Komutlarınızı anlayan ve sonuç veren güçlü bir yapay zeka deneyimi yaşayın.",
      no: "M.I.M.I tilpasser seg din plassering, språk og behov. Opplev kraftig AI som forstår dine kommandoer og leverer resultater."
    },
    startChat: {
      en: "Start now",
      ar: "ابدأ الآن",
      fr: "Commencer maintenant",
      es: "Comenzar ahora",
      de: "Jetzt starten",
      it: "Inizia ora",
      pt: "Começar agora",
      ru: "Начать сейчас",
      zh: "立即开始",
      ja: "今すぐ始める",
      ko: "지금 시작하기",
      tr: "Şimdi başla",
      no: "Start nå"
    },
    learnMore: {
      en: "Learn capabilities",
      ar: "تعرف على القدرات",
      fr: "Découvrir les capacités",
      es: "Conocer capacidades",
      de: "Fähigkeiten entdecken",
      it: "Scopri le capacità",
      pt: "Conheça as capacidades",
      ru: "Узнать возможности",
      zh: "了解功能",
      ja: "機能を学ぶ",
      ko: "기능 알아보기",
      tr: "Yetenekleri öğren",
      no: "Lær mulighetene"
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
      <p className="text-xl md:text-2xl mb-6 text-mimi-secondary animate-fade-in delay-100">
        {getLangText(texts.subtitle)}
      </p>
      <p className="max-w-2xl mb-8 animate-fade-in delay-200">
        {getLangText(texts.description)}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
        <Button 
          size="lg"
          className="bg-mimi-primary hover:bg-mimi-secondary text-white"
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
      
      {/* Decorative elements with more masculine aesthetic */}
      <div className="mt-16 relative w-full max-w-4xl animate-fade-in delay-400">
        <div className="rounded-lg overflow-hidden shadow-xl border">
          <div className="bg-mimi-dark/5 dark:bg-mimi-dark/40 h-12 flex items-center px-4 border-b">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-mimi-softblue dark:from-mimi-dark dark:to-mimi-dark/80 h-80 flex items-center justify-center relative">
            <div className="chat-bubble-assistant absolute top-10 left-10">
              <p>{getLangText({
                en: "Ready for your command. How can I assist?",
                ar: "جاهز لأمرك. كيف يمكنني المساعدة؟",
                fr: "Prêt pour votre commande. Comment puis-je aider?",
                es: "Listo para tu comando. ¿Cómo puedo ayudar?",
                de: "Bereit für Ihren Befehl. Wie kann ich helfen?",
                it: "Pronto per il tuo comando. Come posso aiutare?",
                pt: "Pronto para seu comando. Como posso ajudar?",
                ru: "Готов к вашей команде. Чем могу помочь?",
                zh: "准备好接受您的命令。我能帮什么忙？",
                ja: "あなたの指示を待っています。どのようにお手伝いできますか？",
                ko: "명령을 기다리고 있습니다. 어떻게 도와드릴까요?",
                tr: "Komutunuz için hazırım. Nasıl yardımcı olabilirim?",
                no: "Klar for din kommando. Hvordan kan jeg hjelpe?"
              })}</p>
            </div>
            <div className="chat-bubble-user absolute bottom-10 right-10">
              <p>{getLangText({
                en: "Execute data analysis protocol.",
                ar: "تنفيذ بروتوكول تحليل البيانات.",
                fr: "Exécuter le protocole d'analyse de données.",
                es: "Ejecutar protocolo de análisis de datos.",
                de: "Datenanalyseprotokoll ausführen.",
                it: "Eseguire il protocollo di analisi dei dati.",
                pt: "Executar protocolo de análise de dados.",
                ru: "Выполнить протокол анализа данных.",
                zh: "执行数据分析协议。",
                ja: "データ分析プロトコルを実行します。",
                ko: "데이터 분석 프로토콜을 실행하십시오.",
                tr: "Veri analizi protokolünü yürütün.",
                no: "Utfør dataanalyseprotokoll."
              })}</p>
            </div>
            <div className="w-24 h-24 rounded-lg bg-mimi-primary/20 flex items-center justify-center">
              <div className="text-4xl">🖥️</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
