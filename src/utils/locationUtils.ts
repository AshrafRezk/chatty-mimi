
import { Language, UserLocation } from "../types";

export const detectUserLocation = async (): Promise<UserLocation | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    return {
      city: data.city || 'Unknown City',
      country: data.country_name || 'Unknown Country',
      countryCode: data.country_code || 'US'
    };
  } catch (error) {
    console.error('Error detecting user location:', error);
    return null;
  }
};

export const getDefaultLanguageFromLocation = (countryCode: string): Language => {
  switch (countryCode?.toUpperCase()) {
    case 'EG':
    case 'SA':
    case 'AE':
    case 'QA':
    case 'KW':
    case 'BH':
    case 'OM':
    case 'JO':
    case 'LB':
    case 'SY':
    case 'IQ':
    case 'YE':
    case 'SD':
      return 'ar';
    case 'FR':
      return 'fr';
    case 'ES':
    case 'MX':
    case 'CO':
    case 'AR':
      return 'es';
    case 'DE':
    case 'AT':
    case 'CH':
      return 'de';
    case 'IT':
      return 'it';
    case 'PT':
    case 'BR':
      return 'pt';
    case 'RU':
      return 'ru';
    case 'CN':
    case 'TW':
    case 'HK':
      return 'zh';
    case 'JP':
      return 'ja';
    case 'KR':
      return 'ko';
    case 'TR':
      return 'tr';
    case 'NO':
      return 'no';
    default:
      return 'en';
  }
};

export const getWelcomeMessage = (userLocation: UserLocation | null, language: Language): string => {
  if (language === 'ar') {
    return userLocation 
      ? `مرحبًا بك في ميمي! أنا هنا لمساعدتك في ${userLocation.city}، ${userLocation.country}. كيف يمكنني مساعدتك اليوم؟
      
أنا لست مجرد مساعد ذكاء اصطناعي، بل منصة متكاملة تجمع بين عدة نماذج ذكاء اصطناعي وتقنيات متقدمة. يمكنني:

• البحث في الإنترنت للحصول على معلومات محدثة
• تحليل الصور واستخراج النصوص منها
• تقديم المشورة المتخصصة في عدة مجالات
• العمل بعدة لغات وأنماط
• تحويل النص إلى كلام والاستماع لتعليماتك صوتيًا

يمكنك اختيار شخصية متخصصة من القائمة المنسدلة في الأعلى للحصول على مساعدة موجهة في مجال محدد.`
      : `مرحبًا بك في ميمي! أنا هنا لمساعدتك. كيف يمكنني مساعدتك اليوم؟
      
أنا لست مجرد مساعد ذكاء اصطناعي، بل منصة متكاملة تجمع بين عدة نماذج ذكاء اصطناعي وتقنيات متقدمة. يمكنني:

• البحث في الإنترنت للحصول على معلومات محدثة
• تحليل الصور واستخراج النصوص منها
• تقديم المشورة المتخصصة في عدة مجالات
• العمل بعدة لغات وأنماط
• تحويل النص إلى كلام والاستماع لتعليماتك صوتيًا

يمكنك اختيار شخصية متخصصة من القائمة المنسدلة في الأعلى للحصول على مساعدة موجهة في مجال محدد.`;
  }
  
  return userLocation 
    ? `Welcome to Mimi! I'm here to assist you in ${userLocation.city}, ${userLocation.country}. How can I help you today?
    
I'm not just another AI assistant, but a comprehensive platform integrating multiple AI models and advanced technologies. I can:

• Search the web for up-to-date information
• Analyze images and extract text from them
• Provide specialized expertise across various domains
• Work in multiple languages and styles
• Convert text to speech and listen to your voice commands

You can select a specialized persona from the dropdown above to get targeted help in a specific domain.`
    : `Welcome to Mimi! I'm here to assist you. How can I help you today?
    
I'm not just another AI assistant, but a comprehensive platform integrating multiple AI models and advanced technologies. I can:

• Search the web for up-to-date information
• Analyze images and extract text from them
• Provide specialized expertise across various domains
• Work in multiple languages and styles
• Convert text to speech and listen to your voice commands

You can select a specialized persona from the dropdown above to get targeted help in a specific domain.`;
};

export const getPersonaWelcomeMessage = (persona: string, language: Language): string => {
  if (persona === 'diet_coach') {
    return language === 'ar'
      ? `أنا حاليًا في وضع مدرب الحمية الغذائية. يمكنني مساعدتك بـ:

• تحليل القيمة الغذائية للوجبات
• إنشاء خطط غذائية مخصصة
• تقديم نصائح للأكل الصحي
• تحليل الصور الغذائية وعرض محتواها الغذائي بيانيًا

يمكنك إرفاق صور للطعام وسأحللها تلقائيًا!`
      : `I'm currently in Diet Coach mode. I can help you with:

• Analyzing meal nutrition content
• Creating personalized meal plans
• Providing healthy eating advice
• Analyzing food images and displaying their nutritional content graphically

You can attach food images and I'll analyze them automatically!`;
  }
  
  if (persona === 'real_estate') {
    return language === 'ar'
      ? `أنا حاليًا في وضع مستشار العقارات. يمكنني مساعدتك بـ:

• اقتراح عقارات تناسب ميزانيتك
• تحليل خطط الدفع والرهون العقارية
• مقارنة الخيارات الاستثمارية
• تقديم معلومات عن اتجاهات السوق

لمساعدتك بشكل أفضل، أخبرني عن:
1. ميزانيتك المتاحة للدفعة الأولى
2. راتبك الشهري
3. المواقع التي تفضلها
4. حجم عائلتك واحتياجاتها`
      : `I'm currently in Real Estate Consultant mode. I can help you with:

• Suggesting properties within your budget
• Analyzing payment plans and mortgages
• Comparing investment options
• Providing market trend information

To assist you better, please tell me about:
1. Your available budget for down payment
2. Your monthly income
3. Your preferred locations
4. Your family size and needs`;
  }
  
  return '';
};
