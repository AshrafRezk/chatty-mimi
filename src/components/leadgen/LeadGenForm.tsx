
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CompanySearchInput from './CompanySearchInput';
import { CompanySearchResult, LeadRequest } from '@/types/leadGenAI';
import { toast } from "sonner";

interface LeadGenFormProps {
  onSubmit: (leadRequest: LeadRequest) => Promise<void>;
  isProcessing: boolean;
}

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Legal",
  "Entertainment"
];

const LeadGenForm: React.FC<LeadGenFormProps> = ({ onSubmit, isProcessing }) => {
  const [providerCompany, setProviderCompany] = useState('');
  const [providerServices, setProviderServices] = useState('');
  const [targetClient, setTargetClient] = useState('');
  const [targetClientWebsite, setTargetClientWebsite] = useState('');
  const [scoutingMode, setScoutingMode] = useState(false);
  const [industry, setIndustry] = useState('Technology');

  const handleProviderCompanySelect = (company: CompanySearchResult) => {
    setProviderCompany(company.name);
  };

  const handleTargetClientSelect = (company: CompanySearchResult) => {
    setTargetClient(company.name);
    setTargetClientWebsite(company.website);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!providerCompany || !providerServices) {
      toast.error('Please provide your company name and services');
      return;
    }
    
    if (!scoutingMode && (!targetClient || !targetClientWebsite)) {
      toast.error('Please select a target company or enable scouting mode');
      return;
    }
    
    const leadRequest: LeadRequest = {
      providerCompany,
      providerServices,
      targetClient: scoutingMode ? '' : targetClient,
      targetClientWebsite: scoutingMode ? '' : targetClientWebsite,
      scoutingMode,
      industry: scoutingMode ? industry : undefined
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
          Enter details about your company and target to generate strategic sales insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Your Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Company Information</h3>
            
            <CompanySearchInput
              label="Your Company Name"
              value={providerCompany}
              onChange={setProviderCompany}
              onCompanySelect={handleProviderCompanySelect}
              placeholder="Enter your company name"
            />

            <div>
              <Label htmlFor="provider-services" className="block text-sm font-medium mb-1">
                Your Services / Products
              </Label>
              <Input
                id="provider-services"
                value={providerServices}
                onChange={(e) => setProviderServices(e.target.value)}
                placeholder="Describe your services or products"
              />
            </div>
          </div>

          {/* Scouting Mode Toggle */}
          <div className="flex items-center space-x-2 pt-4 pb-2 border-t">
            <Switch
              checked={scoutingMode}
              onCheckedChange={setScoutingMode}
              id="scouting-mode"
            />
            <Label htmlFor="scouting-mode">
              Lead Scouting Mode
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            {scoutingMode 
              ? "We'll find companies that might need your services based on your industry selection." 
              : "Target a specific company to generate tailored sales intelligence."}
          </p>

          {scoutingMode ? (
            /* Scouting Mode Options */
            <div className="pt-2">
              <Label htmlFor="industry-select" className="block text-sm font-medium mb-1">
                Target Industry
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry-select" className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            /* Single Target Company Mode */
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">Target Client Information</h3>
              
              <CompanySearchInput
                label="Target Client Company"
                value={targetClient}
                onChange={setTargetClient}
                onCompanySelect={handleTargetClientSelect}
                placeholder="Enter target company name"
              />

              <div>
                <Label htmlFor="target-website" className="block text-sm font-medium mb-1">
                  Target Client Website
                </Label>
                <Input
                  id="target-website"
                  value={targetClientWebsite}
                  onChange={(e) => setTargetClientWebsite(e.target.value)}
                  placeholder="e.g. example.com"
                />
              </div>
            </div>
          )}

          <CardFooter className="px-0 pb-0 pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                scoutingMode ? 'Find Potential Leads' : 'Generate Sales Insights'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadGenForm;
