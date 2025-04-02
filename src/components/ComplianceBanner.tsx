
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { X, Lock, Shield } from "lucide-react";
import { Motion, AnimatePresence } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

const ComplianceBanner = () => {
  const { state } = useChat();
  const { language } = state;
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const complianceText = {
    en: {
      title: "Privacy & Security",
      content: "Mimi is HIPAA compliant and adheres to strict data security standards. Your conversations are private and never shared with third parties.",
      button: "Got it"
    },
    ar: {
      title: "الخصوصية والأمان",
      content: "ميمي متوافقة مع معايير HIPAA وتلتزم بمعايير أمان البيانات الصارمة. محادثاتك خاصة ولا يتم مشاركتها مع أطراف ثالثة.",
      button: "فهمت"
    },
    fr: {
      title: "Confidentialité et sécurité",
      content: "Mimi est conforme à la HIPAA et adhère à des normes strictes de sécurité des données. Vos conversations sont privées et jamais partagées avec des tiers.",
      button: "Compris"
    },
    es: {
      title: "Privacidad y seguridad",
      content: "Mimi cumple con HIPAA y se adhiere a estrictos estándares de seguridad de datos. Sus conversaciones son privadas y nunca se comparten con terceros.",
      button: "Entendido"
    },
    de: {
      title: "Datenschutz & Sicherheit",
      content: "Mimi ist HIPAA-konform und hält sich an strenge Datensicherheitsstandards. Ihre Gespräche sind privat und werden niemals an Dritte weitergegeben.",
      button: "Verstanden"
    },
    it: {
      title: "Privacy e sicurezza",
      content: "Mimi è conforme a HIPAA e aderisce a rigorosi standard di sicurezza dei dati. Le tue conversazioni sono private e mai condivise con terze parti.",
      button: "Capito"
    },
    pt: {
      title: "Privacidade e Segurança",
      content: "Mimi está em conformidade com a HIPAA e adere a padrões rigorosos de segurança de dados. Suas conversas são privadas e nunca compartilhadas com terceiros.",
      button: "Entendi"
    },
    ru: {
      title: "Конфиденциальность и безопасность",
      content: "Mimi соответствует требованиям HIPAA и придерживается строгих стандартов безопасности данных. Ваши разговоры конфиденциальны и никогда не передаются третьим лицам.",
      button: "Понятно"
    },
    zh: {
      title: "隐私与安全",
      content: "Mimi 符合 HIPAA 标准，遵守严格的数据安全标准。您的对话是私密的，绝不会与第三方共享。",
      button: "了解"
    },
    ja: {
      title: "プライバシーとセキュリティ",
      content: "MimiはHIPAAに準拠し、厳格なデータセキュリティ基準を遵守しています。あなたの会話は非公開であり、第三者と共有されることはありません。",
      button: "了解"
    },
    ko: {
      title: "개인 정보 보호 및 보안",
      content: "Mimi는 HIPAA를 준수하며 엄격한 데이터 보안 표준을 준수합니다. 귀하의 대화는 비공개이며 제3자와 공유되지 않습니다.",
      button: "이해함"
    },
    tr: {
      title: "Gizlilik ve Güvenlik",
      content: "Mimi, HIPAA uyumludur ve katı veri güvenliği standartlarına uyar. Konuşmalarınız özeldir ve üçüncü taraflarla asla paylaşılmaz.",
      button: "Anladım"
    },
    no: {
      title: "Personvern og sikkerhet",
      content: "Mimi er HIPAA-kompatibel og overholder strenge standarder for datasikkerhet. Samtalene dine er private og deles aldri med tredjeparter.",
      button: "Forstått"
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  const currentLanguage = complianceText[language] || complianceText.en;
  
  return (
    <Motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 p-4 rounded-md border bg-mimi-soft/50 dark:bg-mimi-dark/50 backdrop-blur-sm relative"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 p-1 rounded-full bg-mimi-primary/20">
          <Shield className="h-5 w-5 text-mimi-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium mb-1">{currentLanguage.title}</h3>
          <p className="text-sm opacity-90">{currentLanguage.content}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClose}
          className="text-xs"
        >
          {currentLanguage.button}
        </Button>
      </div>
      
      <button 
        onClick={handleClose} 
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </Motion.div>
  );
};

export default ComplianceBanner;
