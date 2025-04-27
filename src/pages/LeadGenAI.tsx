
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LeadRequest } from '@/types/leadGenAI';
import Navbar from '@/components/Navbar';
import LeadGenForm from '@/components/leadgen/LeadGenForm';
import StakeholdersTable from '@/components/leadgen/StakeholdersTable';
import CompanyIntentCard from '@/components/leadgen/CompanyIntentCard';
import SalesPlanTabs from '@/components/leadgen/SalesPlanTabs';
import DownloadReportButton from '@/components/leadgen/DownloadReportButton';
import { scrapeStakeholders, scrapeCompanyIntent, generateSalesPlan } from '@/utils/companySearchUtils';

const LeadGenAI: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLeadData, setCurrentLeadData] = useState<LeadRequest | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user && !session) {
      navigate('/auth', { state: { from: '/leadgenai' } });
    }
  }, [user, session, navigate]);

  const handleSubmit = async (leadRequest: LeadRequest) => {
    setIsProcessing(true);
    setShowResults(false);
    
    try {
      // 1. Start by saving the base request to the database
      let requestId: string | undefined;
      
      if (user) {
        const { data, error } = await supabase
          .from('lead_requests')
          .insert({
            user_id: user.id,
            provider_company: leadRequest.providerCompany,
            provider_services: leadRequest.providerServices,
            target_client: leadRequest.targetClient,
            target_client_website: leadRequest.targetClientWebsite,
          })
          .select('id')
          .single();
          
        if (error) throw error;
        requestId = data.id;
      }
      
      // For demo, we'll continue even without saving to DB if not logged in
      
      toast.info('Gathering stakeholder information...', { duration: 2000 });
      
      // 2. Scrape stakeholders
      const stakeholders = await scrapeStakeholders(
        leadRequest.targetClient, 
        leadRequest.targetClientWebsite
      );
      
      // Save stakeholders if we have a request ID
      if (requestId && stakeholders.length > 0) {
        const stakeholdersWithRequestId = stakeholders.map(s => ({
          ...s,
          request_id: requestId
        }));
        
        await supabase
          .from('lead_contacts')
          .insert(stakeholdersWithRequestId);
      }
      
      toast.info('Analyzing company intent...', { duration: 2000 });
      
      // 3. Scrape company intent
      const intent = await scrapeCompanyIntent(
        leadRequest.targetClient, 
        leadRequest.targetClientWebsite
      );
      
      // Save intent if we have a request ID
      if (requestId) {
        await supabase
          .from('lead_intents')
          .insert({
            request_id: requestId,
            activity_summary: intent.activitySummary,
            urgency_score: intent.urgencyScore
          });
      }
      
      toast.info('Generating sales plan...', { duration: 2000 });
      
      // 4. Generate sales plan
      const salesPlan = await generateSalesPlan(
        leadRequest.providerCompany,
        leadRequest.providerServices,
        leadRequest.targetClient,
        stakeholders,
        intent
      );
      
      // Save sales plan if we have a request ID
      if (requestId) {
        await supabase
          .from('lead_sales_plans')
          .insert({
            request_id: requestId,
            cold_call_script: salesPlan.coldCallScript,
            email_sequence: salesPlan.emailSequence,
            marketing_tips: salesPlan.marketingTips
          });
      }
      
      // 5. Combine all data and set state
      const completeLeadData: LeadRequest = {
        ...leadRequest,
        id: requestId,
        userId: user?.id,
        stakeholders,
        intents: intent,
        salesPlan
      };
      
      setCurrentLeadData(completeLeadData);
      setShowResults(true);
      toast.success('Sales intelligence generation complete!');
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error processing lead request:', error);
      toast.error('An error occurred while generating sales intelligence');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>LeadGenAI - MimiAI</title>
        <meta name="description" content="Generate strategic sales intelligence for your B2B sales with AI" />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">LeadGenAI</h1>
          <p className="text-muted-foreground mb-8">
            Generate strategic sales intelligence for your B2B sales efforts.
          </p>
          
          <LeadGenForm 
            onSubmit={handleSubmit} 
            isProcessing={isProcessing} 
          />
          
          {showResults && currentLeadData && (
            <motion.div
              id="results"
              className="mt-8 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Sales Intelligence Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stakeholders Table */}
                <div className="md:col-span-1">
                  <StakeholdersTable stakeholders={currentLeadData.stakeholders || []} />
                </div>
                
                {/* Company Intent */}
                <div className="md:col-span-1">
                  {currentLeadData.intents && (
                    <CompanyIntentCard intent={currentLeadData.intents} />
                  )}
                </div>
              </div>
              
              {/* Sales Plan */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">AI-Generated Sales Plan</h3>
                {currentLeadData.salesPlan && (
                  <SalesPlanTabs salesPlan={currentLeadData.salesPlan} />
                )}
              </div>
              
              {/* Download Report Button */}
              <div className="mt-6">
                <DownloadReportButton leadData={currentLeadData} />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default LeadGenAI;
