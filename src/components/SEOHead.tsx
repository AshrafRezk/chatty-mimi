
import { Helmet } from "react-helmet-async";
import { useChat } from "@/context/ChatContext";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
}

const SEOHead = ({ 
  title = "Mimi AI - Your Intelligent Assistant",
  description = "Mimi is an advanced AI assistant with multilingual support, image analysis, and expertise in various domains including real estate, medicine, and software development.",
  canonicalUrl = "https://mimi-ai.app",
  imageUrl = "/mimi-preview.jpg" 
}: SEOHeadProps) => {
  const { state } = useChat();
  const { language } = state;
  
  const localizedTitle = language === 'ar' ? "ميمي الذكاء الاصطناعي - مساعدك الذكي" : title;
  const localizedDescription = language === 'ar' 
    ? "ميمي هي مساعدة ذكاء اصطناعي متقدمة مع دعم متعدد اللغات وتحليل الصور وخبرة في مجالات متنوعة بما في ذلك العقارات والطب وتطوير البرمجيات."
    : description;

  return (
    <Helmet>
      <title>{localizedTitle}</title>
      <meta name="description" content={localizedDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={localizedTitle} />
      <meta property="og:description" content={localizedDescription} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={localizedTitle} />
      <meta property="twitter:description" content={localizedDescription} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language tag */}
      <html lang={language === 'ar' ? 'ar' : 'en'} />
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#5c67de" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEOHead;
