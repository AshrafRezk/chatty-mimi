
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LeadRequest, ScoutingResult, ScoutedCompany } from '@/types/leadGenAI';
import Navbar from '@/components/Navbar';
import LeadGenForm from '@/components/leadgen/LeadGenForm';
import StakeholdersTable from '@/components/leadgen/StakeholdersTable';
import CompanyIntentCard from '@/components/leadgen/CompanyIntentCard';
import SalesPlanTabs from '@/components/leadgen/SalesPlanTabs';
import DownloadReportButton from '@/components/leadgen/DownloadReportButton';
import { scrapeStakeholders, scrapeCompanyIntent, generateSalesPlan, scoutForLeads } from '@/utils/companySearchUtils';

const LeadGenAI: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLeadData, setCurrentLeadData] = useState<LeadRequest | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [scoutingResults, setScoutingResults] = useState<ScoutedCompany[] | null>(null);
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user && !session) {
      navigate('/auth', { state: { from: '/leadgenai' } });
    }
  }, [user, session, navigate]);

  const handleSubmit = async (leadRequest: LeadRequest) => {
    setIsProcessing(true);
    setShowResults(false);
    setScoutingResults(null);
    
    try {
      if (leadRequest.scoutingMode) {
        // Handle scouting mode
        toast.info('Scouting for potential leads...', { duration: 2000 });
        
        const results = await scoutForLeads(
          leadRequest.providerCompany,
          leadRequest.providerServices,
          leadRequest.industry || 'technology'
        );
        
        setScoutingResults(results);
        setShowResults(true);
        toast.success('Lead scouting complete!');
        
      } else {
        // Handle regular mode (single company)
        // Store the base request data in memory
        const requestData: LeadRequest = {
          ...leadRequest,
          userId: user?.id,
        };
        
        toast.info('Gathering stakeholder information...', { duration: 2000 });
        
        // 2. Scrape stakeholders
        const stakeholders = await scrapeStakeholders(
          leadRequest.targetClient, 
          leadRequest.targetClientWebsite
        );
        
        toast.info('Analyzing company intent...', { duration: 2000 });
        
        // 3. Scrape company intent
        const intent = await scrapeCompanyIntent(
          leadRequest.targetClient, 
          leadRequest.targetClientWebsite
        );
        
        toast.info('Generating sales plan...', { duration: 2000 });
        
        // 4. Generate sales plan
        const salesPlan = await generateSalesPlan(
          leadRequest.providerCompany,
          leadRequest.providerServices,
          leadRequest.targetClient,
          stakeholders,
          intent
        );
        
        // 5. Combine all data and set state
        const completeLeadData: LeadRequest = {
          ...requestData,
          stakeholders,
          intents: intent,
          salesPlan
        };
        
        setCurrentLeadData(completeLeadData);
        setShowResults(true);
        toast.success('Sales intelligence generation complete!');
      }
      
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
          
          {showResults && (
            <motion.div
              id="results"
              className="mt-8 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Sales Intelligence Results</h2>
              
              {scoutingResults ? (
                // Render scouting results
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Found {scoutingResults.length} potential companies that might need your services.
                  </p>
                  
                  {scoutingResults.map((company, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{company.name}</h3>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-500 hover:underline text-sm">
                            {company.website}
                          </a>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                          Match Score: {company.matchScore}/10
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm">{company.description}</p>
                      
                      {company.contacts.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Key Contacts:</h4>
                          <StakeholdersTable stakeholders={company.contacts} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <DownloadReportButton scoutingResults={scoutingResults} providerInfo={{
                    company: currentLeadData?.providerCompany || '',
                    services: currentLeadData?.providerServices || ''
                  }} />
                </div>
              ) : currentLeadData && (
                // Render single company results
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
                
                  {/* Sales Plan */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-xl font-bold mb-3">AI-Generated Sales Plan</h3>
                    {currentLeadData.salesPlan && (
                      <SalesPlanTabs salesPlan={currentLeadData.salesPlan} />
                    )}
                  </div>
                  
                  {/* Download Report Button */}
                  <div className="md:col-span-2 mt-6">
                    <DownloadReportButton leadData={currentLeadData} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default LeadGenAI;
