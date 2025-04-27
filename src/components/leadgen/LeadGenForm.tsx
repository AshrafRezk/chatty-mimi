
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CompanySearchInput from './CompanySearchInput';
import { CompanySearchResult, LeadRequest } from '@/types/leadGenAI';
import { toast } from "sonner";

interface LeadGenFormProps {
  onSubmit: (leadRequest: LeadRequest) => Promise<void>;
  isProcessing: boolean;
}

const LeadGenForm: React.FC<LeadGenFormProps> = ({ onSubmit, isProcessing }) => {
  const [providerCompany, setProviderCompany] = useState('');
  const [providerServices, setProviderServices] = useState('');
  const [targetClient, setTargetClient] = useState('');
  const [targetClientWebsite, setTargetClientWebsite] = useState('');

  const handleProviderCompanySelect = (company: CompanySearchResult) => {
    setProviderCompany(company.name);
  };

  const handleTargetClientSelect = (company: CompanySearchResult) => {
    setTargetClient(company.name);
    setTargetClientWebsite(company.website);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!providerCompany || !providerServices || !targetClient || !targetClientWebsite) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const leadRequest: LeadRequest = {
      providerCompany,
      providerServices,
      targetClient,
      targetClientWebsite
    };
    
    try {
      await onSubmit(leadRequest);
    } catch (error) {
      console.error('Error submitting lead request:', error);
      toast.error('Failed to process your request. Please try again.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Sales Intelligence</CardTitle>
        <CardDescription>
          Enter details about your company and your target client to generate strategic sales insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <CompanySearchInput
                label="Your Company Name"
                value={providerCompany}
                onChange={setProviderCompany}
                onCompanySelect={handleProviderCompanySelect}
                placeholder="Enter your company name"
              />

              <div>
                <label htmlFor="provider-services" className="block text-sm font-medium mb-1">
                  Your Services / Products
                </label>
                <Input
                  id="provider-services"
                  value={providerServices}
                  onChange={(e) => setProviderServices(e.target.value)}
                  placeholder="Describe your services or products"
                />
              </div>
            </div>

            <div className="space-y-4">
              <CompanySearchInput
                label="Target Client Company"
                value={targetClient}
                onChange={setTargetClient}
                onCompanySelect={handleTargetClientSelect}
                placeholder="Enter target company name"
              />

              <div>
                <label htmlFor="target-website" className="block text-sm font-medium mb-1">
                  Target Client Website
                </label>
                <Input
                  id="target-website"
                  value={targetClientWebsite}
                  onChange={(e) => setTargetClientWebsite(e.target.value)}
                  placeholder="e.g. example.com"
                />
              </div>
            </div>
          </div>

          <CardFooter className="px-0 pb-0 pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="animate-pulse">Processing...</span>
                </>
              ) : (
                'Generate Sales Insights'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadGenForm;
