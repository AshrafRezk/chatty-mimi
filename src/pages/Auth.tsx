
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { Motion } from "@/components/ui/motion";
import SEOHead from "@/components/SEOHead";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, loading } = useAuth();
  const { state } = useChat();
  const { language } = state;
  
  const texts = {
    title: {
      en: "Authentication",
      ar: "تسجيل الدخول"
    },
    signIn: {
      en: "Sign In",
      ar: "تسجيل الدخول"
    },
    signUp: {
      en: "Sign Up",
      ar: "إنشاء حساب"
    },
    email: {
      en: "Email",
      ar: "البريد الإلكتروني"
    },
    password: {
      en: "Password",
      ar: "كلمة المرور"
    },
    noAccount: {
      en: "Don't have an account?",
      ar: "ليس لديك حساب؟"
    },
    hasAccount: {
      en: "Already have an account?",
      ar: "لديك حساب بالفعل؟"
    },
    backToHome: {
      en: "Back to Home",
      ar: "العودة إلى الصفحة الرئيسية"
    },
    createAccount: {
      en: "Create your account",
      ar: "أنشئ حسابك"
    },
    welcomeBack: {
      en: "Welcome back",
      ar: "مرحبًا بعودتك"
    },
    signInDescription: {
      en: "Enter your credentials to access your account",
      ar: "أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك"
    },
    signUpDescription: {
      en: "Enter your information to create an account",
      ar: "أدخل معلوماتك لإنشاء حساب"
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
  };

  return (
    <>
      <SEOHead 
        title={`Mimi - ${texts.title[language]}`}
        description="Sign in to your Mimi account"
      />
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "flex min-h-screen flex-col items-center justify-center p-4 md:p-8",
          language === 'ar' ? 'rtl' : ''
        )}
      >
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="mb-6 text-center block text-xl font-bold text-mimi-primary"
          >
            Mimi
          </Link>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">{texts.signIn[language]}</TabsTrigger>
              <TabsTrigger value="signup">{texts.signUp[language]}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>{texts.welcomeBack[language]}</CardTitle>
                  <CardDescription>{texts.signInDescription[language]}</CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">{texts.email[language]}</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">{texts.password[language]}</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col items-center gap-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        texts.signIn[language]
                      )}
                    </Button>
                    
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                      {texts.backToHome[language]}
                    </Link>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>{texts.createAccount[language]}</CardTitle>
                  <CardDescription>{texts.signUpDescription[language]}</CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{texts.email[language]}</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{texts.password[language]}</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col items-center gap-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        texts.signUp[language]
                      )}
                    </Button>
                    
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                      {texts.backToHome[language]}
                    </Link>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Motion.div>
    </>
  );
};

export default Auth;
