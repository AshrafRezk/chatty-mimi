
import { useChat } from "@/context/ChatContext";
import { Persona } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainCircuit, Stethoscope, Building, ClipboardList, Code, LibraryBig, Scale, GraduationCap } from "lucide-react";

const PersonaSelector = () => {
  const { state, setPersona } = useChat();
  const { aiConfig, language } = state;
  
  const personas: { value: Persona; label: Record<Language, string>; icon: React.ReactNode }[] = [
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
  ];

  const handlePersonaChange = (value: string) => {
    setPersona(value as Persona);
  };

  return (
    <div className={cn("flex items-center", language === 'ar' ? 'flex-row-reverse' : '')}>
      <Select value={aiConfig.persona} onValueChange={handlePersonaChange}>
        <SelectTrigger className="w-[180px] bg-white/70 dark:bg-mimi-dark/60 backdrop-blur-sm border-0">
          <SelectValue placeholder="Select persona" />
        </SelectTrigger>
        <SelectContent>
          {personas.map((persona) => (
            <SelectItem key={persona.value} value={persona.value}>
              <div className="flex items-center">
                {persona.icon}
                <span>{persona.label[language]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PersonaSelector;
