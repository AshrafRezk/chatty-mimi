
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

const PremiumLock = () => {
  const { state } = useChat();
  const { language } = state;
  
  // Define texts for multiple languages
  const getLocalizedText = (textObject: Record<string, string>): string => {
    return textObject[language] || textObject['en']; // Fallback to English
  };
  
  const texts = {
    title: {
      'en': 'You\'ve reached the free limit',
      'ar': 'لقد وصلت إلى الحد الأقصى المجاني',
      'fr': 'Vous avez atteint la limite gratuite',
      'es': 'Has alcanzado el límite gratuito',
      'de': 'Sie haben das kostenlose Limit erreicht',
      'it': 'Hai raggiunto il limite gratuito',
      'pt': 'Você atingiu o limite gratuito',
      'ru': 'Вы достигли бесплатного лимита',
      'zh': '您已达到免费限制',
      'ja': '無料の制限に達しました',
      'ko': '무료 한도에 도달했습니다',
      'tr': 'Ücretsiz limite ulaştınız',
      'no': 'Du har nådd den gratis grensen'
    },
    description: {
      'en': 'To continue chatting with Mimi, please upgrade to premium',
      'ar': 'للاستمرار في المحادثة مع ميمي، يرجى الترقية إلى النسخة المميزة',
      'fr': 'Pour continuer à discuter avec Mimi, veuillez passer à la version premium',
      'es': 'Para seguir chateando con Mimi, actualiza a premium',
      'de': 'Um weiterhin mit Mimi zu chatten, bitte auf Premium upgraden',
      'it': 'Per continuare a chattare con Mimi, passa a premium',
      'pt': 'Para continuar conversando com Mimi, atualize para o premium',
      'ru': 'Чтобы продолжить общение с Mimi, перейдите на премиум-версию',
      'zh': '要继续与Mimi聊天，请升级到高级版',
      'ja': 'Mimiとのチャットを続けるには、プレミアムにアップグレードしてください',
      'ko': 'Mimi와 계속 채팅하려면 프리미엄으로 업그레이드하세요',
      'tr': 'Mimi ile sohbete devam etmek için lütfen premium\'a yükseltin',
      'no': 'For å fortsette å chatte med Mimi, vennligst oppgrader til premium'
    },
    payEgypt: {
      'en': 'Pay via local transfer (Egypt)',
      'ar': 'الدفع عبر حوالة محلية (مصر)',
      'fr': 'Payer par virement local (Égypte)',
      'es': 'Pagar mediante transferencia local (Egipto)',
      'de': 'Via lokale Überweisung zahlen (Ägypten)',
      'it': 'Paga tramite bonifico locale (Egitto)',
      'pt': 'Pague por transferência local (Egito)',
      'ru': 'Оплатить через местный перевод (Египет)',
      'zh': '通过本地转账支付（埃及）',
      'ja': '現地送金で支払う（エジプト）',
      'ko': '현지 송금으로 지불 (이집트)',
      'tr': 'Yerel transfer ile öde (Mısır)',
      'no': 'Betal via lokal overføring (Egypt)'
    },
    payGlobal: {
      'en': 'Pay via global payment',
      'ar': 'الدفع عبر بوابة دفع عالمية',
      'fr': 'Payer via un paiement global',
      'es': 'Pagar mediante pago global',
      'de': 'Via globale Zahlung bezahlen',
      'it': 'Paga tramite pagamento globale',
      'pt': 'Pague via pagamento global',
      'ru': 'Оплатить через глобальный платеж',
      'zh': '通过全球支付',
      'ja': 'グローバル決済で支払う',
      'ko': '글로벌 결제로 지불하기',
      'tr': 'Küresel ödeme ile öde',
      'no': 'Betal via global betaling'
    },
    payPaypal: {
      'en': 'Pay with PayPal',
      'ar': 'الدفع عبر باي بال',
      'fr': 'Payer avec PayPal',
      'es': 'Pagar con PayPal',
      'de': 'Mit PayPal bezahlen',
      'it': 'Paga con PayPal',
      'pt': 'Pagar com PayPal',
      'ru': 'Оплатить через PayPal',
      'zh': '使用PayPal支付',
      'ja': 'PayPalで支払う',
      'ko': 'PayPal로 결제하기',
      'tr': 'PayPal ile öde',
      'no': 'Betal med PayPal'
    },
    contactUs: {
      'en': 'Contact us via WhatsApp',
      'ar': 'تواصل معنا عبر واتساب',
      'fr': 'Contactez-nous via WhatsApp',
      'es': 'Contáctenos por WhatsApp',
      'de': 'Kontaktieren Sie uns via WhatsApp',
      'it': 'Contattaci via WhatsApp',
      'pt': 'Entre em contato conosco pelo WhatsApp',
      'ru': 'Свяжитесь с нами через WhatsApp',
      'zh': '通过WhatsApp联系我们',
      'ja': 'WhatsAppでお問い合わせください',
      'ko': 'WhatsApp으로 문의하세요',
      'tr': 'WhatsApp üzerinden bize ulaşın',
      'no': 'Kontakt oss via WhatsApp'
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50",
      language === 'ar' ? 'rtl' : ''
    )}>
      <div className="bg-white dark:bg-mimi-dark p-8 rounded-xl max-w-md w-full shadow-xl animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-mimi-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-10 h-10 text-mimi-primary"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 gradient-text">{getLocalizedText(texts.title)}</h2>
          <p className="text-muted-foreground mb-6">{getLocalizedText(texts.description)}</p>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full bg-mimi-primary hover:bg-mimi-secondary">
            {getLocalizedText(texts.payEgypt)}
          </Button>
          <Button variant="outline" className="w-full border-mimi-primary text-mimi-primary hover:bg-mimi-soft">
            {getLocalizedText(texts.payGlobal)}
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {getLocalizedText(texts.payPaypal)}
          </Button>
          <Button variant="link" className="w-full text-mimi-secondary">
            {getLocalizedText(texts.contactUs)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumLock;
