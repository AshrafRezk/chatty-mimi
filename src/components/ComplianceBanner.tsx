
import { Shield, Lock, CheckCircle } from "lucide-react";

const ComplianceBanner = () => {
  return (
    <div className="w-full bg-white dark:bg-mimi-dark/30 backdrop-blur-sm border border-mimi-soft dark:border-mimi-primary/20 rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="text-sm font-medium flex items-center text-mimi-secondary mb-2">
        <Shield className="w-4 h-4 mr-2" />
        Security & Compliance
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="flex items-start">
          <CheckCircle className="w-3.5 h-3.5 text-mimi-primary mr-2 mt-0.5" />
          <div>
            <p className="font-medium">HIPAA Compliant</p>
            <p className="text-mimi-neutral">For healthcare data protection</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Lock className="w-3.5 h-3.5 text-mimi-primary mr-2 mt-0.5" />
          <div>
            <p className="font-medium">End-to-End Encrypted</p>
            <p className="text-mimi-neutral">Your conversations remain private</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CheckCircle className="w-3.5 h-3.5 text-mimi-primary mr-2 mt-0.5" />
          <div>
            <p className="font-medium">ISO 27001 Certified</p>
            <p className="text-mimi-neutral">Information security standard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceBanner;
