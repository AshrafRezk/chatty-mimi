
import { PropertyData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/context/ChatContext";
import { BuildingIcon, MapPinIcon, BedDoubleIcon, ShowerHeadIcon, RulerIcon, CreditCardIcon } from "lucide-react";

interface PropertyDetailsProps {
  propertyData: PropertyData;
}

const PropertyDetails = ({ propertyData }: PropertyDetailsProps) => {
  const { state } = useChat();
  const { language } = state;

  // Format currency based on language/region
  const formatCurrency = (amount: number) => {
    // Use Egyptian Pounds for Egypt, USD as fallback
    if (state.userLocation?.countryCode === 'EG') {
      return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const translations = {
    propertyDetails: {
      en: "Property Details",
      ar: "تفاصيل العقار"
    },
    location: {
      en: "Location",
      ar: "الموقع"
    },
    price: {
      en: "Price",
      ar: "السعر"
    },
    area: {
      en: "Area",
      ar: "المساحة"
    },
    bedrooms: {
      en: "Bedrooms",
      ar: "غرف النوم"
    },
    bathrooms: {
      en: "Bathrooms",
      ar: "الحمامات"
    },
    paymentPlan: {
      en: "Payment Plan",
      ar: "خطة الدفع"
    },
    downPayment: {
      en: "Down Payment",
      ar: "الدفعة المقدمة"
    },
    monthly: {
      en: "Monthly Payment",
      ar: "الدفع الشهري"
    },
    years: {
      en: "Years",
      ar: "سنوات"
    },
    sqm: {
      en: "sq.m",
      ar: "متر مربع"
    }
  };

  const t = (key: keyof typeof translations, subKey: keyof typeof translations[typeof key]) => {
    return translations[key][subKey] || translations[key]['en'];
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4 overflow-hidden border shadow-md">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="text-lg font-medium">
          {t('propertyDetails', language as any)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('location', language as any)}</p>
              <p className="font-medium">{propertyData.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('price', language as any)}</p>
              <p className="font-medium text-primary">{formatCurrency(propertyData.price)}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RulerIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('area', language as any)}</p>
              <p className="font-medium">{propertyData.area} {t('sqm', language as any)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <BedDoubleIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('bedrooms', language as any)}</p>
              <p className="font-medium">{propertyData.bedrooms}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <ShowerHeadIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('bathrooms', language as any)}</p>
              <p className="font-medium">{propertyData.bathrooms}</p>
            </div>
          </div>
        </div>
        
        {propertyData.paymentPlan && (
          <>
            <div className="h-px bg-muted my-2" />
            <div className="space-y-2">
              <p className="font-medium text-sm">{t('paymentPlan', language as any)}</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t('downPayment', language as any)}</p>
                  <p className="font-medium">{formatCurrency(propertyData.paymentPlan.downPayment)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('monthly', language as any)}</p>
                  <p className="font-medium">{formatCurrency(propertyData.paymentPlan.monthlyInstallment)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('years', language as any)}</p>
                  <p className="font-medium">{propertyData.paymentPlan.years}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
