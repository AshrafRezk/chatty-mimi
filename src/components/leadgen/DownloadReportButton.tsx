
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadRequest, ScoutedCompany } from '@/types/leadGenAI';

interface DownloadReportButtonProps {
  leadData?: LeadRequest;
  scoutingResults?: ScoutedCompany[];
  providerInfo?: {
    company: string;
    services: string;
  };
}

const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({ 
  leadData, 
  scoutingResults,
  providerInfo
}) => {
  const handleDownload = () => {
    if (!leadData && !scoutingResults) return;

    let content = '';
    const timestamp = new Date().toLocaleDateString();
    
    if (scoutingResults && providerInfo) {
      // Generate report for scouting results
      content = `# Lead Scouting Report
Generated: ${timestamp}

## Your Company
${providerInfo.company}

## Your Services
${providerInfo.services}

## Potential Leads
${scoutingResults.map((company, index) => `
### ${index + 1}. ${company.name}
Website: ${company.website}
Match Score: ${company.matchScore}/10

${company.description}

#### Key Contacts:
${company.contacts.map(contact => `- ${contact.name}, ${contact.title} - ${contact.linkedinUrl}`).join('\n')}
`).join('\n')}`;
    } else if (leadData) {
      // Generate report for single company analysis
      content = `# Sales Intelligence Report
Generated: ${timestamp}

## Your Company
${leadData.providerCompany}

## Your Services/Products
${leadData.providerServices}

## Target Company
${leadData.targetClient}
Website: ${leadData.targetClientWebsite}

## Key Stakeholders
${leadData.stakeholders?.map((stakeholder, index) => 
  `${index + 1}. ${stakeholder.name}, ${stakeholder.title} - ${stakeholder.linkedinUrl}${stakeholder.email ? ` (${stakeholder.email})` : ''}`
).join('\n') || 'No stakeholders found.'}

## Company Intent Analysis
${leadData.intents?.activitySummary || 'No activity data available.'}
Urgency Score: ${leadData.intents?.urgencyScore || 'N/A'}/10

## Sales Plan

### Cold Call Script
${leadData.salesPlan?.coldCallScript || 'No cold call script generated.'}

### Email Sequence
${leadData.salesPlan?.emailSequence || 'No email sequence generated.'}

### Marketing Tips
${leadData.salesPlan?.marketingTips || 'No marketing tips generated.'}`;
    }

    // Create and download the file
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `sales-intelligence-report-${timestamp.replace(/\//g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Button 
      onClick={handleDownload}
      variant="outline"
      className="flex items-center"
      disabled={!leadData && !scoutingResults}
    >
      <Download className="w-4 h-4 mr-2" />
      Download Report
    </Button>
  );
};

export default DownloadReportButton;
