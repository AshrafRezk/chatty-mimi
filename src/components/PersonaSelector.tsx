
import { useChat } from "@/context/ChatContext";
import { Persona, Language } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  BrainCircuit, 
  Stethoscope, 
  Building, 
  ClipboardList, 
  Code, 
  LibraryBig, 
  Scale, 
  GraduationCap,
  Cross,
  BookOpen,
  Apple,
  Home,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PersonaSelector = () => {
  const { state, setPersona } = useChat();
  const { aiConfig, language, mood } = state;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  
  const personas: { value: Persona; label: Record<Language, string>; icon: React.ReactNode; isNew?: boolean }[] = [
    { 
      value: 'general', 
      label: {
        en: 'General Assistant',
        ar: 'مساعد عام',
        fr: 'Assistant général',
        es: 'Asistente general',
        de: 'Allgemeiner Assistent',
        it: 'Assistente generale',
        pt: 'Assistente geral',
        ru: 'Общий помощник',
        zh: '通用助手',
        ja: '一般アシスタント',
        ko: '일반 보조',
        tr: 'Genel Asistan',
        no: 'Generell assistent'
      },
      icon: <BrainCircuit className="h-4 w-4 mr-2" />
    },
    { 
      value: 'software', 
      label: {
        en: 'Software Development',
        ar: 'تطوير البرمجيات',
        fr: 'Développement logiciel',
        es: 'Desarrollo de software',
        de: 'Softwareentwicklung',
        it: 'Sviluppo software',
        pt: 'Desenvolvimento de software',
        ru: 'Разработка ПО',
        zh: '软件开发',
        ja: 'ソフトウェア開発',
        ko: '소프트웨어 개발',
        tr: 'Yazılım Geliştirme',
        no: 'Programvareutvikling'
      },
      icon: <Code className="h-4 w-4 mr-2" />
    },
    { 
      value: 'medicine', 
      label: {
        en: 'Healthcare',
        ar: 'الرعاية الصحية',
        fr: 'Soins de santé',
        es: 'Asistencia sanitaria',
        de: 'Gesundheitswesen',
        it: 'Assistenza sanitaria',
        pt: 'Saúde',
        ru: 'Здравоохранение',
        zh: '医疗保健',
        ja: 'ヘルスケア',
        ko: '의료',
        tr: 'Sağlık Hizmetleri',
        no: 'Helsevesen'
      },
      icon: <Stethoscope className="h-4 w-4 mr-2" />
    },
    { 
      value: 'architecture', 
      label: {
        en: 'Architecture & Design',
        ar: 'الهندسة المعمارية والتصميم',
        fr: 'Architecture et Design',
        es: 'Arquitectura y Diseño',
        de: 'Architektur & Design',
        it: 'Architettura e Design',
        pt: 'Arquitetura e Design',
        ru: 'Архитектура и Дизайн',
        zh: '建筑与设计',
        ja: '建築とデザイン',
        ko: '건축 및 디자인',
        tr: 'Mimarlık ve Tasarım',
        no: 'Arkitektur og design'
      },
      icon: <Building className="h-4 w-4 mr-2" />
    },
    { 
      value: 'project_management', 
      label: {
        en: 'Project Management',
        ar: 'إدارة المشاريع',
        fr: 'Gestion de projet',
        es: 'Gestión de proyectos',
        de: 'Projektmanagement',
        it: 'Gestione progetti',
        pt: 'Gestão de projetos',
        ru: 'Управление проектами',
        zh: '项目管理',
        ja: 'プロジェクト管理',
        ko: '프로젝트 관리',
        tr: 'Proje Yönetimi',
        no: 'Prosjektledelse'
      },
      icon: <ClipboardList className="h-4 w-4 mr-2" />
    },
    { 
      value: 'finance', 
      label: {
        en: 'Finance',
        ar: 'التمويل',
        fr: 'Finance',
        es: 'Finanzas',
        de: 'Finanzen',
        it: 'Finanza',
        pt: 'Finanças',
        ru: 'Финансы',
        zh: '金融',
        ja: 'ファイナンス',
        ko: '금융',
        tr: 'Finans',
        no: 'Finans'
      },
      icon: <LibraryBig className="h-4 w-4 mr-2" />
    },
    { 
      value: 'education', 
      label: {
        en: 'Education',
        ar: 'التعليم',
        fr: 'Éducation',
        es: 'Educación',
        de: 'Bildung',
        it: 'Istruzione',
        pt: 'Educação',
        ru: 'Образование',
        zh: '教育',
        ja: '教育',
        ko: '교육',
        tr: 'Eğitim',
        no: 'Utdanning'
      },
      icon: <GraduationCap className="h-4 w-4 mr-2" />
    },
    { 
      value: 'legal', 
      label: {
        en: 'Legal',
        ar: 'قانوني',
        fr: 'Juridique',
        es: 'Legal',
        de: 'Recht',
        it: 'Legale',
        pt: 'Jurídico',
        ru: 'Юридический',
        zh: '法律',
        ja: '法律',
        ko: '법률',
        tr: 'Yasal',
        no: 'Juridisk'
      },
      icon: <Scale className="h-4 w-4 mr-2" />
    },
    { 
      value: 'christianity', 
      label: {
        en: 'Christianity Expert',
        ar: 'خبير المسيحية',
        fr: 'Expert en christianisme',
        es: 'Experto en cristianismo',
        de: 'Christentum-Experte',
        it: 'Esperto di cristianesimo',
        pt: 'Especialista em cristianismo',
        ru: 'Эксперт по христианству',
        zh: '基督教专家',
        ja: 'キリスト教専門家',
        ko: '기독교 전문가',
        tr: 'Hristiyanlık Uzmanı',
        no: 'Kristendomsekspert'
      },
      icon: <Cross className="h-4 w-4 mr-2" />
    },
    { 
      value: 'islam', 
      label: {
        en: 'Islamic Studies',
        ar: 'دراسات إسلامية',
        fr: 'Études islamiques',
        es: 'Estudios islámicos',
        de: 'Islamische Studien',
        it: 'Studi islamici',
        pt: 'Estudos islâmicos',
        ru: 'Исламоведение',
        zh: '伊斯兰研究',
        ja: 'イスラム研究',
        ko: '이슬람 연구',
        tr: 'İslami Çalışmalar',
        no: 'Islamske studier'
      },
      icon: <BookOpen className="h-4 w-4 mr-2" />
    },
    { 
      value: 'diet_coach', 
      label: {
        en: 'Diet Coach',
        ar: 'مدرب الحمية',
        fr: 'Coach diététique',
        es: 'Entrenador de dieta',
        de: 'Ernährungscoach',
        it: 'Coach alimentare',
        pt: 'Treinador de dieta',
        ru: 'Тренер по питанию',
        zh: '饮食教练',
        ja: '食事コーチ',
        ko: '다이어트 코치',
        tr: 'Diyet Koçu',
        no: 'Kostholdscoach'
      },
      icon: <Apple className="h-4 w-4 mr-2" />
    },
    { 
      value: 'real_estate', 
      label: {
        en: 'Real Estate Consultant',
        ar: 'مستشار العقارات',
        fr: 'Consultant immobilier',
        es: 'Consultor inmobiliario',
        de: 'Immobilienberater',
        it: 'Consulente immobiliare',
        pt: 'Consultor imobiliário',
        ru: 'Консультант по недвижимости',
        zh: '房地产顾问',
        ja: '不動産コンサルタント',
        ko: '부동산 컨설턴트',
        tr: 'Emlak Danışmanı',
        no: 'Eiendomskonsulent'
      },
      icon: <Home className="h-4 w-4 mr-2" />,
      isNew: true
    },
  ];

  const handlePersonaChange = (value: string) => {
    setPersona(value as Persona);
    setOpen(false);
  };

  const isDarkMode = mood === 'deep' || mood === 'focus';

  const currentPersona = personas.find(p => p.value === aiConfig.persona);
  const currentLabel = currentPersona?.label[language as keyof typeof currentPersona.label] || '';
  
  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex items-center",
        isMobile ? "" : language === 'ar' ? 'flex-row-reverse' : ''
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[180px] md:w-[220px] flex items-center justify-between backdrop-blur-sm",
              isDarkMode 
                ? "bg-white/20 text-white border-white/30" 
                : "bg-white/70 dark:bg-mimi-dark/60"
            )}
          >
            <div className="flex items-center truncate">
              {currentPersona?.icon}
              <span className="truncate">{currentLabel}</span>
              {currentPersona?.isNew && (
                <Badge variant="outline" className="ml-2 h-5 bg-green-500/10 text-green-600 border-green-500/30">
                  {language === 'ar' ? 'جديد' : 'NEW'}
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] md:w-[320px] p-0">
          <Command>
            <CommandInput 
              placeholder={language === 'ar' ? "ابحث عن شخصية..." : "Search personas..."} 
              className={language === 'ar' ? 'text-right' : ''}
            />
            <CommandList>
              <CommandEmpty>
                {language === 'ar' ? 'لم يتم العثور على شخصية' : 'No persona found.'}
              </CommandEmpty>
              <CommandGroup>
                {personas.map((persona) => (
                  <CommandItem
                    key={persona.value}
                    value={persona.value}
                    onSelect={() => handlePersonaChange(persona.value)}
                    className="flex items-center"
                  >
                    {persona.icon}
                    <span className="flex-1 truncate">
                      {persona.label[language as keyof typeof persona.label]}
                    </span>
                    {persona.isNew && (
                      <Badge variant="outline" className="ml-2 h-5 bg-green-500/10 text-green-600 border-green-500/30">
                        {language === 'ar' ? 'جديد' : 'NEW'}
                      </Badge>
                    )}
                    {persona.value === aiConfig.persona && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Motion.div>
  );
};

export default PersonaSelector;
