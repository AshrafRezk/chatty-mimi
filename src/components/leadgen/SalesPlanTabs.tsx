
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadSalesPlan } from '@/types/leadGenAI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SalesPlanTabsProps {
  salesPlan: LeadSalesPlan;
}

const SalesPlanTabs: React.FC<SalesPlanTabsProps> = ({ salesPlan }) => {
  const [activeTab, setActiveTab] = useState("coldCall");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied to clipboard`),
      () => toast.error("Failed to copy text")
    );
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="coldCall" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="coldCall">Cold Call Script</TabsTrigger>
          <TabsTrigger value="emailSequence">Email Sequence</TabsTrigger>
          <TabsTrigger value="marketingTips">Marketing Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="coldCall" className="relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(salesPlan.coldCallScript, "Cold call script")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
            {salesPlan.coldCallScript}
          </div>
        </TabsContent>

        <TabsContent value="emailSequence" className="relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(salesPlan.emailSequence, "Email sequence")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
            {salesPlan.emailSequence}
          </div>
        </TabsContent>

        <TabsContent value="marketingTips" className="relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(salesPlan.marketingTips, "Marketing tips")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
            {salesPlan.marketingTips}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SalesPlanTabs;
